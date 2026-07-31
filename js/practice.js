// Рушій інтерактивних практичних завдань.
// Сторінка реєструє завдання через Practice.register(id, config), а цей скрипт
// підключає редактор коду, кнопку "Запустити" й проганяє код через авто-тести.
// Код користувача виконується у його ж браузері й зберігається в localStorage.
(function () {
  "use strict";

  window.Practice = window.Practice || {
    _tasks: {},
    register: function (id, config) {
      this._tasks[id] = config;
    },
  };

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
    const KEY = "jscourse.practice." + id;

    // Відновлюємо збережений код
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

    // Дозволяємо Tab у полі коду замість втрати фокуса
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
