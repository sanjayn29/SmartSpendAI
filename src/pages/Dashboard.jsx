import React from "react";

function Dashboard({ user }) {
  return (
    <div className="min-h-screen bg-black text-white p-5">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-500 mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to your financial dashboard, {user.displayName || user.email}!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-green-700/20 text-center">
          <h3 className="text-xl font-bold text-green-500 mb-2">Overview</h3>
          <p className="text-gray-400">Your financial summary will appear here.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-green-700/20 text-center">
          <h3 className="text-xl font-bold text-green-500 mb-2">Quick Stats</h3>
          <p className="text-gray-400">Track your progress and goals.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-green-700/20 text-center">
          <h3 className="text-xl font-bold text-green-500 mb-2">Insights</h3>
          <p className="text-gray-400">AI-powered financial advice.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;