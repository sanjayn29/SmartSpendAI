// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore"; // Import Firestore functions

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);

// Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
setPersistence(auth, browserLocalPersistence);

// Initialize Firestore
const db = getFirestore(app);

// Export the functions and services
export { 
  auth, 
  provider, 
  signInWithPopup, 
  signOut, 
  db, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp 
};