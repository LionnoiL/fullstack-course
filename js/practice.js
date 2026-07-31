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

    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value =
          textarea.value.slice(0, start) + "  " + textarea.value.slice(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }
    });

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
