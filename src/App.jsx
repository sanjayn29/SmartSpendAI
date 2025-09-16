import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Savings from "./pages/Savings";
import Assistant from "./pages/Assistant";
import Overview from "./pages/Overview";
import Budget from "./pages/Budget";
import Alerts from "./pages/Alerts";
import Education from "./pages/Education";
import Progress from "./pages/Progress";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Signup from "./pages/Signup";
import { auth, signOut } from "./firebase";

function App() {
  const [user, setUser] = useState(null);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

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
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;