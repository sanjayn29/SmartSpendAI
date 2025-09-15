// src/pages/Signup.jsx
import React from "react";
import { auth, provider, signInWithPopup } from "../firebase"; 
import { useNavigate } from "react-router-dom";

function Signup({ setUser }) {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/"); // redirect to home after login
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl mb-6">Welcome to AI Smart Spend</h1>
      <button
        onClick={handleGoogleSignIn}
        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Signup;
