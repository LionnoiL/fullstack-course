// ============================================================
//  Firebase конфігурація
//  Заповніть своїми значеннями з Firebase Console →
//  Project Settings → General → Your apps → Web app
// ============================================================
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);

window._auth = firebase.auth();
window._db   = firebase.firestore();

// Увімкнення офлайн-кешу Firestore (необов'язково, але корисно)
window._db.enablePersistence({ synchronizeTabs: true }).catch(function () {
  /* ігноруємо — приватний режим або кілька вкладок */
});
