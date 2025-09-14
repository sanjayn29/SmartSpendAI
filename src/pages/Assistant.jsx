// src/pages/Assistant.jsx - Financial Assistant Chat
import React, { useState } from 'react';

const Assistant = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Financial Assistant. 👋", sender: 'bot' },
    { text: "How can I assist you today?", sender: 'bot' },
    { text: "Add 10 Rs in my expense for tea", sender: 'user' },
    { text: "I've logged an expense of ₹10 for tea. Your new main balance is ₹512. You've earned 10 points! Would you like to track your expenses or set a budget for tea?", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const addMessage = (text, sender) => {
    setMessages([...messages, { text, sender }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addMessage(input, 'user');
      // Simulate bot response
      setTimeout(() => addMessage('Thanks for logging! Balance updated.', 'bot'), 1000);
      setInput('');
    }
  };

  return (
    <div className="p-4 pt-20">
      <h1 className="text-xl font-bold mb-4">CashMan</h1>
      <p className="text-gray-400 mb-4">Smart Financial Management</p>
      <div className="bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-2 rounded-lg ${msg.sender === 'user' ? 'bg-green-600' : 'bg-gray-700'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your financial question..."
          className="flex-1 bg-gray-700 p-2 rounded-l text-white"
        />
        <button type="button" onClick={() => setIsRecording(!isRecording)} className="bg-green-600 p-2 rounded-r">
          {isRecording ? '⏹️' : '🎤'}
        </button>
      </form>
      {isRecording && <div className="mt-2 text-green-500">Recording... Speak clearly.</div>}
    </div>
  );
};

export default Assistant;