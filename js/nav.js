// Єдине джерело навігації для всіх уроків курсу.
// Меню згруповане в розділи, кожен з яких можна згортати/розгортати.
// Щоб додати урок — допиши рядок у відповідний розділ масиву sections.
// Щоб додати новий розділ (напр. TypeScript, React) — додай новий обʼєкт.
(function () {
  "use strict";

  const sections = [
    {
      title: "HTML",
      lessons: [
        ["html-intro.html", "Основи HTML"],
        ["html-text.html", "Текст і списки"],
        ["html-links-images.html", "Посилання та зображення"],
        ["html-semantics.html", "Семантична розмітка"],
        ["html-forms.html", "Форми"],
        ["html-tables.html", "Таблиці"],
        ["html-meta-seo.html", "Метадані та SEO"],
        ["html-a11y.html", "Доступність (a11y)"],
      ],
    },
    {
      title: "CSS",
      lessons: [
        ["css-intro.html", "Підключення та синтаксис"],
        ["css-selectors.html", "Селектори та специфічність"],
        ["css-box-model.html", "Блокова модель"],
        ["css-typography.html", "Кольори та типографіка"],
        ["css-positioning.html", "Позиціонування"],
        ["css-flexbox.html", "Flexbox"],
        ["css-grid.html", "Grid"],
        ["css-responsive.html", "Адаптивність"],
        ["css-transitions.html", "Переходи та анімації"],
      ],
    },
    {
      title: "Основи",
      lessons: [
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
      ],
    },
    {
      title: "Масиви",
      lessons: [
        ["arrays.html", "Масиви"],
        ["val-and-ref.html", "Присвоєння за посиланням і за значенням"],
        ["array-methods.html", "Методи масиву"],
        ["array-methods-2.html", "Перебираючі методи масиву"],
      ],
    },
    {
      title: "Функції",
      lessons: [
        ["functions.html", "Функції"],
        ["pure-functions.html", "Чисті функції"],
        ["imperative-vs-declarative.html", "Імперативний і декларативний код"],
        ["scope.html", "Область видимості (функції)"],
        ["arrow-fns.html", "Стрілкові функції"],
        ["recursion.html", "Рекурсія"],
      ],
    },
    {
      title: "Об'єкти та колекції",
      lessons: [
        ["objects.html", "Об'єкти"],
        ["object-iteration.html", "Перебір об'єкта"],
        ["modern-operators.html", "Опціональний ланцюжок і ??"],
        ["spread-rest.html", "Операції spread і rest"],
        ["destructuring.html", "Деструктуризація"],
        ["map-set.html", "Map, Set, WeakMap"],
        ["symbols.html", "Symbol"],
        ["iterators-generators.html", "Ітератори та генератори"],
      ],
    },
    {
      title: "Просунуті теми",
      lessons: [
        ["callbacks.html", "Функції зворотного виклику"],
        ["js-internals.html", "Стек викликів і лексичне оточення"],
        ["closures.html", "Замикання"],
        ["context.html", "Ключове слово this"],
        ["error-handling.html", "Обробка помилок"],
      ],
    },
    {
      title: "ООП",
      lessons: [
        ["oop.html", "ООП"],
        ["prototypes.html", "Прототипи"],
        ["constructors.html", "Конструктори"],
        ["classes.html", "ES6 класи"],
      ],
    },
    {
      title: "DOM",
      lessons: [
        ["dom-basics.html", "Об'єктна модель документа"],
        ["dom-traversal.html", "Навігація по DOM"],
        ["dom-manipulation.html", "Створення та видалення вузлів"],
        ["dom-construction.html", "Процес побудови веб-сторінки"],
        ["props-attrs.html", "DOM-властивості і атрибути"],
      ],
    },
    {
      title: "Події та браузер",
      lessons: [
        ["events.html", "Події"],
        ["events-2.html", "Поширення. Спливання. Делегування"],
        ["forms.html", "Форми та валідація"],
        ["chatty-events.html", "Throttle і Debounce"],
        ["intersection-observer.html", "IntersectionObserver API"],
        ["bom.html", "Об'єктна модель браузера (BOM)"],
      ],
    },
    {
      title: "Інструменти та збірка",
      lessons: [
        ["npm.html", "NPM"],
        ["modules.html", "Модульність коду"],
        ["webpack.html", "Webpack"],
        ["libs.html", "Плагіни і бібліотеки"],
        ["templating.html", "Шаблонізація"],
      ],
    },
    {
      title: "Дані",
      lessons: [
        ["json.html", "JSON"],
        ["clientside-storage.html", "Зберігання інформації на клієнті"],
      ],
    },
    {
      title: "Асинхронність",
      lessons: [
        ["timers.html", "Таймери: setTimeout і setInterval"],
        ["async-code.html", "Асинхронний JavaScript"],
        ["date.html", "Клас Date"],
        ["promise-api.html", "Promise API"],
        ["async-await.html", "async / await"],
        ["event-loop.html", "Цикл подій"],
      ],
    },
    {
      title: "Мережа та сервер",
      lessons: [
        ["protocols.html", "Протоколи передачі даних"],
        ["rest-api.html", "REST API"],
        ["fetch.html", "AJAX і Fetch API"],
        ["cors.html", "Крос-доменні запити"],
        ["node.html", "Node.js"],
      ],
    },
    {
      title: "Бекенд",
      lessons: [
        ["backend-intro.html", "Вступ до бекенду"],
        ["backend-express.html", "Express: сервер і маршрути"],
        ["backend-middleware.html", "Middleware"],
        ["backend-rest.html", "Побудова REST API"],
        ["backend-databases.html", "Бази даних"],
        ["backend-orm.html", "ORM (Prisma)"],
        ["backend-auth.html", "Автентифікація"],
        ["backend-env.html", "Конфігурація та оточення"],
      ],
    },
    {
      title: "TypeScript",
      lessons: [
        ["ts-intro.html", "Знайомство з TypeScript"],
        ["ts-setup.html", "Встановлення і tsconfig"],
        ["ts-basic-types.html", "Базові типи"],
        ["ts-functions.html", "Типізація функцій"],
        ["ts-interfaces.html", "Інтерфейси та type"],
        ["ts-narrowing.html", "Об'єднання і звуження типів"],
        ["ts-generics.html", "Дженерики"],
        ["ts-classes.html", "Класи в TypeScript"],
        ["ts-utility-types.html", "Utility Types"],
        ["ts-advanced-types.html", "Просунуті типи"],
        ["ts-decorators.html", "Декоратори"],
      ],
    },
    {
      title: "React",
      lessons: [
        ["react-intro.html", "Що таке React"],
        ["react-jsx.html", "JSX"],
        ["react-components.html", "Компоненти"],
        ["react-props.html", "Props"],
        ["react-state.html", "Стан і useState"],
        ["react-events.html", "Обробка подій"],
        ["react-lists.html", "Списки та умовний рендеринг"],
        ["react-effect.html", "useEffect і побічні ефекти"],
        ["react-forms.html", "Форми"],
        ["react-context.html", "Context API"],
        ["react-custom-hooks.html", "Кастомні хуки"],
        ["react-router.html", "Роутинг"],
        ["react-performance.html", "Оптимізація"],
      ],
    },
    {
      title: "Супровідні теми",
      lessons: [
        ["git-basics.html", "Git і командний рядок"],
        ["testing.html", "Тестування"],
        ["web-security.html", "Веббезпека"],
        ["deployment.html", "Деплой"],
      ],
    },
  ];

  const STORAGE_KEY = "jscourse.nav.sections";
  const PROGRESS_KEY = "jscourse.progress";
  const current = location.pathname.split("/").pop() || "intro.html";

  // Збережений стан розділів: { "Назва розділу": "open" | "closed" }
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    saved = {};
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (e) {
      /* приватний режим тощо — просто ігноруємо */
    }
  }

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  const sidebar = document.getElementById("sidebar") ||
    document.querySelector(".sidebar");
  if (!sidebar) {
    return;
  }

  function build() {
    const progress = getProgress();
    sidebar.innerHTML = "";

    // Загальний прогрес курсу
    let total = 0;
    let done = 0;
    for (const s of sections) {
      for (const [href] of s.lessons) {
        total += 1;
        if (progress[href]) {
          done += 1;
        }
      }
    }
    const pct = total ? Math.round((done / total) * 100) : 0;

    const prog = document.createElement("div");
    prog.className = "nav-progress";
    const plabel = document.createElement("div");
    plabel.className = "nav-progress-label";
    plabel.textContent = "Вивчено " + done + " / " + total;
    const pbar = document.createElement("div");
    pbar.className = "nav-progress-bar";
    const pfill = document.createElement("span");
    pfill.style.width = pct + "%";
    pbar.appendChild(pfill);
    prog.appendChild(plabel);
    prog.appendChild(pbar);
    sidebar.appendChild(prog);

    const nav = document.createElement("nav");
    nav.className = "nav-sections";

    let activeLink = null;

    for (const section of sections) {
      const hasActive = section.lessons.some(([href]) => href === current);
      let sectionDone = 0;
      for (const [href] of section.lessons) {
        if (progress[href]) {
          sectionDone += 1;
        }
      }
      const allDone = sectionDone === section.lessons.length;

      const wrap = document.createElement("div");
      wrap.className = "nav-section";
      if (allDone) {
        wrap.classList.add("section-done");
      }

      const header = document.createElement("button");
      header.type = "button";
      header.className = "nav-section-title";

      const arrow = document.createElement("span");
      arrow.className = "nav-arrow";
      arrow.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.className = "nav-section-label";
      label.textContent = section.title;

      const count = document.createElement("span");
      count.className = "nav-section-count";
      count.textContent = sectionDone + "/" + section.lessons.length;

      header.appendChild(arrow);
      header.appendChild(label);
      header.appendChild(count);

      const ul = document.createElement("ul");
      for (const [href, title] of section.lessons) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = title;
        if (progress[href]) {
          a.classList.add("done");
        }
        if (href === current) {
          a.classList.add("active");
          activeLink = a;
        }
        li.appendChild(a);
        ul.appendChild(li);
      }

      // Активний розділ завжди розгорнутий; інші — за збереженим станом.
      const expanded = hasActive || saved[section.title] === "open";
      if (expanded) {
        wrap.classList.add("open");
      }
      header.setAttribute("aria-expanded", String(expanded));

      header.addEventListener("click", () => {
        const nowOpen = wrap.classList.toggle("open");
        header.setAttribute("aria-expanded", String(nowOpen));
        saved[section.title] = nowOpen ? "open" : "closed";
        persist();
      });

      wrap.appendChild(header);
      wrap.appendChild(ul);
      nav.appendChild(wrap);
    }

    sidebar.appendChild(nav);

    if (activeLink && typeof activeLink.scrollIntoView === "function") {
      activeLink.scrollIntoView({ block: "nearest" });
    }
  }

  build();
  // Перемальовуємо меню, коли змінюється прогрес (позначка "вивчено").
  window.addEventListener("jscourse:progresschange", build);
})();
