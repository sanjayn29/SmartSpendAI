import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import Firestore functions

const firebaseConfig = {
  apiKey: "AIzaSyAm-lJ_6vdSn28foMTZ8aUx98oLSDHbQ8w",
  authDomain: "aismartspend.firebaseapp.com",
  projectId: "aismartspend",
  storageBucket: "aismartspend.firebasestorage.app",
  messagingSenderId: "194893461491",
  appId: "1:194893461491:web:fd122b32a191bbf0f6c486",
  measurementId: "G-8WP35GHC8R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth setup
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
setPersistence(auth, browserLocalPersistence);

// Firestore setup
const db = getFirestore(app);

// Export all necessary modules
export { auth, provider, signInWithPopup, signOut, db, doc, setDoc };