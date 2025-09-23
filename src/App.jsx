import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, signOut } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import Education from "./pages/Education";
import Calculator from "./pages/Calculator";
import Inflation from "./pages/Inflation";
import Money from "./pages/Money";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Transaction from "./pages/Transaction";
import BudgetPlanner from "./pages/BudgetPlanner";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";

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
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-amber-500 mx-auto mb-4"></div>
          <p>Loading SmartSpendAI...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* Main layout: Navbar (sidebar) and content */}
        <div className="flex flex-1 w-full">
          {user && <Navbar user={user} handleSignOut={handleSignOut} setUser={setUser} />}
          <div
            className={`flex-1 flex flex-col w-full transition-all duration-500 ${
              user ? "md:ml-64" : "ml-0"
            }`}
          >
            <main className="flex-1 bg-gradient-to-br from-emerald-50 to-green-100">
              {!user ? (
                <Signup setUser={setUser} />
              ) : (
                <Routes>
                  <Route path="/" element={<Home user={user} />} />
                  <Route path="/education" element={<Education />} />
                  <Route path="/chatbot" element={<Chatbot user={user} />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/calculator" element={<Calculator />} />
                  <Route path="/inflation" element={<Inflation />} />
                  <Route path="/money" element={<Money />} />
                  <Route path="/transactions" element={<Transaction user={user} />} />
                  <Route path="/budget" element={<BudgetPlanner user={user} />} />
                  <Route path="/dashboard" element={<Dashboard user={user} />} />
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center py-12 bg-white rounded-2xl shadow-xl p-8 mx-4 max-w-md w-full">
                          <h1 className="text-3xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
                          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                          <a 
                            href="/" 
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 inline-block"
                          >
                            Go to Home
                          </a>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              )}
            </main>
            {user && <Footer />}
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;