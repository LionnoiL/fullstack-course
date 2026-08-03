// Theme engine: завантажує JSON-файл теми, застосовує CSS-змінні до <html>,
// кешує vars у localStorage щоб уникнути flash при перезавантаженні.
(function () {
  "use strict";

  var ID_KEY = "jscourse.theme";
  var VARS_KEY = "jscourse.theme.vars";
  var DEFAULT_ID = "nord";

  // Реєстр доступних тем (порядок визначає порядок у пікері)
  var THEMES = [
    { id: "midnight-indigo", name: "Midnight Indigo", type: "dark",  preview: ["#0f0f1a", "#89b4fa", "#cba6f7", "#a6e3a1"] },
    { id: "tokyo-night",     name: "Tokyo Night",     type: "dark",  preview: ["#1a1b26", "#7aa2f7", "#bb9af7", "#9ece6a"] },
    { id: "nord",            name: "Nord",            type: "dark",  preview: ["#2e3440", "#88c0d0", "#a3be8c", "#b48ead"] },
    { id: "solarized-light", name: "Solarized Light", type: "light", preview: ["#fdf6e3", "#268bd2", "#859900", "#2aa198"] },
    { id: "github-light",    name: "GitHub Light",    type: "light", preview: ["#ffffff", "#0969da", "#8250df", "#1a7f37"] },
  ];

  // ── Helpers ────────────────────────────────────────────────

  function lsGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }

  function applyVars(vars) {
    var root = document.documentElement;
    Object.keys(vars).forEach(function (k) {
      root.style.setProperty(k, vars[k]);
    });
  }

  // Шлях до JSON відносно pages/ (всі сторінки там)
  function themePath(id) {
    return "../js/themes/" + id + ".json";
  }

  // ── Ініціалізація ──────────────────────────────────────────

  var _currentId = lsGet(ID_KEY) || DEFAULT_ID;

  // Застосовуємо кешовані vars миттєво (сторінка ще прихована auth-guard'ом)
  var _cached = lsGet(VARS_KEY);
  if (_cached) {
    try { applyVars(JSON.parse(_cached)); } catch (e) {}
  }

  // ── Завантаження теми ──────────────────────────────────────

  function loadTheme(id, callback) {
    var meta = THEMES.find(function (t) { return t.id === id; });
    if (!meta) { id = DEFAULT_ID; meta = THEMES[0]; }

    fetch(themePath(id))
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        applyVars(data.vars);
        lsSet(ID_KEY, id);
        lsSet(VARS_KEY, JSON.stringify(data.vars));
        _currentId = id;

        window.dispatchEvent(new CustomEvent("jscourse:themechange", {
          detail: { id: id, meta: meta }
        }));

        if (callback) callback(id);
      })
      .catch(function (err) {
        console.warn("[Theme] Failed to load theme '" + id + "':", err.message);
        if (id !== DEFAULT_ID) loadTheme(DEFAULT_ID, callback);
      });
  }

  // Верифікуємо/оновлюємо тему у фоні після завантаження сторінки
  loadTheme(_currentId);

  // ── Публічне API ───────────────────────────────────────────

  window.CourseTheme = {
    THEMES: THEMES,

    get: function () { return _currentId; },

    set: function (id, callback) {
      loadTheme(id, function (resolvedId) {
        if (window.CourseFirebase) {
          // Звичайні сторінки уроків: через CourseFirebase
          window.CourseFirebase.onWrite("jscourse.theme", resolvedId);
        } else if (window._db && window._currentUser) {
          // profile.html: auth-guard повертає раніше, тому пишемо напряму
          window._db
            .collection("users")
            .doc(window._currentUser.uid)
            .collection("data")
            .doc("preferences")
            .set({ theme: resolvedId }, { merge: true })
            .catch(function () {});
        }
        if (callback) callback(resolvedId);
      });
    },

    getMeta: function (id) {
      return THEMES.find(function (t) { return t.id === (id || _currentId); }) || THEMES[0];
    },
  };
})();
