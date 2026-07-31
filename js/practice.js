// Рушій інтерактивних практичних завдань.
// Два способи задати завдання:
//   1) Practice.load(mountId, tasks) — будує список завдань із масиву даних;
//   2) Practice.register(id, config) — прив'язка до вже наявної розмітки .runner.
// Код користувача виконується у його ж браузері й зберігається в localStorage.
(function () {
  "use strict";

  window.Practice = window.Practice || {
    _tasks: {},
    register: function (id, config) {
      this._tasks[id] = config;
    },
  };

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderError(output, message) {
    output.innerHTML = "";
    const div = document.createElement("div");
    div.className = "runner-error";
    div.textContent = message;
    output.appendChild(div);
  }

  // Словник підказок: ключові слова + поширені вбудовані сутності й методи.
  const AC_WORDS = [
    "const", "let", "var", "function", "return", "if", "else", "for", "while",
    "do", "switch", "case", "break", "continue", "class", "extends", "new",
    "this", "super", "typeof", "instanceof", "in", "of", "try", "catch",
    "finally", "throw", "async", "await", "yield", "true", "false", "null",
    "undefined", "console", "log", "error", "warn", "Math", "JSON", "Object",
    "Array", "String", "Number", "Boolean", "Symbol", "Map", "Set", "WeakMap",
    "Promise", "Date", "RegExp", "parseInt", "parseFloat", "isNaN", "Infinity",
    "NaN", "setTimeout", "setInterval", "length", "push", "pop", "shift",
    "unshift", "slice", "splice", "map", "filter", "reduce", "forEach", "find",
    "findIndex", "indexOf", "includes", "join", "split", "concat", "reverse",
    "sort", "some", "every", "flat", "keys", "values", "entries", "fromEntries",
    "assign", "freeze", "stringify", "parse", "toFixed", "toString",
    "toLowerCase", "toUpperCase", "trim", "replace", "repeat", "padStart",
    "startsWith", "endsWith", "charAt", "abs", "floor", "ceil", "round", "max",
    "min", "random", "pow", "sqrt", "then", "catch", "all", "resolve", "reject",
    "has", "get", "set", "add", "delete", "clear", "size",
  ];

  const AC_PAIRS = { "(": ")", "{": "}", "[": "]", "'": "'", '"': '"', "`": "`" };
  const AC_CLOSERS = [")", "}", "]", "'", '"', "`"];

  function insertAtCursor(ta, text) {
    ta.focus();
    let ok = false;
    try {
      ok = document.execCommand("insertText", false, text);
    } catch (e) {
      ok = false;
    }
    if (!ok) {
      const s = ta.selectionStart;
      const e = ta.selectionEnd;
      ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
      ta.selectionStart = ta.selectionEnd = s + text.length;
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  // Координати каретки в textarea (техніка "дзеркального div")
  function caretCoords(el, position) {
    const div = document.createElement("div");
    const cs = getComputedStyle(el);
    [
      "boxSizing", "width", "paddingTop", "paddingRight", "paddingBottom",
      "paddingLeft", "borderTopWidth", "borderRightWidth", "borderBottomWidth",
      "borderLeftWidth", "fontFamily", "fontSize", "fontWeight", "fontStyle",
      "letterSpacing", "lineHeight", "tabSize", "textIndent",
    ].forEach(function (p) {
      div.style[p] = cs[p];
    });
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    div.style.overflow = "hidden";
    div.style.top = "0";
    div.style.left = "0";
    div.textContent = el.value.slice(0, position);
    const span = document.createElement("span");
    span.textContent = el.value.slice(position) || ".";
    div.appendChild(span);
    el.parentNode.appendChild(div);
    const coords = { top: span.offsetTop, left: span.offsetLeft };
    el.parentNode.removeChild(div);
    return coords;
  }

  function enhanceEditor(ta) {
    if (ta.parentNode && getComputedStyle(ta.parentNode).position === "static") {
      ta.parentNode.style.position = "relative";
    }
    const popup = document.createElement("div");
    popup.className = "ac-popup";
    ta.parentNode.appendChild(popup);

    let items = [];
    let active = 0;
    let wordStart = 0;
    let wordEnd = 0;

    function hide() {
      popup.style.display = "none";
      items = [];
    }
    function isOpen() {
      return popup.style.display === "block";
    }
    function renderActive() {
      const nodes = popup.querySelectorAll(".ac-item");
      nodes.forEach(function (n, i) {
        n.classList.toggle("active", i === active);
      });
      if (nodes[active]) nodes[active].scrollIntoView({ block: "nearest" });
    }
    function accept() {
      const chosen = items[active];
      if (chosen == null) return;
      ta.selectionStart = wordStart;
      ta.selectionEnd = wordEnd;
      insertAtCursor(ta, chosen);
      hide();
    }
    function show(matches) {
      items = matches;
      active = 0;
      popup.innerHTML = matches
        .map(function (w, i) {
          return (
            '<div class="ac-item' +
            (i === 0 ? " active" : "") +
            '" data-i="' +
            i +
            '">' +
            w +
            "</div>"
          );
        })
        .join("");
      const cs = getComputedStyle(ta);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
      const c = caretCoords(ta, wordStart);
      popup.style.left = ta.offsetLeft + c.left - ta.scrollLeft + "px";
      popup.style.top = ta.offsetTop + c.top - ta.scrollTop + lh + "px";
      popup.style.display = "block";
    }
    function update() {
      if (ta.selectionStart !== ta.selectionEnd) {
        hide();
        return;
      }
      const pos = ta.selectionStart;
      const m = ta.value.slice(0, pos).match(/[A-Za-z_$][\w$]*$/);
      if (!m) {
        hide();
        return;
      }
      const word = m[0];
      const ids = new Set(AC_WORDS);
      let mm;
      const re = /[A-Za-z_$][\w$]*/g;
      while ((mm = re.exec(ta.value))) ids.add(mm[0]);
      const low = word.toLowerCase();
      const matches = Array.prototype.slice
        .call(ids)
        .filter(function (w) {
          return w !== word && w.toLowerCase().indexOf(low) === 0;
        })
        .sort(function (a, b) {
          return (
            (a.indexOf(word) === 0 ? 0 : 1) - (b.indexOf(word) === 0 ? 0 : 1) ||
            a.length - b.length ||
            a.localeCompare(b)
          );
        })
        .slice(0, 8);
      if (!matches.length) {
        hide();
        return;
      }
      wordStart = pos - word.length;
      wordEnd = pos;
      show(matches);
    }

    popup.addEventListener("mousedown", function (e) {
      const item = e.target.closest(".ac-item");
      if (!item) return;
      e.preventDefault();
      active = Number(item.dataset.i);
      accept();
    });

    ta.addEventListener("keydown", function (e) {
      if (isOpen()) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          active = (active + 1) % items.length;
          renderActive();
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          active = (active - 1 + items.length) % items.length;
          renderActive();
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          accept();
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          hide();
          return;
        }
      }

      const val = ta.value;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;

      if (e.key === "Tab") {
        e.preventDefault();
        insertAtCursor(ta, "  ");
        return;
      }

      if (e.key === "Enter") {
        const lineStart = val.lastIndexOf("\n", s - 1) + 1;
        const indent = (val.slice(lineStart, s).match(/^[ \t]*/) || [""])[0];
        const before = val[s - 1];
        const after = val[en];
        if (before && "{[(".indexOf(before) !== -1) {
          e.preventDefault();
          const extra = indent + "  ";
          if (after && "}])".indexOf(after) !== -1) {
            insertAtCursor(ta, "\n" + extra + "\n" + indent);
            ta.selectionStart = ta.selectionEnd = s + 1 + extra.length;
          } else {
            insertAtCursor(ta, "\n" + extra);
          }
          hide();
          return;
        }
        if (indent) {
          e.preventDefault();
          insertAtCursor(ta, "\n" + indent);
          hide();
          return;
        }
        return;
      }

      if (AC_PAIRS[e.key]) {
        const ch = e.key;
        const close = AC_PAIRS[ch];
        if (ch === close && val[s] === ch && s === en) {
          e.preventDefault();
          ta.selectionStart = ta.selectionEnd = s + 1;
          return;
        }
        e.preventDefault();
        if (s !== en) {
          insertAtCursor(ta, ch + val.slice(s, en) + close);
          ta.selectionStart = s + 1;
          ta.selectionEnd = en + 1;
        } else {
          insertAtCursor(ta, ch + close);
          ta.selectionStart = ta.selectionEnd = s + 1;
        }
        return;
      }

      if (AC_CLOSERS.indexOf(e.key) !== -1 && val[s] === e.key && s === en) {
        e.preventDefault();
        ta.selectionStart = ta.selectionEnd = s + 1;
        return;
      }

      if (e.key === "Backspace" && s === en && s > 0) {
        const b = val[s - 1];
        if (AC_PAIRS[b] && AC_PAIRS[b] === val[s]) {
          e.preventDefault();
          ta.selectionStart = s - 1;
          ta.selectionEnd = s + 1;
          try {
            document.execCommand("delete");
          } catch (err) {
            ta.value = val.slice(0, s - 1) + val.slice(s + 1);
            ta.selectionStart = ta.selectionEnd = s - 1;
            ta.dispatchEvent(new Event("input", { bubbles: true }));
          }
          hide();
          return;
        }
      }
    });

    ta.addEventListener("input", update);
    ta.addEventListener("click", hide);
    ta.addEventListener("blur", function () {
      setTimeout(hide, 150);
    });
  }

  function runTask(id, config) {
    const root = document.getElementById(id);
    if (!root) {
      return;
    }
    const textarea = root.querySelector(".runner-code");
    const runBtn = root.querySelector(".runner-run");
    const resetBtn = root.querySelector(".runner-reset");
    const output = root.querySelector(".runner-output");
    if (!textarea || !runBtn || !output) {
      return;
    }

    const starter = textarea.value;
    const KEY = "jscourse.practice." + location.pathname.split("/").pop() + "." + id;

    try {
      const saved = localStorage.getItem(KEY);
      if (saved !== null) {
        textarea.value = saved;
      }
    } catch (e) {
      /* ignore */
    }

    textarea.addEventListener("input", function () {
      try {
        localStorage.setItem(KEY, textarea.value);
      } catch (e) {
        /* ignore */
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        textarea.value = starter;
        try {
          localStorage.removeItem(KEY);
        } catch (e) {
          /* ignore */
        }
        output.innerHTML = "";
      });
    }

    // Розумне редагування + автодоповнення
    enhanceEditor(textarea);

    runBtn.addEventListener("click", function () {
      output.innerHTML = "";
      const code = textarea.value;
      const entries = config.entry
        ? Array.isArray(config.entry)
          ? config.entry
          : [config.entry]
        : [];
      const logs = [];
      let exported = {};

      try {
        const ret =
          "return {" +
          entries
            .map((n) => n + ': (typeof ' + n + ' !== "undefined") ? ' + n + " : undefined")
            .join(",") +
          "};";
        const fn = new Function("console", code + "\n" + ret);
        const fakeConsole = {
          log: function () {
            logs.push(Array.prototype.join.call(arguments, " "));
          },
          error: function () {
            logs.push(Array.prototype.join.call(arguments, " "));
          },
          warn: function () {
            logs.push(Array.prototype.join.call(arguments, " "));
          },
        };
        exported = fn(fakeConsole) || {};
      } catch (err) {
        renderError(output, "Помилка виконання: " + err.message);
        return;
      }

      let passed = 0;
      const list = document.createElement("ul");
      list.className = "runner-results";

      config.tests.forEach(function (t) {
        let ok = false;
        let extra = "";
        try {
          ok = !!t.test(exported, logs);
        } catch (e) {
          ok = false;
          extra = " (" + e.message + ")";
        }
        if (ok) {
          passed += 1;
        }
        const li = document.createElement("li");
        li.className = ok ? "pass" : "fail";
        li.textContent = (ok ? "✓ " : "✗ ") + t.name + extra;
        list.appendChild(li);
      });

      const summary = document.createElement("div");
      const allPass = passed === config.tests.length;
      summary.className = "runner-summary " + (allPass ? "all-pass" : "some-fail");
      summary.textContent =
        (allPass ? "✓ Усі тести пройдено: " : "Пройдено ") +
        passed +
        " / " +
        config.tests.length;
      output.appendChild(summary);
      output.appendChild(list);
    });
  }

  // Будує список завдань із масиву даних.
  window.Practice.load = function (mountId, tasks) {
    const mount = document.getElementById(mountId);
    if (!mount) {
      return;
    }
    tasks.forEach(function (task, idx) {
      const key = task.entry
        ? Array.isArray(task.entry)
          ? task.entry[0]
          : task.entry
        : "t" + idx;
      const id = mountId + "-" + key;

      const wrap = document.createElement("div");
      wrap.className = "task";

      const h = document.createElement("h2");
      h.textContent = idx + 1 + ". " + task.title;
      wrap.appendChild(h);

      if (task.desc) {
        const p = document.createElement("p");
        p.className = "task-goal";
        p.innerHTML = task.desc;
        wrap.appendChild(p);
      }

      const runner = document.createElement("div");
      runner.className = "runner";
      runner.id = id;

      const ta = document.createElement("textarea");
      ta.className = "runner-code";
      ta.spellcheck = false;
      ta.value = task.starter || "";
      runner.appendChild(ta);

      const actions = document.createElement("div");
      actions.className = "runner-actions";
      const runBtn = document.createElement("button");
      runBtn.type = "button";
      runBtn.className = "runner-run";
      runBtn.textContent = "Запустити";
      const resetBtn = document.createElement("button");
      resetBtn.type = "button";
      resetBtn.className = "runner-reset";
      resetBtn.textContent = "Скинути";
      actions.appendChild(runBtn);
      actions.appendChild(resetBtn);
      runner.appendChild(actions);

      const out = document.createElement("div");
      out.className = "runner-output";
      runner.appendChild(out);

      wrap.appendChild(runner);

      if (task.hint) {
        const d = document.createElement("details");
        d.className = "hint";
        d.innerHTML = "<summary>Підказка</summary><p>" + task.hint + "</p>";
        wrap.appendChild(d);
      }
      if (task.solution) {
        const d = document.createElement("details");
        d.className = "solution";
        d.innerHTML =
          "<summary>Рішення</summary><pre class=\"language-js\"><code class=\"language-js\">" +
          escapeHtml(task.solution) +
          "</code></pre>";
        wrap.appendChild(d);
      }

      mount.appendChild(wrap);
      runTask(id, { entry: task.entry, tests: task.tests });
    });

    if (window.Prism && typeof window.Prism.highlightAllUnder === "function") {
      window.Prism.highlightAllUnder(mount);
    }
  };

  function init() {
    const tasks = window.Practice._tasks;
    Object.keys(tasks).forEach(function (id) {
      runTask(id, tasks[id]);
    });
  }

  if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
