// src/pages/Savings.jsx - Smart Savings
import React, { useState } from 'react';

const Savings = () => {
  const [target, setTarget] = useState(5000);

  return (
    <div className="p-4 pt-20">
      <h1 className="text-xl font-bold mb-4">Smart Savings</h1>
      <p className="text-gray-400 mb-4">Plan your financial future with clarity</p>
      <div className="bg-green-600 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4 relative">
        <div className="text-2xl font-bold">₹{target}</div>
        <div className="absolute top-2 right-2 text-yellow-300">??</div>
      </div>
      <div className="bg-gray-800 p-4 rounded mb-4">
        <label className="block mb-2">Savings Target</label>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full bg-gray-700 p-2 rounded text-white"
        />
        <button className="mt-2 w-full btn-green">Set Goal</button>
      </div>
      <button className="w-full btn-green mb-2">Edit Goal</button>
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Detailed Progress →</button>
    </div>
  );
};

export default Savings;