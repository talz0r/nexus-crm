import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const fallbackFirebaseConfig = {
  apiKey: "AIzaSyBN6h8Xvhx50-uXcn1qt9273o8CUanoqyE",
  authDomain: "nexus-crm-d800f.firebaseapp.com",
  projectId: "nexus-crm-d800f",
  storageBucket: "nexus-crm-d800f.firebasestorage.app",
  messagingSenderId: "877308582449",
  appId: "1:877308582449:web:2578ea9eaf177950539310",
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackFirebaseConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackFirebaseConfig.appId,
};

const missingFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

const isFirebaseConfigured = missingFirebaseKeys.length === 0;

if (!isFirebaseConfigured) {
  console.error(
    `Firebase config is incomplete. Missing: ${missingFirebaseKeys.join(", ")}. ` +
      "Set them in a local .env file (see .env.example)."
  );
}

let auth = null;
let db = null;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db, isFirebaseConfigured, missingFirebaseKeys };
