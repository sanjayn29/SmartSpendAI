import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaTimes, FaPaperPlane, FaRobot, FaLightbulb, FaChartLine, FaPiggyBank } from "react-icons/fa";

function Chatbot() {
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

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender, timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) }]);
  };

  const handleSendMessage = async (message, isVoice = false) => {
    if (!message.trim()) return;

    addMessage(message, "user");
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: messages.map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })) }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't generate a response.";
      addMessage(reply, "bot");
    } catch (err) {
      console.error("Chat error:", err);
      addMessage("There was a problem contacting the assistant. Please try again.", "bot");
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
                  <ul className="text-left list-disc list-inside">
                    <li>"How can I save more money?"</li>
                    <li>"Create a budget for me"</li>
                    <li>"Analyze my spending habits"</li>
                  </ul>
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
                  className={`max-w-xs lg:max-w-md p-4 rounded-2xl shadow-sm animate-fade-in ${
                    message.sender === "user"
                      ? "bg-emerald-700 text-white rounded-br-none"
                      : "bg-emerald-100 text-emerald-800 rounded-bl-none"
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className={`text-xs mt-1 ${message.sender === "user" ? "text-emerald-200" : "text-emerald-600"}`}>
                    {message.timestamp}
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