import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Function to check if all firebase config values are present and valid
export function isFirebaseConfigured() {
    return (
        firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.databaseURL &&
        (firebaseConfig.databaseURL.startsWith('https://') && firebaseConfig.databaseURL.includes('firebaseio.com')) &&
        firebaseConfig.projectId &&
        firebaseConfig.storageBucket &&
        firebaseConfig.messagingSenderId &&
        firebaseConfig.appId
    );
}

const app = isFirebaseConfigured() ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;
const db = app ? getDatabase(app) : null;

export { app, db };
