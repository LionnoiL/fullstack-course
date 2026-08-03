#!/usr/bin/env python3
"""
Додає теги Firebase SDK до всіх HTML-сторінок у pages/.
Запускати з кореня проекту: python3 scripts/inject-firebase.py
"""

import os, re

PAGES_DIR = os.path.join(os.path.dirname(__file__), '..', 'pages')

FIREBASE_BLOCK = """\
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
    <script src="../js/firebase-config.js"></script>
    <script src="../js/auth-guard.js"></script>"""

MARKER   = '<script src="../js/course-tools.js">'
SKIP     = {'login.html', 'profile.html'}   # вже мають власні Firebase-теги
SENTINEL = 'firebase-config.js'             # ознака що скрипт вже є

updated  = 0
skipped  = 0
no_marker = []

for fname in sorted(os.listdir(PAGES_DIR)):
    if not fname.endswith('.html'):
        continue
    if fname in SKIP:
        skipped += 1
        continue

    path = os.path.join(PAGES_DIR, fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if SENTINEL in content:
        skipped += 1
        continue

    if MARKER not in content:
        no_marker.append(fname)
        continue

    content = content.replace(MARKER, FIREBASE_BLOCK + '\n' + MARKER, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    updated += 1

print(f'Оновлено: {updated} файлів')
print(f'Пропущено: {skipped} файлів (вже є Firebase або у списку SKIP)')
if no_marker:
    print(f'УВАГА — маркер не знайдено у: {", ".join(no_marker)}')
