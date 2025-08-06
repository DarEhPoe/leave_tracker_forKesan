import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// ✅ Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAC_0CVgRMsIZ1OSux7v1XKKFNyH_qnAuM",
  authDomain: "southern-frame-454918-j5.firebaseapp.com",
  projectId: "southern-frame-454918-j5",
  storageBucket: "southern-frame-454918-j5.appspot.com", // ✅ fixed
  messagingSenderId: "131851667466",
  appId: "1:131851667466:web:3b1fed68b3f0e82776f7f3",
  measurementId: "G-4NF8P95DGN"
};

// ✅ Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Get messaging instance (only if supported by browser)
const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

// ✅ Fetch FCM token
export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
