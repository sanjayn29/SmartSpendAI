// src/pages/Budget.jsx - Monthly Budget & Expense Breakdown
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const expenseData = [
  { category: 'Education', value: 44 },
  { category: 'Savings', value: 29 },
  { category: 'Shopping', value: 15 },
  { category: 'Travel', value: 3 },
  { category: 'Groceries', value: 3 },
  { category: 'Bills', value: 3 },
  { category: 'Gifts', value: 1 },
  { category: 'Other', value: 1 },
];

const Budget = () => {
  return (
    <div className="p-4 pt-20">
      <h1 className="text-xl font-bold mb-4">Monthly Budget</h1>
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center">Click me</div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-green-400 rounded-full"></div>
          <div className="absolute inset-0 w-28 h-28 border-4 border-gray-800 rounded-full"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 p-2 rounded">Current Savings ₹1,100</div>
        <div className="bg-gray-800 p-2 rounded">Inflation 5%</div>
      </div>
      <h2 className="font-semibold mb-2">Expense Breakdown - Total ₹3,400</h2>
      <div className="bg-gray-800 p-4 rounded mb-4">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={expenseData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <Radar dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Budget;