// Theme switcher — застосовує тему з localStorage відразу при завантаженні,
// до того як auth-guard.js показує сторінку (немає flash).
// Синхронізація з Firestore виконується через CourseFirebase.onWrite.
(function () {
  "use strict";

  var KEY = "jscourse.theme";
  var DEFAULT = "dark";
  var VALID = ["dark", "light"];

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return VALID.indexOf(v) !== -1 ? v : DEFAULT;
    } catch (e) {
      return DEFAULT;
    }
  }

  function applyTheme(theme) {
    if (VALID.indexOf(theme) === -1) theme = DEFAULT;
    document.documentElement.setAttribute("data-theme", theme);
  }

  // Застосовуємо одразу — сторінка ще прихована auth-guard.js,
  // тому флеш правильної теми не буде.
  applyTheme(stored());

  window.CourseTheme = {
    KEY: KEY,

    get: stored,

    set: function (theme) {
      if (VALID.indexOf(theme) === -1) return;
      applyTheme(theme);
      try {
        localStorage.setItem(KEY, theme);
      } catch (e) {}
      if (window.CourseFirebase) {
        window.CourseFirebase.onWrite(KEY, theme);
      }
      window.dispatchEvent(new CustomEvent("jscourse:themechange", { detail: { theme: theme } }));
    },

    toggle: function () {
      var next = stored() === "dark" ? "light" : "dark";
      window.CourseTheme.set(next);
      return next;
    },
  };
})();
