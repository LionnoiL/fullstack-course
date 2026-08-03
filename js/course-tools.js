// Інструменти учня: виділення тексту, нотатки до уроку, позначка "вивчено".
// Дані зберігаються в localStorage і синхронізуються з Firestore (auth-guard.js).
(function () {
  "use strict";

  const page = location.pathname.split("/").pop() || "intro.html";
  const content = document.querySelector(".content");
  if (!content) {
    return; // не сторінка уроку (напр., редірект)
  }

  const PROGRESS_KEY = "jscourse.progress";
  const NOTES_KEY = "jscourse.notes";
  const HL_KEY = "jscourse.highlights";

  function read(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v === null || v === undefined ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }
  function write(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      /* приватний режим / переповнення — ігноруємо */
    }
    if (window.CourseFirebase) {
      window.CourseFirebase.onWrite(key, val);
    }
  }

  /* ---------------- Прогрес: "вивчено" ---------------- */
  function isLearned() {
    return !!read(PROGRESS_KEY, {})[page];
  }
  function setLearned(value) {
    const p = read(PROGRESS_KEY, {});
    if (value) {
      p[page] = true;
    } else {
      delete p[page];
    }
    write(PROGRESS_KEY, p);
    window.dispatchEvent(new CustomEvent("jscourse:progresschange"));
  }

  /* ---------------- Нотатки ---------------- */
  function getNote() {
    return read(NOTES_KEY, {})[page] || "";
  }
  function setNote(text) {
    const n = read(NOTES_KEY, {});
    if (text && text.trim()) {
      n[page] = text;
    } else {
      delete n[page];
    }
    write(NOTES_KEY, n);
  }

  /* ---------------- Виділення тексту ---------------- */
  function getHighlights() {
    return read(HL_KEY, {})[page] || [];
  }
  function saveHighlights(list) {
    const all = read(HL_KEY, {});
    if (list.length) {
      all[page] = list;
    } else {
      delete all[page];
    }
    write(HL_KEY, all);
  }

  // Глобальний символьний зсув вузла в межах .content
  function globalOffset(node, offset) {
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null);
    let total = 0;
    let cur;
    while ((cur = walker.nextNode())) {
      if (cur === node) {
        return total + offset;
      }
      total += cur.textContent.length;
    }
    return -1;
  }
  // Зворотне: за зсувом знайти текстовий вузол і локальний offset.
  // preferNext=true (для старту range): на точній межі між вузлами переходить
  // до початку наступного, щоб range не починався перед блоковим елементом.
  // preferNext=false (для кінця range): залишається в поточному вузлі на кінці.
  function nodeAtOffset(target, preferNext) {
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null);
    let total = 0;
    let cur;
    while ((cur = walker.nextNode())) {
      const len = cur.textContent.length;
      if (target < total + len) {
        return { node: cur, offset: target - total };
      }
      if (target === total + len) {
        if (preferNext) {
          const next = walker.nextNode();
          if (next) return { node: next, offset: 0 };
        }
        return { node: cur, offset: len };
      }
      total += len;
    }
    return null;
  }
  function wrapRange(range) {
    const mark = document.createElement("mark");
    mark.className = "note-highlight";
    mark.title = "Клік — прибрати виділення";
    try {
      range.surroundContents(mark);
    } catch (e) {
      // виділення перетинає межі елементів — загортаємо вручну
      mark.appendChild(range.extractContents());
      range.insertNode(mark);
    }
    return mark;
  }

  // Прибрати вже накладені нами виділення (щоб повторний виклик не дублював їх).
  function clearAppliedHighlights() {
    content.querySelectorAll("mark.note-highlight").forEach((mark) => {
      const parent = mark.parentNode;
      while (mark.firstChild) {
        parent.insertBefore(mark.firstChild, mark);
      }
      parent.removeChild(mark);
      parent.normalize();
    });
  }

  function applyStoredHighlights() {
    clearAppliedHighlights(); // ідемпотентність: спершу зняти те, що вже наклали
    getHighlights().forEach((h) => {
      try {
        const s = nodeAtOffset(h.start, true);
        const e = nodeAtOffset(h.start + h.len, false);
        if (!s || !e) {
          return;
        }
        const range = document.createRange();
        range.setStart(s.node, s.offset);
        range.setEnd(e.node, e.offset);
        if (range.toString() !== h.text) {
          return; // текст уроку змінився — пропускаємо
        }
        wrapRange(range);
      } catch (err) {
        /* пропускаємо проблемне виділення */
      }
    });
  }

  function addHighlightFromSelection() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      return;
    }
    const range = sel.getRangeAt(0);
    if (!content.contains(range.commonAncestorContainer)) {
      return;
    }
    const start = globalOffset(range.startContainer, range.startOffset);
    const end = globalOffset(range.endContainer, range.endOffset);
    if (start < 0 || end < 0 || end <= start) {
      return;
    }
    const text = content.textContent.slice(start, end);
    wrapRange(range);
    const list = getHighlights();
    list.push({ start: start, len: end - start, text: text });
    saveHighlights(list);
    sel.removeAllRanges();
  }

  function removeHighlight(mark) {
    const firstText = document.createTreeWalker(mark, NodeFilter.SHOW_TEXT, null).nextNode();
    const start = firstText ? globalOffset(firstText, 0) : -1;
    const parent = mark.parentNode;
    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark);
    }
    parent.removeChild(mark);
    parent.normalize();
    if (start >= 0) {
      saveHighlights(getHighlights().filter((h) => h.start !== start));
    }
  }

  /* ---------------- Плаваюча кнопка "Виділити" ---------------- */
  const hlBtn = document.createElement("button");
  hlBtn.type = "button";
  hlBtn.className = "hl-btn";
  hlBtn.textContent = "Виділити";
  hlBtn.style.display = "none";
  document.body.appendChild(hlBtn);

  function hideHlBtn() {
    hlBtn.style.display = "none";
  }

  content.addEventListener("mouseup", () => {
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        hideHlBtn();
        return;
      }
      const range = sel.getRangeAt(0);
      if (!content.contains(range.commonAncestorContainer)) {
        hideHlBtn();
        return;
      }
      const rect = range.getBoundingClientRect();
      hlBtn.style.top = window.scrollY + rect.top - 38 + "px";
      hlBtn.style.left = window.scrollX + rect.left + "px";
      hlBtn.style.display = "block";
    }, 10);
  });

  hlBtn.addEventListener("mousedown", (e) => {
    e.preventDefault(); // зберегти виділення
    addHighlightFromSelection();
    hideHlBtn();
  });

  document.addEventListener("mousedown", (e) => {
    if (e.target !== hlBtn) {
      hideHlBtn();
    }
  });

  content.addEventListener("click", (e) => {
    const mark = e.target.closest ? e.target.closest("mark.note-highlight") : null;
    if (mark) {
      removeHighlight(mark);
    }
  });

  /* ---------------- Панель інструментів ---------------- */
  const toolbar = document.createElement("div");
  toolbar.className = "course-toolbar";

  const learnedBtn = document.createElement("button");
  learnedBtn.type = "button";
  learnedBtn.className = "course-btn learned-btn";

  const notesBtn = document.createElement("button");
  notesBtn.type = "button";
  notesBtn.className = "course-btn notes-btn";
  notesBtn.textContent = "Нотатки";

  toolbar.appendChild(learnedBtn);
  toolbar.appendChild(notesBtn);
  document.body.appendChild(toolbar);

  function refreshLearnedBtn() {
    const done = isLearned();
    learnedBtn.textContent = done ? "✓ Вивчено" : "Позначити вивченим";
    learnedBtn.classList.toggle("is-done", done);
  }
  refreshLearnedBtn();
  learnedBtn.addEventListener("click", () => {
    setLearned(!isLearned());
    refreshLearnedBtn();
  });

  /* ---------------- Панель нотаток ---------------- */
  const panel = document.createElement("div");
  panel.className = "notes-panel";

  const header = document.createElement("div");
  header.className = "notes-panel-header";
  const title = document.createElement("span");
  title.textContent = "Нотатки до уроку";
  const allLink = document.createElement("a");
  allLink.className = "notes-all-link";
  allLink.href = "notes.html";
  allLink.textContent = "Усі нотатки →";
  allLink.title = "Переглянути всі нотатки курсу";
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "notes-close";
  closeBtn.textContent = "×";
  closeBtn.title = "Закрити";
  header.appendChild(title);
  header.appendChild(allLink);
  header.appendChild(closeBtn);

  const area = document.createElement("textarea");
  area.className = "notes-area";
  area.placeholder = "Твої нотатки до цього уроку...";
  area.value = getNote();

  panel.appendChild(header);
  panel.appendChild(area);
  document.body.appendChild(panel);

  function refreshNotesBtn() {
    notesBtn.classList.toggle("has-note", !!getNote().trim());
  }
  function openPanel() {
    area.value = getNote(); // читаємо свіже з localStorage (sync міг завершитись після init)
    panel.classList.add("open");
    document.body.classList.add("notes-open");
    area.focus();
  }
  function closePanel() {
    panel.classList.remove("open");
    document.body.classList.remove("notes-open");
  }

  notesBtn.addEventListener("click", () => {
    if (panel.classList.contains("open")) {
      closePanel();
    } else {
      openPanel();
    }
  });
  closeBtn.addEventListener("click", closePanel);
  area.addEventListener("input", () => {
    setNote(area.value);
    refreshNotesBtn();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePanel();
    }
  });
  refreshNotesBtn();

  /* Відновлюємо виділення після того, як Prism підсвітив код */
  if (document.readyState === "complete") {
    applyStoredHighlights();
  } else {
    window.addEventListener("load", applyStoredHighlights);
  }

  /* Після синхронізації Firestore → оновлюємо стан кнопки та виділення */
  window.addEventListener("jscourse:datasynced", function () {
    refreshLearnedBtn();
    area.value = getNote();
    refreshNotesBtn();
    applyStoredHighlights();
  });
})();
