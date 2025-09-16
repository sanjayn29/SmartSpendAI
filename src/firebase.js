import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

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

// ✅ Auth setup
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Make sure these are exported
export { auth, provider, signInWithPopup, signOut };
