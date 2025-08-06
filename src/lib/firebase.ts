
// firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAC_0CVgRMsIZ1OSux7v1XKKFNyH_qnAuM",
  authDomain: "southern-frame-454918-j5.firebaseapp.com",
  projectId: "southern-frame-454918-j5",
  storageBucket: "southern-frame-454918-j5.firebasestorage.app",
  messagingSenderId: "131851667466",
  appId: "1:131851667466:web:3b1fed68b3f0e82776f7f3",
  measurementId: "G-4NF8P95DGN"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const messaging = isSupported().then((supported) => (supported ? getMessaging(app) : null));

export { app, messaging };

