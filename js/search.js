// Клієнтський пошук по курсу (назви + заголовки + повний текст уроків).
// Використовує window.SEARCH_INDEX з js/search-index.js. Працює офлайн (file://).
(function () {
  "use strict";

  const index = window.SEARCH_INDEX || [];
  // Кешуємо приведені до нижнього регістру поля для швидкого пошуку.
  index.forEach(function (e) {
    e._t = e.t.toLowerCase();
    e._g = (e.g || "").toLowerCase();
    e._b = (e.b || "").toLowerCase();
  });

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeReg(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlight(escapedText, tokens) {
    if (!tokens.length) return escapedText;
    const re = new RegExp("(" + tokens.map(escapeReg).join("|") + ")", "gi");
    return escapedText.replace(re, "<mark>$1</mark>");
  }

  function snippet(entry, tokens) {
    const body = entry.b || "";
    const low = entry._b;
    let pos = -1;
    for (const tok of tokens) {
      const i = low.indexOf(tok);
      if (i !== -1 && (pos === -1 || i < pos)) pos = i;
    }
    if (pos === -1) pos = 0;
    const start = Math.max(0, pos - 40);
    let text = body.slice(start, start + 160);
    if (start > 0) text = "…" + text;
    if (start + 160 < body.length) text = text + "…";
    return highlight(escapeHtml(text), tokens);
  }

  function search(query) {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    const results = [];
    for (const e of index) {
      let score = 0;
      let matchedAll = true;
      for (const tok of tokens) {
        let s = 0;
        if (e._t.indexOf(tok) !== -1) s += 10;
        if (e._g.indexOf(tok) !== -1) s += 4;
        if (e._b.indexOf(tok) !== -1) s += 1;
        if (s === 0) {
          matchedAll = false;
          break;
        }
        score += s;
      }
      if (matchedAll) results.push({ e: e, score: score });
    }
    results.sort(function (a, b) {
      return b.score - a.score || a.e.t.localeCompare(b.e.t);
    });
    return results.slice(0, 25).map(function (r) {
      return r.e;
    }, tokens);
  }

  let activeIndex = -1;
  let currentResults = [];

  function buildBox() {
    const box = document.createElement("div");
    box.className = "search-box";

    const input = document.createElement("input");
    input.className = "search-input";
    input.type = "search";
    input.placeholder = "Пошук по курсу…  ( / )";
    input.setAttribute("aria-label", "Пошук по курсу");

    const results = document.createElement("div");
    results.className = "search-results";
    results.hidden = true;

    box.appendChild(input);
    box.appendChild(results);

    function render(list, tokens) {
      currentResults = list;
      activeIndex = -1;
      if (!tokens.length) {
        results.hidden = true;
        results.innerHTML = "";
        return;
      }
      if (!list.length) {
        results.hidden = false;
        results.innerHTML = '<div class="search-empty">Нічого не знайдено</div>';
        return;
      }
      results.innerHTML = list
        .map(function (e) {
          return (
            '<a class="search-result" href="' +
            e.h +
            '">' +
            '<span class="sr-section">' +
            escapeHtml(e.s) +
            "</span>" +
            '<span class="sr-title">' +
            highlight(escapeHtml(e.t), tokens) +
            "</span>" +
            '<span class="sr-snippet">' +
            snippet(e, tokens) +
            "</span>" +
            "</a>"
          );
        })
        .join("");
      results.hidden = false;
    }

    function setActive(i) {
      const items = results.querySelectorAll(".search-result");
      if (!items.length) return;
      activeIndex = (i + items.length) % items.length;
      items.forEach(function (el, idx) {
        el.classList.toggle("active", idx === activeIndex);
      });
      items[activeIndex].scrollIntoView({ block: "nearest" });
    }

    let timer;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        const q = input.value.trim();
        const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
        render(search(q), tokens);
      }, 120);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(activeIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(activeIndex - 1);
      } else if (e.key === "Enter") {
        const target =
          activeIndex >= 0 ? currentResults[activeIndex] : currentResults[0];
        if (target) location.href = target.h;
      } else if (e.key === "Escape") {
        input.value = "";
        render([], []);
        input.blur();
      }
    });

    return box;
  }

  function ensureBox() {
    const sidebar =
      document.getElementById("sidebar") || document.querySelector(".sidebar");
    if (!sidebar || sidebar.querySelector(".search-box")) return;
    sidebar.insertBefore(buildBox(), sidebar.firstChild);
  }

  function init() {
    if (!index.length) return;
    ensureBox();
    // Меню перебудовується при зміні прогресу — повертаємо поле пошуку.
    window.addEventListener("jscourse:progresschange", ensureBox);
    // Глобальний хоткей "/" фокусує пошук.
    document.addEventListener("keydown", function (e) {
      if (e.key !== "/") return;
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target.isContentEditable) {
        return;
      }
      const input = document.querySelector(".search-input");
      if (input) {
        e.preventDefault();
        input.focus();
      }
    });
  }

  if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
