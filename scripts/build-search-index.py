#!/usr/bin/env python3
"""Генерує js/search-index.js із уроків у pages/.

Порядок і назви уроків беруться з js/nav.js, текст — із <main class="content">
кожної сторінки. Індекс підключається як JS-файл (не JSON), щоб пошук працював
і через file:// (де fetch локальних файлів заблоковано).

Запуск із кореня проєкту:  python3 scripts/build-search-index.py
"""
import re
import os
import html
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def clean(txt):
    txt = re.sub(r"<[^>]+>", " ", txt)
    txt = html.unescape(txt)
    return re.sub(r"\s+", " ", txt).strip()


def main():
    nav = open(os.path.join(ROOT, "js/nav.js"), encoding="utf-8").read()

    order = []
    section = ""
    for line in nav.splitlines():
        m = re.search(r'title:\s*"([^"]+)"', line)
        if m:
            section = m.group(1)
            continue
        m = re.search(r'\["([a-z0-9-]+\.html)",\s*"([^"]+)"\]', line)
        if m:
            order.append((m.group(1), m.group(2), section))

    index = []
    for href, title, sec in order:
        path = os.path.join(ROOT, "pages", href)
        if not os.path.exists(path):
            print("! пропущено (немає файлу):", href)
            continue
        raw = open(path, encoding="utf-8").read()
        m = re.search(r'<main class="content">(.*?)</main>', raw, re.S)
        body_html = m.group(1) if m else ""
        body_html = re.sub(r"<script.*?</script>", " ", body_html, flags=re.S)
        headings = " ".join(
            clean(h) for h in re.findall(r"<h[12][^>]*>(.*?)</h[12]>", body_html, re.S)
        )
        body = clean(body_html)[:4000]
        index.append({"h": href, "t": title, "s": sec, "g": headings, "b": body})

    payload = json.dumps(index, ensure_ascii=False, separators=(",", ":"))
    out = os.path.join(ROOT, "js/search-index.js")
    with open(out, "w", encoding="utf-8") as f:
        f.write(
            "// Автозгенерований пошуковий індекс.\n"
            "// Оновити: python3 scripts/build-search-index.py\n"
            "window.SEARCH_INDEX = " + payload + ";\n"
        )
    print(f"проіндексовано уроків: {len(index)}")
    print(f"розмір індексу: {os.path.getsize(out) / 1024:.0f} КБ")


if __name__ == "__main__":
    main()
