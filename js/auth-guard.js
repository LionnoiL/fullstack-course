// Auth guard + Firestore sync
// Запускається на кожній сторінці уроку (крім login.html).
// Якщо користувач не авторизований — редирект на login.html.
// Якщо авторизований — синхронізує дані Firestore → localStorage.
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

  // Ховаємо сторінку до перевірки авторизації (уникаємо FOUC)
  document.documentElement.style.visibility = "hidden";

  var KEYS = {
    PROGRESS:   "jscourse.progress",
    NOTES:      "jscourse.notes",
    HIGHLIGHTS: "jscourse.highlights",
  };

  var _uid = null;

  // --- Допоміжники -----------------------------------------------------------

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, ms);
    };
  }

  function lsRead(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return (v !== null && v !== undefined) ? v : fallback;
    } catch (e) { return fallback; }
  }

  function lsWrite(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  // --- Firestore read --------------------------------------------------------

  // Синхронізація даних. Максимальний час очікування — SYNC_TIMEOUT мс,
  // після чого сторінка показується з даними з localStorage (не блокуємо UI).
  var SYNC_TIMEOUT = 5000;

  function syncFromFirestore(uid) {
    var userRef = db.collection("users").doc(uid).collection("data");

    var fetchPromise = Promise.all([
      userRef.doc("progress").get(),
      userRef.doc("notes").get(),
      userRef.doc("highlights").get(),
    ]).then(function (snaps) {
      var progSnap = snaps[0], notesSnap = snaps[1], hlSnap = snaps[2];

      // Firestore виграє: merge(localStorage, Firestore) → localStorage
      if (progSnap.exists) {
        var merged = Object.assign({}, lsRead(KEYS.PROGRESS, {}), progSnap.data().lessons || {});
        lsWrite(KEYS.PROGRESS, merged);
      }
      if (notesSnap.exists) {
        var mergedN = Object.assign({}, lsRead(KEYS.NOTES, {}), notesSnap.data().lessons || {});
        lsWrite(KEYS.NOTES, mergedN);
      }
      if (hlSnap.exists) {
        var mergedH = Object.assign({}, lsRead(KEYS.HIGHLIGHTS, {}), hlSnap.data().lessons || {});
        lsWrite(KEYS.HIGHLIGHTS, mergedH);
      }
    }).catch(function (err) {
      // Офлайн або заблоковано ad-блокером — продовжуємо з localStorage.
      // Помилка не критична, тому не виводимо stack trace.
      if (err && err.code === "unavailable") {
        console.info("[AuthGuard] Firestore недоступний (офлайн або заблоковано). Використовуємо localStorage.");
      } else {
        console.warn("[AuthGuard] Firestore sync failed:", err && err.message);
      }
    });

    // Таймаут: якщо Firestore не відповідає — не тримаємо сторінку прихованою
    var timeoutPromise = new Promise(function (resolve) {
      setTimeout(function () {
        console.info("[AuthGuard] Firestore sync timeout — показуємо сторінку з localStorage.");
        resolve();
      }, SYNC_TIMEOUT);
    });

    return Promise.race([fetchPromise, timeoutPromise]);
  }

  // --- Firestore write -------------------------------------------------------

  function fsWrite(docName, lessons) {
    if (!_uid) return;
    db.collection("users").doc(_uid).collection("data").doc(docName)
      .set({ lessons: lessons }, { merge: true })
      .catch(function (err) {
        // Офлайн / заблоковано — дані вже є в localStorage, не шумимо
        if (!err || err.code === "unavailable") return;
        console.warn("[AuthGuard] Firestore write error:", err.message);
      });
  }

  var saveProgress   = function (v) { fsWrite("progress", v); };
  var saveNotes      = debounce(function (v) { fsWrite("notes", v); }, 1500);
  var saveHighlights = debounce(function (v) { fsWrite("highlights", v); }, 1000);

  // --- Публічне API (використовується course-tools.js) ----------------------

  window.CourseFirebase = {
    onWrite: function (key, val) {
      if (key === KEYS.PROGRESS)   saveProgress(val);
      else if (key === KEYS.NOTES) saveNotes(val);
      else if (key === KEYS.HIGHLIGHTS) saveHighlights(val);
    },
    getUser: function () { return auth.currentUser; },
    signOut: function () {
      return auth.signOut().then(function () {
        // Очищаємо тільки дані курсу, не весь localStorage
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
      // Зберігаємо URL для повернення після входу
      try { sessionStorage.setItem("jscourse.returnUrl", location.href); } catch (e) {}
      window.location.href = "login.html";
      return;
    }

    _uid = user.uid;
    window._currentUser = user;

    // Оновлюємо профіль у Firestore
    db.collection("users").doc(user.uid).set({
      displayName: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true }).catch(function () {});

    // Синхронізуємо дані → показуємо сторінку
    syncFromFirestore(user.uid).then(function () {
      document.documentElement.style.visibility = "";
      window.dispatchEvent(new CustomEvent("jscourse:authready", { detail: { user: user } }));
      window.dispatchEvent(new CustomEvent("jscourse:progresschange"));
      window.dispatchEvent(new CustomEvent("jscourse:datasynced"));
    });
  });

})();
