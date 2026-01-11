import React from "react";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaGithub,
  FaHeart,
  FaRegCopyright
} from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-amber-500 p-2 rounded-lg mr-3">
                <FaHeart className="text-white" />
              </span>
              SmartSpendAI
            </h3>
            <p className="text-emerald-100 mb-4">
              Your intelligent financial companion for smarter money management. 
              We help you track, plan, and optimize your finances with AI-powered insights.
            </p>
            <div className="flex space-x-4">
              
              <a href="#" className="text-emerald-100 hover:text-amber-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-emerald-100 hover:text-amber-400 transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-emerald-100 hover:text-amber-400 transition-colors">
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-emerald-100 hover:text-amber-400 transition-colors">Home</a></li>
              <li><a href="/transactions" className="text-emerald-100 hover:text-amber-400 transition-colors">Transactions</a></li>
              <li><a href="/dashboard" className="text-emerald-100 hover:text-amber-400 transition-colors">Dashboard</a></li>
              <li><a href="/budget" className="text-emerald-100 hover:text-amber-400 transition-colors">Budget Planner</a></li>
              <li><a href="/calculator" className="text-emerald-100 hover:text-amber-400 transition-colors">Calculator</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-400">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/education" className="text-emerald-100 hover:text-amber-400 transition-colors">Finance Education</a></li>
              <li><a href="/chatbot" className="text-emerald-100 hover:text-amber-400 transition-colors">AI Chatbot</a></li>
              <li><a href="/about" className="text-emerald-100 hover:text-amber-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-emerald-100 hover:text-amber-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-emerald-100 hover:text-amber-400 transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-emerald-700 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center text-emerald-100 mb-4 md:mb-0">
            <FaRegCopyright className="mr-1" />
            <span>{currentYear} SmartSpendAI. All rights reserved .</span>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;