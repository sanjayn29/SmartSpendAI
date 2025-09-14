// src/pages/About.jsx
import React from 'react';

const About = () => {
  return (
    <div className="p-4 pt-20 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold text-green-500 mb-6">About CashMan</h1>
      <p className="text-gray-400 mb-4">
        CashMan is a smart financial management tool designed to help you take control of your finances with clarity and ease. Whether you're planning your savings, tracking expenses, or learning about wealth-building strategies, CashMan is your trusted companion on the journey to financial freedom.
      </p>

      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-green-500 mb-4">Our Mission</h2>
        <p className="text-gray-300">
          Our mission is to empower individuals with the tools and knowledge to manage their finances effectively. By combining intuitive features with expert insights, we aim to make financial planning accessible to everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-500 mb-2">Key Features</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Smart Savings Goals</li>
            <li>Expense Tracking & Breakdown</li>
            <li>Inflation Impact Analysis</li>
            <li>Financial Education Resources</li>
            <li>Personalized Financial Assistant</li>
          </ul>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-500 mb-2">Who We Are</h3>
          <p className="text-gray-300">
            CashMan is proudly built by Outliers United, a team passionate about innovative solutions for everyday challenges. Our dedication to excellence drives us to deliver a seamless and secure financial management experience.
          </p>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-green-500 mb-4">Get Started</h2>
        <p className="text-gray-400 mb-4">
          Ready to take charge of your finances? Explore CashMan today and start building a brighter financial future. Connect with us for alerts and updates via Telegram for a personalized experience.
        </p>
        <a href="/alerts" className="inline-block btn-green text-center py-2 px-4 rounded">
          Connect to Telegram
        </a>
      </div>
    </div>
  );
};

export default About;