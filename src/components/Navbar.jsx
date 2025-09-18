import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaMoneyBill, 
  FaChartPie, 
  FaCreditCard, 
  FaInfoCircle, 
  FaCalculator, 
  FaRobot,
  FaGraduationCap,
  FaSignOutAlt
} from "react-icons/fa";
import { auth } from "../firebase";

const Navbar = ({ user, setUser, handleSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  // Auto-collapse on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  }, [location]);

  const navItems = [
    { to: "/", icon: <FaHome size={24} />, text: "Home" },
    { to: "/transactions", icon: <FaMoneyBill size={24} />, text: "Transactions" },
    { to: "/dashboard", icon: <FaChartPie size={24} />, text: "Dashboard" },
    { to: "/budget", icon: <FaCreditCard size={24} />, text: "Budget Planner" }, // Updated text and ensured correct icon
    { to: "/about", icon: <FaInfoCircle size={24} />, text: "About" },
    { to: "/calculator", icon: <FaCalculator size={24} />, text: "Calculator" },
    { to: "/chatbot", icon: <FaRobot size={24} />, text: "Chatbot" },
    { to: "/education", icon: <FaGraduationCap size={24} />, text: "Finance Education" },
  ];

  return (
    <>
      {/* Import Google Font (move to index.html for global scope in production) */}
      <link href="https://fonts.googleapis.com/css2?family=Economica:wght@700&display=swap" rel="stylesheet" />
      
      {/* Mobile overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      {/* Toggle button */}
      <button
        className={`fixed z-50 md:hidden top-4 left-4 p-2 rounded-lg bg-emerald-700 text-amber-300 shadow-lg transition-all duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}
        onClick={() => setIsExpanded(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <nav 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-emerald-100 border-r border-emerald-300 p-4 flex flex-col items-start justify-start overflow-y-auto z-50 transition-all duration-500 ease-in-out ${isExpanded ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* User Info */}
        <div className="w-full py-6 mb-4 flex items-center justify-center border-b border-emerald-300">
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl font-bold text-emerald-800" style={{ fontFamily: 'Economica, sans-serif' }}>
              SmartSpend
            </span>
            <img
              src={user.photoURL || "default-avatar.png"} // Fallback for missing photoURL
              alt="profile"
              className="w-20 h-20 rounded-full"
            />
            <span className="text-lg font-bold text-emerald-800">{user.displayName || user.email || "User"}</span> {/* Fallback for displayName */}
          </div>
        </div>

        <div className="flex flex-col space-y-2 w-full mt-4">
          {navItems.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 group ${
                location.pathname === item.to 
                  ? 'bg-emerald-700 text-white shadow-md' 
                  : 'text-emerald-800 hover:bg-emerald-200'
              }`}
              onMouseEnter={() => setActiveHover(index)}
              onMouseLeave={() => setActiveHover(null)}
              onClick={() => {
                if (window.innerWidth < 768) setIsExpanded(false);
              }}
            >
              {/* Animated highlight bar */}
              <div className={`absolute left-0 w-1 h-8 rounded-r-full transition-all duration-300 ${
                location.pathname === item.to 
                  ? 'bg-gradient-to-b from-amber-400 to-amber-600' 
                  : activeHover === index ? 'bg-amber-400 h-6' : 'bg-transparent'
              }`} />
              
              {/* Icon with gold color */}
              <div className={`transition-all duration-300 ${
                location.pathname === item.to 
                  ? 'text-amber-300' 
                  : 'text-amber-600 group-hover:text-amber-700'
              }`}>
                {item.icon}
              </div>
              
              <span className={`text-sm font-medium transition-all duration-300 ${
                location.pathname === item.to ? 'font-bold' : ''
              }`}>
                {item.text}
              </span>
              
              {/* Hover effect - shimmering gold line */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-amber-300/20 to-transparent opacity-0 transition-opacity duration-500 ${
                activeHover === index ? 'opacity-100' : ''
              }`} />
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-auto w-full pt-6 border-t border-emerald-300">
          <button
            onClick={() => {
              handleSignOut();
              if (window.innerWidth < 768) setIsExpanded(false);
            }}
            className="flex items-center space-x-4 p-3 w-full rounded-xl text-emerald-800 hover:bg-emerald-200 transition-all duration-300"
          >
            <FaSignOutAlt size={24} className="text-amber-600 hover:text-amber-700" />
            <span className="text-sm font-medium">Logout</span>
          </button>
          <div className="flex justify-center">
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 mb-4" />
          </div>
          <p className="text-xs text-center text-emerald-700">
            Manage Your Finances Smartly
          </p>
        </div>
      </nav>
    </>
  );
};

export default Navbar;