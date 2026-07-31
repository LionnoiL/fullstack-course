// Єдине джерело навігації для всіх уроків курсу.
// Щоб додати новий урок — допиши рядок у масив lessons нижче.
(function () {
  "use strict";

  const lessons = [
    ["intro.html", "Що таке JavaScript?"],
    ["adding-script.html", "Підключення скрипта"],
    ["devtools.html", "Вкладка Console в Chrome DevTools"],
    ["syntax.html", "Синтаксис мови"],
    ["vars-and-types.html", "Змінні і типи даних"],
    ["input-output.html", "Взаємодія з користувачем"],
    ["operators.html", "Основні оператори"],
    ["numbers.html", "Числа"],
    ["strings.html", "Рядки"],
    ["regexp.html", "Регулярні вирази"],
    ["logic-gates.html", "Логічні оператори"],
    ["branching.html", "Розгалуження"],
    ["variable-scope.html", "Область видимості"],
    ["loops.html", "Цикли"],
    ["arrays.html", "Масиви"],
    ["val-and-ref.html", "Присвоєння за посиланням і за значенням"],
    ["array-methods.html", "Методи масиву"],
    ["array-methods-2.html", "Перебираючі методи масиву"],
    ["functions.html", "Функції"],
    ["pure-functions.html", "Чисті функції"],
    ["imperative-vs-declarative.html", "Імперативний і декларативний код"],
    ["scope.html", "Область видимості (функції)"],
    ["arrow-fns.html", "Стрілкові функції"],
    ["recursion.html", "Рекурсія"],
    ["objects.html", "Об'єкти"],
    ["object-iteration.html", "Перебір об'єкта"],
    ["modern-operators.html", "Опціональний ланцюжок і ??"],
    ["spread-rest.html", "Операції spread і rest"],
    ["destructuring.html", "Деструктуризація"],
    ["map-set.html", "Map, Set, WeakMap"],
    ["symbols.html", "Symbol"],
    ["iterators-generators.html", "Ітератори та генератори"],
    ["callbacks.html", "Функції зворотного виклику"],
    ["js-internals.html", "Стек викликів і лексичне оточення"],
    ["closures.html", "Замикання"],
    ["context.html", "Ключове слово this"],
    ["error-handling.html", "Обробка помилок"],
    ["oop.html", "ООП"],
    ["prototypes.html", "Прототипи"],
    ["constructors.html", "Конструктори"],
    ["classes.html", "ES6 класи"],
    ["dom-basics.html", "Об'єктна модель документа"],
    ["dom-traversal.html", "Навігація по DOM"],
    ["dom-manipulation.html", "Створення та видалення вузлів"],
    ["dom-construction.html", "Процес побудови веб-сторінки"],
    ["props-attrs.html", "DOM-властивості і атрибути"],
    ["events.html", "Події"],
    ["events-2.html", "Поширення. Спливання. Делегування"],
    ["forms.html", "Форми та валідація"],
    ["chatty-events.html", "Throttle і Debounce"],
    ["intersection-observer.html", "IntersectionObserver API"],
    ["bom.html", "Об'єктна модель браузера (BOM)"],
    ["npm.html", "NPM"],
    ["modules.html", "Модульність коду"],
    ["webpack.html", "Webpack"],
    ["libs.html", "Плагіни і бібліотеки"],
    ["templating.html", "Шаблонізація"],
    ["json.html", "JSON"],
    ["clientside-storage.html", "Зберігання інформації на клієнті"],
    ["timers.html", "Таймери: setTimeout і setInterval"],
    ["async-code.html", "Асинхронний JavaScript"],
    ["date.html", "Клас Date"],
    ["promise-api.html", "Promise API"],
    ["async-await.html", "async / await"],
    ["event-loop.html", "Цикл подій"],
    ["protocols.html", "Протоколи передачі даних"],
    ["rest-api.html", "REST API"],
    ["fetch.html", "AJAX і Fetch API"],
    ["cors.html", "Крос-доменні запити"],
    ["node.html", "Node.js"],
  ];

  const current = location.pathname.split("/").pop() || "intro.html";

  const ul = document.createElement("ul");
  for (const [href, title] of lessons) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href;
    a.textContent = title;
    if (href === current) {
      a.className = "active";
    }
    li.appendChild(a);
    ul.appendChild(li);
  }

  const sidebar = document.getElementById("sidebar") ||
    document.querySelector(".sidebar");
  if (sidebar) {
    sidebar.innerHTML = "";
    sidebar.appendChild(ul);

    // Прокрутити активний пункт у видиму область бічної панелі.
    const active = ul.querySelector("a.active");
    if (active && typeof active.scrollIntoView === "function") {
      active.scrollIntoView({ block: "nearest" });
    }
  }
})();
