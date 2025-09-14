// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4 flex justify-around items-center h-16 md:h-20">
      <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-green-500' : 'text-gray-400'}`}>
        <div className="text-lg">🏠</div>
        <span className="text-xs">Home</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-green-500' : 'text-gray-400'}`}>
        <div className="text-lg">👤</div>
        <span className="text-xs">Profile</span>
      </Link>
      <Link to="/about" className={`flex flex-col items-center ${location.pathname === '/about' ? 'text-green-500' : 'text-gray-400'}`}>
        <div className="text-lg">ℹ️</div>
        <span className="text-xs">About</span>
      </Link>
    </nav>
  );
};

export default Navbar;