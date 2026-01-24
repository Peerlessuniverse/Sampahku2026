import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Helper to get config with dynamic fallback
const getEnv = (key: string, defaultValue: string = '') => {
    if (typeof window !== 'undefined' && (window as any).RADAR_CONFIG) {
        return (window as any).RADAR_CONFIG[key] || import.meta.env[key] || defaultValue;
    }
    return import.meta.env[key] || defaultValue;
};

const firebaseConfig = {
    apiKey: getEnv('VITE_FIREBASE_API_KEY'),
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('VITE_FIREBASE_APP_ID'),
    measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID')
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
