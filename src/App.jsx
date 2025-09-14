// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Savings from './pages/Savings';
import Assistant from './pages/Assistant';
import Overview from './pages/Overview';
import Budget from './pages/Budget';
import Alerts from './pages/Alerts';
import Education from './pages/Education';
import Progress from './pages/Progress';
import Navbar from './components/Navbar';
import About from './pages/About'; // Import the new About page

function App() {
  const [user] = useState({ name: 'Swetha', balance: '****' });

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
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
          <Route path="/about" element={<About />} /> {/* Add the About route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;