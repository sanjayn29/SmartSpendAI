// src/pages/Inflation.jsx - Savings & Inflation Impact (bonus page, link from budget if needed)
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const inflationData = [
  { period: 'Current', value: 1100 },
  { period: '1 Year', value: 1053 },
  { period: '3 Years', value: 702 },
  { period: '5 Years', value: 351 },
];

const Inflation = () => {
  return (
    <div className="p-4 pt-20">
      <h1 className="text-xl font-bold mb-4">Your Savings & Inflation Impact</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 p-2 rounded">Current Savings ₹1,100</div>
        <div className="bg-gray-800 p-2 rounded">Inflation Rate 5%</div>
      </div>
      <div className="bg-gray-800 p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">Future Value Projection</h3>
        <p className="text-gray-400 mb-4">Touch bars for details</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inflationData}>
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-gray-400">
        💡 Inflation reduces your money's purchasing power. With a 5% annual rate, your ₹1,100 today will feel like ₹861.88 in today's terms after 5 years due to rising prices.
      </p>
      <div className="flex justify-around mt-4">
        <button className="bg-gray-700 px-4 py-2 rounded">1 Year</button>
        <button className="bg-gray-700 px-4 py-2 rounded">3 Years</button>
        <button className="bg-green-500 px-4 py-2 rounded">5 Years</button>
      </div>
    </div>
  );
};

export default Inflation;