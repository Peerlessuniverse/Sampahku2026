import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app;
try {
    if (!firebaseConfig.apiKey) {
        console.warn("📡 Radar Warning: Firebase API Key missing. Unit might be running in restricted mode.");
    }
    app = initializeApp(firebaseConfig);
} catch (e) {
    console.error("📡 Radar Critical Error: Firebase Initialization Failed!", e);
    // Create a mock app if necessary or just let it fail gracefully
    app = { options: {} };
}

export const auth = getAuth(app as any);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app as any);

// Initialize Analytics conditionally (only in browser)
export const analytics = typeof window !== "undefined" && firebaseConfig.measurementId ? getAnalytics(app as any) : null;
export { app };
