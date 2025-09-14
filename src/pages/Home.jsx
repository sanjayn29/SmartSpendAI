// src/pages/Home.jsx - Welcome Screen with Overview
import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell } from 'recharts';

const Home = ({ user }) => {
  const data = [
    { name: 'Needs', value: 50, color: '#10B981' },
    { name: 'Wants', value: 30, color: '#EF4444' },
    { name: 'Savings', value: 20, color: '#3B82F6' },
  ];

  return (
    <div className="p-4 pt-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-500">Welcome, {user.name}!</h1>
        <p className="text-gray-400">Balance: {user.balance} 💰</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold">Life Savings Goal</h3>
          <p className="text-green-500">₹5,000</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold">50/30/20 Rule</h3>
          <PieChart width={100} height={100}>
            <Pie data={data} cx={50} cy={50} innerRadius={30} outerRadius={40} fill="#8884d8" paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
      <Link to="/overview" className="block w-full btn-green text-center mb-4">Financial Overview</Link>
      <Link to="/savings" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">Smart Savings</Link>
      <Link to="/assistant" className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4">CashMan Assistant</Link>
      <Link to="/budget" className="block w-full btn-green text-center">Monthly Budget</Link>
    </div>
  );
};

export default Home;