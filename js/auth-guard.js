// Auth guard + Firestore sync
// Запускається на кожній сторінці уроку (крім login.html).
// Якщо користувач не авторизований — редирект на login.html.
// Якщо авторизований — показуємо сторінку одразу, Firestore синхронізується у фоні.
(function () {
  "use strict";

  var page = location.pathname.split("/").pop() || "login.html";

  // Ці сторінки самі обробляють авторизацію — guard їм не потрібен
  if (page === "login.html" || page === "profile.html") {
    return;
  }

  var auth = window._auth;
  var db = window._db;

  if (!auth || !db) {
    console.error("[AuthGuard] Firebase не ініціалізовано. Перевірте firebase-config.js");
    return;
  }

  // Ховаємо сторінку тільки на час перевірки авторизації (зазвичай < 200ms з кешу)
  document.documentElement.style.visibility = "hidden";

  var KEYS = {
    PROGRESS: "jscourse.progress",
    NOTES: "jscourse.notes",
    HIGHLIGHTS: "jscourse.highlights",
  };

  var _uid = null;

  // --- Допоміжники -----------------------------------------------------------

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(null, args);
      }, ms);
    };
  }

  function lsRead(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v !== null && v !== undefined ? v : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function lsWrite(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  // --- Firestore read (фонова синхронізація) ---------------------------------

  function syncFromFirestoreInBackground(uid) {
    var userRef = db.collection("users").doc(uid).collection("data");
    Promise.all([
      userRef.doc("progress").get(),
      userRef.doc("notes").get(),
      userRef.doc("highlights").get(),
    ])
      .then(function (snaps) {
        var progSnap = snaps[0],
          notesSnap = snaps[1],
          hlSnap = snaps[2];
        var changed = false;

        if (progSnap.exists && progSnap.data().lessons) {
          var merged = Object.assign({}, lsRead(KEYS.PROGRESS, {}), progSnap.data().lessons);
          lsWrite(KEYS.PROGRESS, merged);
          changed = true;
        }
        if (notesSnap.exists && notesSnap.data().lessons) {
          var mergedN = Object.assign({}, lsRead(KEYS.NOTES, {}), notesSnap.data().lessons);
          lsWrite(KEYS.NOTES, mergedN);
          changed = true;
        }
        if (hlSnap.exists && hlSnap.data().lessons) {
          var mergedH = Object.assign({}, lsRead(KEYS.HIGHLIGHTS, {}), hlSnap.data().lessons);
          lsWrite(KEYS.HIGHLIGHTS, mergedH);
          changed = true;
        }

        // Оновлюємо UI тільки якщо дані дійсно змінились
        if (changed) {
          window.dispatchEvent(new CustomEvent("jscourse:datasynced"));
          window.dispatchEvent(new CustomEvent("jscourse:progresschange"));
        }
      })
      .catch(function (err) {
        // Не критично — дані є в localStorage. Мовчимо при типових мережевих помилках.
        if (!err || err.code === "unavailable" || err.code === "permission-denied") return;
        console.warn("[AuthGuard] Firestore sync failed:", err.message);
      });
  }

  // --- Firestore write -------------------------------------------------------

  function fsWrite(docName, lessons) {
    if (!_uid) return;
    // Без merge:true — повна заміна документа. Це потрібно щоб видалення ключів
    // (нотатки, прогрес) теж відображались у Firestore, а не зберігались через deep merge.
    db.collection("users")
      .doc(_uid)
      .collection("data")
      .doc(docName)
      .set({ lessons: lessons })
      .catch(function (err) {
        if (!err || err.code === "unavailable") return;
        console.warn("[AuthGuard] Firestore write error:", err.message);
      });
  }

  var saveProgress = function (v) {
    fsWrite("progress", v);
  };
  var saveNotes = debounce(function (v) {
    fsWrite("notes", v);
  }, 1500);
  var saveHighlights = debounce(function (v) {
    fsWrite("highlights", v);
  }, 1000);

  // --- Публічне API (використовується course-tools.js) ----------------------

  window.CourseFirebase = {
    onWrite: function (key, val) {
      if (key === KEYS.PROGRESS) saveProgress(val);
      else if (key === KEYS.NOTES) saveNotes(val);
      else if (key === KEYS.HIGHLIGHTS) saveHighlights(val);
    },
    getUser: function () {
      return auth.currentUser;
    },
    signOut: function () {
      return auth.signOut().then(function () {
        localStorage.removeItem(KEYS.PROGRESS);
        localStorage.removeItem(KEYS.NOTES);
        localStorage.removeItem(KEYS.HIGHLIGHTS);
        window.location.href = "login.html";
      });
    },
  };

  // --- Основна перевірка авторизації ----------------------------------------

  auth.onAuthStateChanged(function (user) {
    if (!user) {
      try {
        sessionStorage.setItem("jscourse.returnUrl", location.href);
      } catch (e) {}
      window.location.href = "login.html";
      return;
    }

    _uid = user.uid;
    window._currentUser = user;

    // Показуємо сторінку одразу з даними localStorage — не чекаємо Firestore
    document.documentElement.style.visibility = "";
    window.dispatchEvent(new CustomEvent("jscourse:authready", { detail: { user: user } }));
    window.dispatchEvent(new CustomEvent("jscourse:progresschange"));

    // Оновлюємо профіль у Firestore (у фоні, не блокує)
    db.collection("users")
      .doc(user.uid)
      .set(
        {
          displayName: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      .catch(function () {});

    // Firestore синхронізується у фоні — UI оновиться після завершення
    syncFromFirestoreInBackground(user.uid);
  });
})();
