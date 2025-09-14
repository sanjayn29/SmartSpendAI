// src/pages/Profile.jsx - Profile with Logout
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simulate logout
    navigate('/');
  };

  return (
    <div className="p-4 pt-20">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mr-4">S</div>
        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-gray-400">Account active • Verified</p>
        </div>
      </div>
      <button className="w-full bg-gray-700 p-3 rounded mb-4">📄 Terms & Conditions</button>
      <div className="space-y-2 mb-6">
        <h3 className="font-semibold">Financial Strategies</h3>
        <div className="flex justify-between text-sm">
          <span>#23 Expert advice to improve your financial health</span>
          <span className="text-gray-400">2 days ago</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>#24 Expert advice to improve your financial health</span>
          <span className="text-gray-400">2 days ago</span>
        </div>
      </div>
      <p className="text-gray-400 text-center mb-4">Showing 2 of 24 resources</p>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-500 mb-2">CashMan</h2>
        <p className="text-pink-400 mb-4">We'll miss you 💕</p>
        <div className="bg-gray-800 p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">Ready to leave?</h3>
          <p className="text-gray-400 mb-4">Logout to end your session securely</p>
          <button onClick={handleLogout} className="w-full btn-green">Logout</button>
        </div>
        <p className="text-gray-400 text-xs">Built by Outliers United →</p>
      </div>
    </div>
  );
};

export default Profile;