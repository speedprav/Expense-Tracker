import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCan-L0tJB0TJL4IVJHZ5KU1akGacg3LZE",
  authDomain: "expense-tracker-28654.firebaseapp.com",
  projectId: "expense-tracker-28654",
  storageBucket: "expense-tracker-28654.firebasestorage.app",
  messagingSenderId: "234237857855",
  appId: "1:234237857855:web:2948ee8779436d2b50288a",
  measurementId: "G-YF9GL09R4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

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

export { auth, db, googleProvider };
