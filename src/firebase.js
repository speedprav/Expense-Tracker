import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper function to backup user data to cloud
export const backupUserData = async (userId, data) => {
  try {
    if (!firebaseConfig.projectId || firebaseConfig.projectId === "YOUR_PROJECT_ID") {
      console.warn("Firebase not configured. Please add your config in src/firebase.js");
      return false; // Silently fail if not configured
    }
    
    // We use a predefined collection "backups" and the user's ID (or local id) as document ID
    const userRef = doc(db, "backups", userId);
    await setDoc(userRef, {
      ...data,
      lastBackupDate: new Date().toISOString()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Cloud Backup Failed:", error);
    return false;
  }
};

export { auth, db };
