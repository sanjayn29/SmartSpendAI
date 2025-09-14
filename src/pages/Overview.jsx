// src/pages/Overview.jsx - Financial Overview with Chart
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jul', income: 5000, expense: 3000 },
  { month: 'Aug', income: 6512, expense: 3400 },
  { month: 'Sep', income: 6000, expense: 3200 },
];

const Overview = () => {
  return (
    <div className="p-4 pt-20">
      <h1 className="text-xl font-bold mb-4">Financial Overview</h1>
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div className="bg-green-600 p-4 rounded">Income ₹6,512</div>
        <div className="bg-red-600 p-4 rounded">Expenses ₹3,400</div>
        <div className="bg-blue-600 p-4 rounded">Net ₹3,112</div>
      </div>
      <div className="bg-gray-800 p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">Analytics - 3 Months</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
            <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Expenses" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;