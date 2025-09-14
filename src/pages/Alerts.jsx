// src/pages/Alerts.jsx - Financial Alerts
import React from 'react';

const Alerts = () => {
  return (
    <div className="p-4 pt-20">
      <h1 className="text-xl font-bold mb-4">Get Financial Alerts</h1>
      <p className="text-gray-400 mb-4">Stay updated with important financial notifications through Telegram. Connect now to receive alerts about bills, budgets, and financial tips.</p>
      <button className="w-full btn-green mb-2 flex items-center justify-center">
        📱 Connect to Telegram
      </button>
      <button className="w-full text-gray-400">Maybe Later</button>
    </div>
  );
};

export default Alerts;