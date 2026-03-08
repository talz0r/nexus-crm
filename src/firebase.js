import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBN6h8Xvhx50-uXcn1qt9273o8CUanoqyE",
  authDomain: "nexus-crm-d800f.firebaseapp.com",
  projectId: "nexus-crm-d800f",
  storageBucket: "nexus-crm-d800f.firebasestorage.app",
  messagingSenderId: "877308582449",
  appId: "1:877308582449:web:2578ea9eaf177950539310"
};

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.error("Firebase init failed:", err);
}

export { auth, db };
