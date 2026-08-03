// ============================================================
//  Firebase конфігурація
//  Заповніть своїми значеннями з Firebase Console →
//  Project Settings → General → Your apps → Web app
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyCMdduxPPZtBNHizlv7SzvRiIfGY8kFZ2I",
  authDomain: "fullstack-course-48abe.firebaseapp.com",
  projectId: "fullstack-course-48abe",
  storageBucket: "fullstack-course-48abe.firebasestorage.app",
  messagingSenderId: "973462201739",
  appId: "1:973462201739:web:b73aacfa90a16975c9bb8e",
  measurementId: "G-0FPG5Z0XH2",
};

firebase.initializeApp(firebaseConfig);

window._auth = firebase.auth();
window._db = firebase.firestore();

// Увімкнення офлайн-кешу Firestore (необов'язково, але корисно)
window._db.enablePersistence({ synchronizeTabs: true }).catch(function () {
  /* ігноруємо — приватний режим або кілька вкладок */
});
