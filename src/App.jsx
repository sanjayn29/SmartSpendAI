import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, signOut } from "./firebase"; // Keep these for the auth instance and signOut
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged directly from Firebase
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import Savings from "./pages/Savings";
import Assistant from "./pages/Assistant";
import Overview from "./pages/Overview";
import Budget from "./pages/Budget";
import Alerts from "./pages/Alerts";
import Education from "./pages/Education";
import Progress from "./pages/Progress";
import Calculator from "./pages/Calculator"; // Add Calculator import
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Signup from "./pages/Signup";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once auth state is resolved
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>; // Improved loading UI
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white flex">
        {user && (
          <Navbar user={user} handleSignOut={handleSignOut} setUser={setUser} />
        )}
        <div
          className={`flex-1 transition-all duration-500 ${
            user ? "md:ml-64" : "ml-0"
          }`}
        >
          {!user ? (
            <Signup setUser={setUser} />
          ) : (
            <div className="p-4">
              <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/savings" element={<Savings />} />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/education" element={<Education />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/chatbot" element={<Chatbot user={user} />} />
                <Route path="/about" element={<About />} />
                <Route path="/calculator" element={<Calculator />} /> {/* Add Calculator route */}
              </Routes>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;