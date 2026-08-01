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
        ["html-responsive-images.html", "Адаптивні зображення"],
        ["html-svg.html", "Робота з SVG"],
        ["html-semantics.html", "Семантична розмітка"],
        ["html-forms.html", "Форми"],
        ["html-tables.html", "Таблиці"],
        ["html-meta-seo.html", "Метадані та SEO"],
        ["html-a11y.html", "Доступність (a11y)"],
        ["practice-html.html", "🎯 Практика: HTML"],
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
        ["practice-css.html", "🎯 Практика: CSS"],
      ],
    },
    {
      title: "Сучасний CSS",
      lessons: [
        ["modern-css-intro.html", "Огляд і @supports"],
        ["modern-css-nesting.html", "Нативна вкладеність"],
        ["modern-css-selectors.html", ":has(), :is(), :where()"],
        ["modern-css-container.html", "Container queries"],
        ["modern-css-layers.html", "Каскадні шари (@layer)"],
        ["modern-css-utils.html", "Логічні властивості, clamp, тема"],
        ["practice-modern-css.html", "🎯 Практика: сучасний CSS"],
      ],
    },
    {
      title: "Bootstrap",
      lessons: [
        ["bootstrap-intro.html", "Знайомство з Bootstrap"],
        ["bootstrap-grid.html", "Сітка (Grid)"],
        ["bootstrap-utilities.html", "Утиліти та типографіка"],
        ["bootstrap-components.html", "Компоненти"],
        ["bootstrap-forms.html", "Форми"],
        ["bootstrap-js.html", "JS-компоненти"],
        ["bootstrap-customize.html", "Кастомізація (Sass)"],
        ["practice-bootstrap.html", "🎯 Практика: Bootstrap"],
      ],
    },
    {
      title: "Tailwind CSS",
      lessons: [
        ["tailwind-intro.html", "Що таке Tailwind CSS"],
        ["tailwind-utilities.html", "Базові утиліти"],
        ["tailwind-layout.html", "Flexbox і Grid"],
        ["tailwind-responsive.html", "Адаптивність і стани"],
        ["tailwind-customize.html", "Кастомізація і теми"],
        ["tailwind-components.html", "Компоненти та @apply"],
        ["practice-tailwind.html", "🎯 Практика: Tailwind CSS"],
      ],
    },
    {
      title: "SCSS",
      lessons: [
        ["scss-intro.html", "Знайомство із Sass/SCSS"],
        ["scss-variables.html", "Змінні та типи даних"],
        ["scss-nesting.html", "Вкладеність і &"],
        ["scss-mixins.html", "Міксини, функції, @extend"],
        ["scss-modules.html", "Партіали, @use і @forward"],
        ["scss-control.html", "Директиви та цикли"],
        ["practice-scss.html", "🎯 Практика: SCSS"],
      ],
    },
    {
      title: "Основи JavaScript",
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
        ["practice-js-basics.html", "🎯 Практика: основи JS"],
      ],
    },
    {
      title: "Масиви",
      lessons: [
        ["arrays.html", "Масиви"],
        ["val-and-ref.html", "Присвоєння за посиланням і за значенням"],
        ["array-methods.html", "Методи масиву"],
        ["array-methods-2.html", "Перебираючі методи масиву"],
        ["practice-arrays.html", "🎯 Практика: масиви"],
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
        ["practice-functions.html", "🎯 Практика: функції"],
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
        ["practice-objects.html", "🎯 Практика: об'єкти"],
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
        ["practice-advanced.html", "🎯 Практика: замикання і this"],
      ],
    },
    {
      title: "ООП",
      lessons: [
        ["oop.html", "ООП"],
        ["prototypes.html", "Прототипи"],
        ["constructors.html", "Конструктори"],
        ["classes.html", "ES6 класи"],
        ["practice-oop.html", "🎯 Практика: ООП"],
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
        ["practice-dom.html", "🎯 Практика: DOM"],
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
        ["practice-events.html", "🎯 Практика: події"],
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
      title: "Vite",
      lessons: [
        ["vite-intro.html", "Що таке Vite"],
        ["vite-setup.html", "Створення проєкту"],
        ["vite-dev.html", "Dev-сервер і HMR"],
        ["vite-assets.html", "Ассети, CSS та env"],
        ["vite-build.html", "Продакшн-збірка"],
        ["vite-plugins.html", "Плагіни та конфігурація"],
        ["practice-vite.html", "🎯 Практика: Vite"],
      ],
    },
    {
      title: "ESLint + Prettier",
      lessons: [
        ["eslint-intro.html", "Навіщо лінтери й форматери"],
        ["eslint-setup.html", "ESLint: встановлення й конфіг"],
        ["eslint-rules.html", "Правила та плагіни"],
        ["prettier-setup.html", "Prettier: форматування"],
        ["eslint-prettier.html", "ESLint + Prettier разом"],
        ["eslint-workflow.html", "Редактор, Git-хуки, CI"],
        ["practice-eslint.html", "🎯 Практика: ESLint + Prettier"],
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
        ["practice-async.html", "🎯 Практика: асинхронність"],
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
        ["practice-backend.html", "🎯 Практика: бекенд"],
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
        ["practice-ts.html", "🎯 Практика: TypeScript"],
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
        ["practice-react.html", "🎯 Практика: React"],
      ],
    },
    {
      title: "React + TypeScript",
      lessons: [
        ["react-ts-intro.html", "Навіщо TypeScript у React"],
        ["react-ts-props.html", "Типізація props"],
        ["react-ts-state.html", "Типізація стану (useState)"],
        ["react-ts-events.html", "Події та рефи"],
        ["react-ts-hooks.html", "Типізація хуків"],
        ["react-ts-patterns.html", "Патерни типізації"],
        ["practice-react-ts.html", "🎯 Практика: React + TypeScript"],
      ],
    },
    {
      title: "TanStack Query",
      lessons: [
        ["react-query-intro.html", "Навіщо TanStack Query"],
        ["react-query-setup.html", "Встановлення та QueryClient"],
        ["react-query-queries.html", "useQuery: отримання даних"],
        ["react-query-mutations.html", "useMutation: зміна даних"],
        ["react-query-cache.html", "Кешування та інвалідація"],
        ["react-query-advanced.html", "Пагінація та оптимізм"],
        ["practice-react-query.html", "🎯 Практика: TanStack Query"],
      ],
    },
    {
      title: "Керування станом",
      lessons: [
        ["state-intro.html", "Навіщо глобальний стан"],
        ["zustand-basics.html", "Zustand: основи"],
        ["zustand-advanced.html", "Zustand: middleware і async"],
        ["redux-intro.html", "Redux Toolkit: концепції"],
        ["redux-slices.html", "createSlice та store"],
        ["redux-async.html", "Асинхронність (thunk, RTK Query)"],
        ["practice-state.html", "🎯 Практика: керування станом"],
      ],
    },
    {
      title: "Дизайн-системи",
      lessons: [
        ["design-systems-intro.html", "Що таке дизайн-система"],
        ["radix-intro.html", "Radix Primitives"],
        ["shadcn-intro.html", "shadcn/ui: підхід"],
        ["shadcn-usage.html", "Використання shadcn/ui"],
        ["storybook-intro.html", "Storybook: навіщо"],
        ["storybook-stories.html", "Написання історій (stories)"],
        ["practice-design-systems.html", "🎯 Практика: дизайн-системи"],
      ],
    },
    {
      title: "Форми: React Hook Form + Zod",
      lessons: [
        ["rhf-intro.html", "Навіщо React Hook Form"],
        ["rhf-basics.html", "useForm, register, handleSubmit"],
        ["rhf-validation.html", "Вбудована валідація"],
        ["zod-intro.html", "Zod: схеми валідації"],
        ["rhf-zod.html", "React Hook Form + Zod"],
        ["rhf-advanced.html", "Controller, useFieldArray, watch"],
        ["practice-forms.html", "🎯 Практика: форми (RHF + Zod)"],
      ],
    },
    {
      title: "tRPC (типобезпечний API)",
      lessons: [
        ["trpc-intro.html", "Навіщо типобезпечний API"],
        ["trpc-setup.html", "Встановлення та ініціалізація"],
        ["trpc-procedures.html", "Процедури: queries і mutations"],
        ["trpc-router.html", "Роутери та контекст"],
        ["trpc-client.html", "Клієнт і React Query"],
        ["trpc-advanced.html", "Middleware, захист, помилки"],
        ["practice-trpc.html", "🎯 Практика: tRPC"],
      ],
    },
    {
      title: "Next.js",
      lessons: [
        ["next-intro.html", "Що таке Next.js"],
        ["next-routing.html", "Роутинг (App Router)"],
        ["next-layouts.html", "Сторінки та лейаути"],
        ["next-components.html", "Server і Client компоненти"],
        ["next-data.html", "Отримання даних"],
        ["next-api.html", "Route Handlers (API)"],
        ["next-navigation.html", "Навігація"],
        ["next-optimization.html", "Оптимізація та деплой"],
        ["practice-next.html", "🎯 Практика: Next.js"],
      ],
    },
    {
      title: "Auth-провайдери",
      lessons: [
        ["auth-intro.html", "Навіщо auth-провайдери"],
        ["auth-oauth.html", "OAuth 2.0 та OpenID Connect"],
        ["authjs-setup.html", "Auth.js (NextAuth): налаштування"],
        ["authjs-usage.html", "Сесія, колбеки, захист роутів"],
        ["supabase-auth.html", "Supabase Auth і RLS"],
        ["auth-advanced.html", "Refresh-токени, ролі, безпека"],
        ["practice-auth.html", "🎯 Практика: Auth-провайдери"],
      ],
    },
    {
      title: "Реалтайм (WebSockets / SSE)",
      lessons: [
        ["realtime-intro.html", "Навіщо реалтайм"],
        ["sse-basics.html", "Server-Sent Events (SSE)"],
        ["websockets-basics.html", "WebSocket: протокол і API"],
        ["socketio-intro.html", "Socket.io: події та кімнати"],
        ["realtime-patterns.html", "Патерни: broadcast, auth, presence"],
        ["realtime-advanced.html", "Надійність і масштабування"],
        ["practice-realtime.html", "🎯 Практика: Реалтайм"],
      ],
    },
    {
      title: "AI-інтеграція",
      lessons: [
        ["ai-intro.html", "Навіщо AI-інтеграція"],
        ["ai-first-call.html", "Перший виклик LLM-API"],
        ["ai-streaming.html", "Стрімінг відповіді"],
        ["ai-tools.html", "Tool / function calling"],
        ["ai-vercel-sdk.html", "Vercel AI SDK і чат"],
        ["ai-rag.html", "RAG: відповіді на твоїх даних"],
        ["ai-vector-db.html", "Векторні БД (pgvector, Pinecone)"],
        ["practice-ai.html", "🎯 Практика: AI-інтеграція"],
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
    {
      title: "Проєкти",
      lessons: [
        ["project-landing.html", "Проєкт: лендинг (HTML/CSS)"],
        ["project-calculator.html", "Проєкт: калькулятор"],
        ["project-todo.html", "Проєкт: To-Do на JS"],
        ["project-quiz.html", "Проєкт: вікторина"],
        ["project-gallery.html", "Проєкт: галерея"],
        ["project-weather.html", "Проєкт: погода з API"],
        ["project-fullstack.html", "Проєкт: fullstack-нотатник"],
        ["project-bank.html", "🗂️ Банк проєктів (ідеї)"],
      ],
    },
    {
      title: "Ресурси",
      lessons: [
        ["resources.html", "🔗 Корисні посилання"],
      ],
    },
  ];

  const STORAGE_KEY = "jscourse.nav.sections";
  const PROGRESS_KEY = "jscourse.progress";
  const MARKS_KEY = "jscourse.nav.marks";
  const current = location.pathname.split("/").pop() || "intro.html";

  // Кольорові мітки-статуси, які користувач ставить на розділи.
  const MARKS = {
    important: { text: "Важливо", color: "#dc2626", bg: "#fee2e2" },
    review: { text: "Повторити", color: "#7c3aed", bg: "#ede9fe" },
    progress: { text: "В процесі", color: "#16a34a", bg: "#dcfce7" },
  };

  function getMarks() {
    try {
      return JSON.parse(localStorage.getItem(MARKS_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function setMarkStore(title, key) {
    const m = getMarks();
    if (key) {
      m[title] = key;
    } else {
      delete m[title];
    }
    try {
      localStorage.setItem(MARKS_KEY, JSON.stringify(m));
    } catch (e) {
      /* ігноруємо */
    }
  }

  function closeMarkPops(except) {
    document.querySelectorAll(".nav-mark-pop.open").forEach((p) => {
      if (p !== except) {
        p.classList.remove("open");
      }
    });
  }

  // Будує контрол мітки для одного розділу (кнопка + випадний вибір).
  function buildMark(title) {
    const wrap = document.createElement("div");
    wrap.className = "nav-mark";

    function render() {
      wrap.innerHTML = "";
      const cur = getMarks()[title];

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-mark-btn";
      const flag = document.createElement("span");
      flag.className = "nav-mark-flag";
      flag.textContent = "⚑"; // ⚑
      btn.appendChild(flag);
      if (cur && MARKS[cur]) {
        btn.classList.add("has-mark");
        btn.style.setProperty("--mk", MARKS[cur].color);
        btn.style.setProperty("--mkbg", MARKS[cur].bg);
        const t = document.createElement("span");
        t.className = "nav-mark-text";
        t.textContent = MARKS[cur].text;
        btn.appendChild(t);
        btn.title = "Мітка: " + MARKS[cur].text;
      } else {
        btn.title = "Поставити мітку";
      }

      const pop = document.createElement("div");
      pop.className = "nav-mark-pop";
      Object.keys(MARKS).forEach((key) => {
        const opt = document.createElement("button");
        opt.type = "button";
        opt.className = "nav-mark-opt" + (key === cur ? " active" : "");
        opt.style.setProperty("--mk", MARKS[key].color);
        const dot = document.createElement("span");
        dot.className = "dot";
        const txt = document.createElement("span");
        txt.textContent = MARKS[key].text;
        opt.appendChild(dot);
        opt.appendChild(txt);
        opt.addEventListener("click", (e) => {
          e.stopPropagation();
          setMarkStore(title, key === cur ? null : key);
          render();
        });
        pop.appendChild(opt);
      });
      if (cur) {
        const clear = document.createElement("button");
        clear.type = "button";
        clear.className = "nav-mark-opt nav-mark-clear";
        clear.textContent = "Зняти мітку";
        clear.addEventListener("click", (e) => {
          e.stopPropagation();
          setMarkStore(title, null);
          render();
        });
        pop.appendChild(clear);
      }

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = !pop.classList.contains("open");
        closeMarkPops();
        pop.classList.toggle("open", willOpen);
      });

      wrap.appendChild(btn);
      wrap.appendChild(pop);
    }

    render();
    return wrap;
  }

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

  const sidebar =
    document.getElementById("sidebar") || document.querySelector(".sidebar");
  if (!sidebar) {
    return;
  }

  function build() {
    const progress = getProgress();
    const searchBox = sidebar.querySelector(".search-box");
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

    // Швидке посилання на зведення нотаток.
    const links = document.createElement("div");
    links.className = "nav-links";
    const notesLink = document.createElement("a");
    notesLink.className = "nav-link-item";
    if (current === "notes.html") {
      notesLink.classList.add("active");
    }
    notesLink.href = "notes.html";
    const nIcon = document.createElement("span");
    nIcon.setAttribute("aria-hidden", "true");
    nIcon.textContent = "📝";
    const nText = document.createElement("span");
    nText.textContent = "Мої нотатки";
    notesLink.appendChild(nIcon);
    notesLink.appendChild(nText);
    links.appendChild(notesLink);
    sidebar.appendChild(links);

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

      const head = document.createElement("div");
      head.className = "nav-section-head";
      head.appendChild(header);
      head.appendChild(buildMark(section.title));

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

      wrap.appendChild(head);
      wrap.appendChild(ul);
      nav.appendChild(wrap);
    }

    sidebar.appendChild(nav);

    // Повертаємо поле пошуку нагору (build() очищає сайдбар).
    if (searchBox) {
      sidebar.insertBefore(searchBox, sidebar.firstChild);
    }

    if (activeLink && typeof activeLink.scrollIntoView === "function") {
      activeLink.scrollIntoView({ block: "nearest" });
    }
  }

  build();
  // Перемальовуємо меню, коли змінюється прогрес (позначка "вивчено").
  window.addEventListener("jscourse:progresschange", build);

  // Хлібні крихти (розділ › урок) і кнопки Назад/Далі — додаються один раз.
  (function decorateContent() {
    const content = document.querySelector(".content");
    if (!content || content.querySelector(".breadcrumb")) {
      return;
    }

    const flat = [];
    let sectionOf = null;
    let titleOf = null;
    for (const section of sections) {
      for (const [href, title] of section.lessons) {
        flat.push({ href: href, title: title, section: section.title });
        if (href === current) {
          sectionOf = section.title;
          titleOf = title;
        }
      }
    }
    const idx = flat.findIndex((l) => l.href === current);
    if (idx === -1) {
      return;
    }

    // Хлібні крихти
    const crumb = document.createElement("nav");
    crumb.className = "breadcrumb";
    const cs = document.createElement("span");
    cs.className = "crumb-section";
    cs.textContent = sectionOf;
    const sep = document.createElement("span");
    sep.className = "crumb-sep";
    sep.textContent = "›";
    const cl = document.createElement("span");
    cl.className = "crumb-lesson";
    cl.textContent = titleOf;
    crumb.appendChild(cs);
    crumb.appendChild(sep);
    crumb.appendChild(cl);
    content.insertBefore(crumb, content.firstChild);

    // Навігація Назад / Далі
    const prev = flat[idx - 1];
    const next = flat[idx + 1];

    function makeLink(item, dir) {
      const a = document.createElement("a");
      a.className = "page-nav-link page-nav-" + dir;
      a.href = item.href;
      const label = document.createElement("span");
      label.className = "page-nav-label";
      label.textContent = dir === "prev" ? "← Назад" : "Далі →";
      const title = document.createElement("span");
      title.className = "page-nav-title";
      title.textContent = item.title;
      a.appendChild(label);
      a.appendChild(title);
      return a;
    }

    const footer = document.createElement("nav");
    footer.className = "page-nav";
    if (prev) {
      footer.appendChild(makeLink(prev, "prev"));
    } else {
      footer.appendChild(document.createElement("span"));
    }
    if (next) {
      footer.appendChild(makeLink(next, "next"));
    }
    content.appendChild(footer);
  })();

  // Закриваємо будь-який відкритий вибір мітки при кліку поза ним / Esc.
  document.addEventListener("click", () => closeMarkPops());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMarkPops();
    }
  });

  // Мобільне меню: бічну панель ховаємо в «шухляду» з кнопкою-бургером.
  (function mobileDrawer() {
    if (document.querySelector(".nav-toggle")) {
      return;
    }
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Відкрити меню");
    const tIcon = document.createElement("span");
    tIcon.className = "nav-toggle-icon";
    tIcon.textContent = "☰"; // ☰
    const tText = document.createElement("span");
    tText.className = "nav-toggle-text";
    tText.textContent = "Меню";
    toggle.appendChild(tIcon);
    toggle.appendChild(tText);

    const backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";

    document.body.appendChild(toggle);
    document.body.appendChild(backdrop);

    function open() {
      sidebar.classList.add("open");
      backdrop.classList.add("show");
      document.body.classList.add("nav-drawer-open");
      toggle.classList.add("is-open");
      tIcon.textContent = "✕"; // ✕
      tText.textContent = "Закрити";
      toggle.setAttribute("aria-label", "Закрити меню");
    }
    function close() {
      sidebar.classList.remove("open");
      backdrop.classList.remove("show");
      document.body.classList.remove("nav-drawer-open");
      toggle.classList.remove("is-open");
      tIcon.textContent = "☰"; // ☰
      tText.textContent = "Меню";
      toggle.setAttribute("aria-label", "Відкрити меню");
    }

    toggle.addEventListener("click", () => {
      if (sidebar.classList.contains("open")) {
        close();
      } else {
        open();
      }
    });
    backdrop.addEventListener("click", close);
    sidebar.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        close();
      }
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
      }
    });
  })();

  // Робимо структуру курсу доступною для сторінки зведення нотаток.
  window.COURSE_SECTIONS = sections;
})();
