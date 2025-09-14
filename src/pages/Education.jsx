// src/pages/Education.jsx - Financial Education
import React from 'react';

const videos = [
  { id: 1, title: 'I Lost ₹1 Aaj Tak Trading!', duration: '10:24', category: 'All' },
  { id: 2, title: 'Making ₹100 Channel Stocks', duration: '10:24', category: 'Stocks' },
  { id: 3, title: 'Basics of Share Market Tech', duration: '10:24', category: 'Investing' },
  { id: 4, title: 'What is a Share Market?', duration: '10:24', category: 'Stocks' },
];

const Education = () => {
  return (
    <div className="p-4 pt-20">
      <h1 className="text-xl font-bold mb-4">Financial Education</h1>
      <p className="text-gray-400 mb-4">Expert insights for wealth building</p>
      <div className="flex mb-4">
        <button className="bg-green-500 px-4 py-2 rounded-l">All</button>
        <button className="bg-gray-700 px-4 py-2">Investing</button>
        <button className="bg-gray-700 px-4 py-2">Stocks</button>
      </div>
      <div className="space-y-4">
        {videos.map((video) => (
          <div key={video.id} className="grid grid-cols-2 gap-4 bg-gray-800 p-4 rounded">
            <div className="aspect-video bg-gray-700 rounded flex items-center justify-center">▶️ {video.title}</div>
            <div>
              <h3 className="font-semibold">{video.title}</h3>
              <p className="text-gray-400">{video.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;