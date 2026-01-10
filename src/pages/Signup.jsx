import React from "react";
import { auth, provider, signInWithPopup, db, doc, setDoc } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaPiggyBank, FaChartLine, FaCoins, FaMoneyCheckAlt } from "react-icons/fa";

function Signup({ setUser }) {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        budgetPreferences: {}, // Example field
        financialGoals: [], // Example field
      }, { merge: true });

      setUser(user);
      navigate("/"); // Redirect to home after login
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-emerald-50 to-green-100 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <FaCoins className="text-amber-400 text-6xl" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <FaMoneyCheckAlt className="text-amber-400 text-6xl" />
      </div>
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
        {/* Header section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-4 rounded-full">
              <FaPiggyBank className="text-amber-500 text-4xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">AI Smart Spend</h1>
          <p className="text-emerald-600">Smart financial management powered by AI</p>
        </div>

        {/* Features list */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <div className="bg-emerald-100 p-2 rounded-full mr-3">
              <FaChartLine className="text-amber-500" />
            </div>
            <span className="text-emerald-700">Track expenses effortlessly</span>
          </div>
          <div className="flex items-center mb-3">
            <div className="bg-emerald-100 p-2 rounded-full mr-3">
              <FaCoins className="text-amber-500" />
            </div>
            <span className="text-emerald-700">AI-powered budget planning</span>
          </div>
          <div className="flex items-center">
            <div className="bg-emerald-100 p-2 rounded-full mr-3">
              <FaMoneyCheckAlt className="text-amber-500" />
            </div>
            <span className="text-emerald-700">Smart financial insights</span>
          </div>
        </div>

        {/* Sign in button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-emerald-200 rounded-xl text-emerald-800 font-medium hover:bg-emerald-50 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>

        {/* Footer */}
        <p className="text-center text-emerald-600 text-sm mt-6">
          By signing in, you agree to our Terms and Privacy Policy
        </p>
      </div>  

      {/* Animated circles in background - positioned inside to avoid overflow */}
      <div className="absolute bottom-5 left-5 w-32 h-32 rounded-full bg-amber-200 opacity-30 animate-pulse"></div>
      <div className="absolute top-5 right-5 w-32 h-32 rounded-full bg-emerald-200 opacity-30 animate-pulse delay-1000"></div>
    </div>
  );
}

export default Signup;     