import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, signOut } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import Education from "./pages/Education";
import Calculator from "./pages/Calculator";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Transaction from "./pages/Transaction";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
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
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white flex">
        {user && <Navbar user={user} handleSignOut={handleSignOut} setUser={setUser} />}
        <div className={`flex-1 transition-all duration-500 ${user ? "md:ml-64" : "ml-0"}`}>
          {!user ? (
            <Signup setUser={setUser} />
          ) : (
            <div className="p-4">
              <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/education" element={<Education />} />
                <Route path="/chatbot" element={<Chatbot user={user} />} />
                <Route path="/about" element={<About />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route
                  path="/transactions"
                  element={<Transaction user={user} />} // Pass user prop
                />
              </Routes>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;