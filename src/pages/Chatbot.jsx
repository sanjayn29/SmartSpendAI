import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaTimes, FaPaperPlane, FaRobot, FaLightbulb, FaChartLine, FaPiggyBank, FaVolumeUp, FaCheckCircle } from "react-icons/fa";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, doc, updateDoc, arrayUnion, getDoc } from '../firebase';

function Chatbot() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendMessage(transcript, true); // Send voice input
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        addMessage("Sorry, I couldn't understand that. Please try again or type your message.", "bot");
      };

      recognitionInstance.onend = () => {
        // Ensure UI reflects stopped state
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      addMessage("Voice input is not supported in this browser. Please type your message.", "bot");
    }

    // Welcome message
    addMessage("Hello! I'm SmartSpendAI's chatbot. How can I assist you today?", "bot");

    // Auto-remove intro after 5 seconds
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 5000);

    return () => clearTimeout(introTimer);
  }, []);

  // Animation styles useEffect - MOVED INSIDE THE COMPONENT
  useEffect(() => {
    const styles = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
        100% { transform: translateY(0px); }
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      .animate-pulse {
        animation: pulse 2s infinite;
      }
      .animate-shimmer {
        background: linear-gradient(90deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%);
        background-size: 1000px 1000px;
        animation: shimmer 2s infinite linear;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (text, sender, hasTransaction = false, transactionData = null) => {
    setMessages((prev) => [...prev, { 
      text, 
      sender, 
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
      hasTransaction,
      transactionData
    }]);
  };

  // Text-to-Speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a female voice if available
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('hazel')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Extract transaction intent from message
  const extractTransactionIntent = (message) => {
    const messageLower = message.toLowerCase();
    
    // Income patterns
    const incomePatterns = [
      /add (?:income|money|cash|salary|earning|credit)\s*(?:of\s*)?(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)/i,
      /(?:income|earned|received|got|salary|credit)\s*(?:of\s*)?(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)/i,
      /add (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)\s*(?:income|earning|salary|credit)/i,
      /credit (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)/i,
      /deposit (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)/i
    ];
    
    // Expense patterns
    const expensePatterns = [
      /add (?:expense|spent|spend|cost|paid|bill|debit)\s*(?:of\s*)?(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)/i,
      /(?:spent|spend|paid|cost|expense|bill|debit)\s*(?:of\s*)?(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)/i,
      /add (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)\s*(?:expense|spent|cost|bill)/i,
      /debit (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)/i,
      /withdraw (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)/i,
      /i spent (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)/i
    ];
    
    // Check income patterns
    for (const pattern of incomePatterns) {
      const match = message.match(pattern);
      if (match) {
        return {
          type: 'income',
          amount: parseFloat(match[1]),
          description: 'Income added via chatbot'
        };
      }
    }
    
    // Check expense patterns
    for (const pattern of expensePatterns) {
      const match = message.match(pattern);
      if (match) {
        return {
          type: 'expense',
          amount: parseFloat(match[1]),
          description: 'Expense added via chatbot'
        };
      }
    }
    
    return null;
  };

  // Add transaction to Firebase
  const addTransactionToFirebase = async (transactionData) => {
    try {
      if (!user || !user.email) {
        throw new Error('User not authenticated');
      }

      const userDocRef = doc(db, "transactions", user.email);
      const docSnap = await getDoc(userDocRef);
      
      const currentData = docSnap.exists() ? docSnap.data() : { totalAmount: 0, transactions: [] };
      
      const transaction = {
        type: transactionData.type === 'income' ? 'Income' : 'Expense',
        amount: transactionData.amount,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        source: 'Chatbot',
        description: transactionData.description
      };
      
      // Update total amount
      const newTotal = transactionData.type === 'income' 
        ? currentData.totalAmount + transactionData.amount
        : currentData.totalAmount - transactionData.amount;
      
      // Update document
      await updateDoc(userDocRef, {
        totalAmount: newTotal,
        transactions: arrayUnion(transaction)
      });
      
      return {
        success: true,
        transaction,
        newBalance: newTotal
      };
    } catch (error) {
      console.error('Firebase transaction error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const handleSendMessage = async (message, isVoice = false) => {
    if (!message.trim()) return;

    addMessage(message, "user");
    setInput("");

    // Check for transaction intent first
    const transactionIntent = extractTransactionIntent(message);
    
    if (transactionIntent && user?.email) {
      // Handle transaction locally
      const result = await addTransactionToFirebase(transactionIntent);
      
      if (result.success) {
        const transactionType = transactionIntent.type === 'income' ? 'income' : 'expense';
        const reply = `✅ Successfully added ${transactionType} of ₹${transactionIntent.amount.toLocaleString('en-IN')}! Your new balance is ₹${result.newBalance.toLocaleString('en-IN')}.`;
        
        addMessage(reply, "bot", true, result.transaction);
        
        if (isVoice) {
          speakText(reply);
        }
        return;
      } else {
        const errorReply = `❌ Sorry, I couldn't add the transaction. Error: ${result.error}`;
        addMessage(errorReply, "bot");
        if (isVoice) {
          speakText(errorReply);
        }
        return;
      }
    } else if (transactionIntent && !user?.email) {
      const loginReply = "I can help you add transactions, but I need you to be logged in first. Please sign in to your account.";
      addMessage(loginReply, "bot");
      if (isVoice) {
        speakText(loginReply);
      }
      return;
    }

    // If no transaction intent, proceed with regular chat
    try {
      const requestBody = {
        message,
        userEmail: user?.email || null,
        history: messages.map(m => ({ 
          role: m.sender === "user" ? "user" : "assistant", 
          content: m.text 
        }))
      };

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't generate a response.";
      
      addMessage(reply, "bot");
      
      // Speak the response if it was a voice input
      if (isVoice) {
        speakText(reply);
      }
      
    } catch (err) {
      console.error("Chat error:", err);
      
      // Provide helpful fallback responses when backend is not available
      const fallbackResponses = [
        "I'm here to help you with your finances! You can add transactions by saying things like 'Add income 5000' or 'I spent 200 on groceries'.",
        "I can help you manage your money! Try commands like 'Add expense 150' or 'Credit 3000' to track your transactions.",
        "Welcome to SmartSpendAI! I can help you track expenses and income. Just tell me about your transactions!",
        "I'm your financial assistant! You can add transactions by saying 'Add income [amount]' or 'I spent [amount]'. I can also provide financial advice!",
        "Hi there! I can help you track your spending and income. Try saying 'Add expense 100' or 'I earned 5000' to get started!",
        "I'm here to help with your financial management! You can tell me about your transactions and I'll save them for you."
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      addMessage(randomResponse, "bot");
      
      if (isVoice) {
        speakText(randomResponse);
      }
    }
  };

  const toggleListening = async () => {
    if (!recognition) {
      addMessage("Voice input is not available. Try a Chromium-based browser on localhost/HTTPS.", "bot");
      return;
    }

    if (isListening) {
      try {
        recognition.stop();
      } catch (e) {
        console.warn("Error stopping recognition", e);
      }
      setIsListening(false);
      return;
    }

    // Preflight mic permission to trigger browser prompt
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately stop tracks; we only wanted the permission prompt
        stream.getTracks().forEach(t => t.stop());
      }
    } catch (permErr) {
      console.error("Microphone permission denied", permErr);
      addMessage("Please allow microphone access to use voice input.", "bot");
      return;
    }

    try {
      recognition.start();
      setIsListening(true);
    } catch (startErr) {
      console.error("Failed to start recognition", startErr);
      addMessage("Couldn't start voice input. Please try again.", "bot");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 opacity-20 animate-float">
        <FaChartLine className="text-amber-400 text-6xl" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <FaPiggyBank className="text-amber-400 text-6xl" />
      </div>
      <div className="absolute top-1/3 right-1/4 opacity-10">
        <FaLightbulb className="text-amber-400 text-8xl animate-pulse" />
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl border border-emerald-200 w-full max-w-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        {/* Header with shimmer effect */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-300 animate-shimmer">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-3 rounded-full mr-4 shadow-lg animate-pulse">
              <FaRobot className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-emerald-800">SmartSpendAI Chatbot</h2>
              <p className="text-emerald-600 text-sm">Your personal finance helper</p>
            </div>
          </div>
          <button
            onClick={() => window.close()} // Closes the window if in a popup; adjust for app context
            className="text-emerald-700 hover:text-amber-600 transition-colors transform hover:rotate-90 duration-300"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Unique intro message that disappears */}
        {showIntro && (
          <div className="bg-amber-50 border-b border-amber-200 p-4 text-center text-amber-700 animate-fade-in">
            <div className="flex items-center justify-center">
              <FaLightbulb className="text-amber-500 mr-2" />
              <span className="font-medium">Pro Tip: </span>
              <span className="ml-1">Ask me to analyze your spending patterns or create a budget!</span>
            </div>
          </div>
        )}

        {/* Chat Window */}
        <div className="h-[500px] p-6 overflow-y-auto bg-emerald-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-emerald-700">
              <div className="bg-white p-6 rounded-2xl shadow-md max-w-md animate-fade-in">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaRobot className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Welcome to SmartSpendAI!</h3>
                <p className="mb-4">I'm here to help you manage your finances smarter.</p>
                <div className="bg-emerald-100 p-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">Try asking me:</p>
                  <ul className="text-left list-disc list-inside space-y-1">
                    <li>"Add income 5000" or "Add expense 200"</li>
                    <li>"I spent 150 on groceries"</li>
                    <li>"How can I save more money?"</li>
                    <li>"Create a budget for me"</li>
                  </ul>
                  <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                    <p className="text-xs text-amber-700 font-medium">💡 Voice commands work too!</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md p-4 rounded-2xl shadow-sm animate-fade-in relative ${
                    message.sender === "user"
                      ? "bg-emerald-700 text-white rounded-br-none"
                      : message.hasTransaction
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 rounded-bl-none border-2 border-green-300"
                      : "bg-emerald-100 text-emerald-800 rounded-bl-none"
                  }`}
                >
                  {/* Transaction indicator */}
                  {message.hasTransaction && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                      <FaCheckCircle className="w-3 h-3" />
                    </div>
                  )}
                  
                  <div className="text-sm">{message.text}</div>
                  
                  {/* Transaction details */}
                  {message.hasTransaction && message.transactionData && (
                    <div className="mt-2 p-2 bg-white rounded-lg border border-green-200">
                      <div className="text-xs text-green-700 font-medium">
                        Transaction Added: {message.transactionData.type} of ₹{message.transactionData.amount}
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex items-center justify-between mt-1 ${message.sender === "user" ? "text-emerald-200" : "text-emerald-600"}`}>
                    <span className="text-xs">{message.timestamp}</span>
                    {message.sender === "bot" && (
                      <button
                        onClick={() => speakText(message.text)}
                        className="ml-2 p-1 rounded hover:bg-emerald-200 transition-colors"
                        title="Listen to message"
                      >
                        <FaVolumeUp className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(input)}
              placeholder="Type a message or use voice..."
              className="flex-1 p-3 border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-emerald-800 bg-white transition-all duration-300 focus:shadow-md"
            />
            <button
              onClick={toggleListening}
              className={`p-3 rounded-xl transition-all transform hover:scale-110 duration-300 ${
                isListening
                  ? "bg-amber-500 text-white animate-pulse"
                  : "bg-emerald-200 text-emerald-700 hover:bg-emerald-300"
              }`}
            >
              <FaMicrophone className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim()}
              className="p-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-110 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-xs text-emerald-700 bg-emerald-100 border-t border-emerald-300">
          <span className="inline-block animate-pulse">•</span> Powered by SmartSpendAI • Your data is secure and private
        </div>
      </div>
    </div>
  );
}

export default Chatbot;