// src/pages/Progress.jsx - Progress Dashboard & Activity Tracker
import React from 'react';

const Progress = () => {
  const activityData = [
    // Simplified grid data for Aug-Sep-Oct
    { day: 'Mon', aug: 'low', sep: 'high', oct: 'medium' },
    // ... add more rows as needed
  ];

  return (
    <div className="p-4 pt-20">
      <h1 className="text-xl font-bold mb-4">Progress Dashboard</h1>
      <p className="text-gray-400 mb-4">Track your daily coding activity</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 p-4 rounded">
          <div>🔥 Current Streak: 2 days</div>
          <div className="text-green-500">29%</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div>🏆 Longest Streak: 6 days</div>
          <div className="text-green-500">43%</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div>⏱️ Total Time: 18h 43m</div>
          <div className="text-green-500">19%</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div>📈 Avg Daily: 2h 4m</div>
          <div className="text-green-500">100%</div>
        </div>
      </div>
      <p className="text-orange-500 mb-4">Keep up the great work! 🔥</p>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Activity Tracker</h3>
        <p className="text-gray-400 mb-2">Less ⬛ 0-5min 🟢 5-30min 🟨 30-60min 🟢 60-120min 🟢 120+min</p>
        <div className="grid grid-cols-4 gap-1 bg-gray-800 p-2 rounded">
          {/* Simplified calendar grid */}
          <div className="w-6 h-6 bg-green-500"></div>
          {/* Add more cells */}
        </div>
      </div>
    </div>
  );
};

export default Progress;