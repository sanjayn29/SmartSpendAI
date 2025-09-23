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
  FaSignOutAlt,
  FaExchangeAlt,
  FaPercentage,
  FaChartLine
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
    { to: "/", icon: <FaHome size={20} />, text: "Home" },
    { to: "/transactions", icon: <FaMoneyBill size={20} />, text: "Transactions" },
    { to: "/dashboard", icon: <FaChartPie size={20} />, text: "Dashboard" },
    { to: "/budget", icon: <FaCreditCard size={20} />, text: "Budget Planner" },
    { to: "/calculator", icon: <FaCalculator size={20} />, text: "Calculator" },
    { to: "/inflation", icon: <FaPercentage size={20} />, text: "Inflation Calculator" },
    { to: "/money", icon: <FaExchangeAlt size={20} />, text: "Currency Converter" },
    { to: "/chatbot", icon: <FaRobot size={20} />, text: "AI Chatbot" },
    { to: "/education", icon: <FaGraduationCap size={20} />, text: "Finance Education" },
    { to: "/about", icon: <FaInfoCircle size={20} />, text: "About" },
  ];

  return (
    <>
      {/* Import Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Economica:wght@700&display=swap" rel="stylesheet" />

      {/* Mobile overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        className={`fixed z-50 md:hidden top-4 left-4 p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-amber-300 shadow-lg transition-all duration-300 ${
          isExpanded ? "opacity-0 scale-0" : "opacity-100 scale-100"
        }`}
        onClick={() => setIsExpanded(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar Navigation */}
      <nav
        className={`fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-emerald-100 to-green-50 border-r border-emerald-300 flex flex-col items-start justify-between h-screen z-50 transition-all duration-500 ease-in-out ${
          isExpanded ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* User Info Section */}
        <div className="w-full py-6 flex items-center justify-center border-b border-emerald-300 bg-white/50">
          <div className="flex flex-col items-center gap-3">
            <span 
              className="text-4xl font-bold text-emerald-800 drop-shadow-sm" 
              style={{ fontFamily: "Economica, sans-serif" }}
            >
              SmartSpend
            </span>
            <div className="relative">
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="profile"
                className="w-16 h-16 rounded-full border-2 border-amber-400 shadow-lg"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24'%3E%3Cpath fill='%2310b981' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-lg font-bold text-emerald-800 text-center px-2">
              {user.displayName || user.email?.split('@')[0] || "User"}
            </span>
            <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
              Premium Member
            </span>
          </div>
        </div>

        {/* Navigation Items - Scrollbar Removed */}
        <div className="flex-1 flex flex-col space-y-1 w-full px-3 py-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]">
          <style>
            {`
              .overflow-y-auto::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          {navItems.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group ${
                location.pathname === item.to
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg transform scale-105"
                  : "text-emerald-800 hover:bg-emerald-200/80 hover:transform hover:scale-105"
              }`}
              onMouseEnter={() => setActiveHover(index)}
              onMouseLeave={() => setActiveHover(null)}
              onClick={() => {
                if (window.innerWidth < 768) setIsExpanded(false);
              }}
            >
              {/* Animated highlight bar */}
              <div
                className={`absolute left-0 w-1 h-10 rounded-r-full transition-all duration-300 ${
                  location.pathname === item.to
                    ? "bg-gradient-to-b from-amber-400 to-amber-600 shadow-lg"
                    : activeHover === index
                    ? "bg-amber-400 h-8"
                    : "bg-transparent"
                }`}
              />

              {/* Icon */}
              <div
                className={`transition-all duration-300 ${
                  location.pathname === item.to
                    ? "text-amber-300 transform scale-110"
                    : "text-emerald-600 group-hover:text-amber-600"
                }`}
              >
                {item.icon}
              </div>

              {/* Text */}
              <span
                className={`text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.to ? "font-bold" : ""
                }`}
              >
                {item.text}
              </span>

              {/* Hover effect - shimmering gold line */}
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-amber-300/30 to-transparent opacity-0 transition-opacity duration-500 ${
                  activeHover === index ? "opacity-100" : ""
                }`}
              />

              {/* Active indicator dot */}
              {location.pathname === item.to && (
                <div className="absolute top-2 right-3 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              )}
            </Link>
          ))}
        </div>

        {/* Logout Button Section */}
        <div className="w-full pt-4 pb-6 px-3 border-t border-emerald-300 bg-white/30">
          <button
            onClick={() => {
              handleSignOut();
              if (window.innerWidth < 768) setIsExpanded(false);
            }}
            className="flex items-center space-x-3 p-3 w-full rounded-xl text-emerald-800 hover:bg-red-100 hover:text-red-700 transition-all duration-300 group"
          >
            <div className="relative">
              <FaSignOutAlt size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-sm font-medium">Sign Out</span>
            <div className="flex-1"></div>
            <span className="text-xs opacity-60 group-hover:opacity-100">⎋</span>
          </button>
          
          {/* Decorative separator */}
          <div className="flex justify-center my-3">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
          </div>
          
          {/* Footer text */}
          <p className="text-xs text-center text-emerald-600 font-medium">
            Smart Financial Management
          </p>
          <p className="text-[10px] text-center text-emerald-500 mt-1">
            v2.1.0 • Secure & Encrypted
          </p>
        </div>
      </nav>
    </>
  );
};

export default Navbar;