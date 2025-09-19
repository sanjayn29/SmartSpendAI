import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, doc, getDoc } from "../firebase";
import { 
  FaWallet, 
  FaChartPie, 
  FaMoneyBill, 
  FaCalculator, 
  FaRobot, 
  FaGraduationCap,
  FaArrowUp,
  FaArrowDown,
  FaQuoteLeft,
  FaCoins,
  FaPiggyBank,
  FaChartLine
} from "react-icons/fa";

function Home({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quotes] = useState([
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Beware of little expenses. A small leak will sink a great ship.",
    "It's not how much money you make, but how much money you keep.",
    "Rich people have small TVs and big libraries, and poor people have small libraries and big TVs.",
    "Do not save what is left after spending, but spend what is left after saving.",
    "The goal isn't more money. The goal is living life on your terms.",
    "Annual income twenty pounds, annual expenditure nineteen six, result happiness.",
    "Every dollar you save is a dollar you earn, but it's tax-free."
  ]);
  const [currentQuote, setCurrentQuote] = useState(0);

  // Fetch user data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.email) {
        setLoading(false);
        return;
      }

      try {
        // Fetch transactions
        const transactionsDocRef = doc(db, "transactions", user.email);
        const transactionsDocSnap = await getDoc(transactionsDocRef);

        if (transactionsDocSnap.exists()) {
          const data = transactionsDocSnap.data();
          setTotalAmount(data.totalAmount || 0);
          const validTransactions = (data.transactions || []).filter(t => t.date);
          setTransactions(validTransactions);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Rotate quotes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);

    return () => clearInterval(quoteInterval);
  }, [quotes.length]);

  // Calculate financial metrics
  const totalIncome = transactions
    .filter(t => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netIncome = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome * 100) : 0;

  // Recent transactions (last 3)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-amber-500 mx-auto"></div>
          <p className="text-emerald-800 mt-4 text-lg font-medium">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 relative overflow-hidden">
      {/* Animated coins */}
      <div className="absolute top-20 left-10 opacity-30 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <FaCoins className="text-amber-400 text-4xl" />
      </div>
      <div className="absolute top-40 right-20 opacity-40 animate-bounce" style={{ animationDelay: '1s' }}>
        <FaCoins className="text-amber-500 text-3xl" />
      </div>
      <div className="absolute bottom-40 left-20 opacity-30 animate-bounce" style={{ animationDelay: '1.5s' }}>
        <FaCoins className="text-amber-400 text-5xl" />
      </div>
      <div className="absolute top-60 left-1/4 opacity-20 animate-pulse">
        <FaPiggyBank className="text-emerald-500 text-6xl" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-pulse" style={{ animationDelay: '2s' }}>
        <FaChartLine className="text-emerald-500 text-6xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">
            Welcome back, {user?.displayName?.split(' ')[0] || 'Financial Explorer'}!
          </h1>
          <p className="text-emerald-600 text-lg">Your financial dashboard at a glance</p>
        </div>

        {/* Financial Quote */}
        <div className="bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300 rounded-2xl p-6 mb-8 text-center shadow-lg">
          <FaQuoteLeft className="text-amber-600 text-xl mb-2 mx-auto" />
          <p className="text-amber-800 text-lg italic font-medium">{quotes[currentQuote]}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-3">
                <FaWallet className="text-emerald-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">Current Balance</h3>
            </div>
            <div className="text-3xl font-bold text-emerald-800 mb-2">
              ₹{totalAmount.toLocaleString("en-IN")}
            </div>
            <p className="text-emerald-600 text-sm">
              {totalAmount > 0 ? "You're doing great!" : "Start adding income to begin"}
            </p>
          </div>

          {/* Income Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <FaArrowUp className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">Total Income</h3>
            </div>
            <div className="text-3xl font-bold text-blue-800 mb-2">
              ₹{totalIncome.toLocaleString("en-IN")}
            </div>
            <p className="text-emerald-600 text-sm">Your earnings to date</p>
          </div>

          {/* Expense Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full mr-3">
                <FaArrowDown className="text-red-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">Total Expenses</h3>
            </div>
            <div className="text-3xl font-bold text-red-800 mb-2">
              ₹{totalExpense.toLocaleString("en-IN")}
            </div>
            <p className="text-emerald-600 text-sm">Your spending to date</p>
          </div>

          {/* Savings Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-amber-100 p-3 rounded-full mr-3">
                <FaPiggyBank className="text-amber-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">Savings Rate</h3>
            </div>
            <div className="text-3xl font-bold text-amber-800 mb-2">
              {savingsRate.toFixed(1)}%
            </div>
            <p className="text-emerald-600 text-sm">
              {savingsRate > 20 ? "Excellent savings!" : "Keep working on it!"}
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-emerald-800 flex items-center">
              <FaMoneyBill className="mr-2 text-amber-600" />
              Recent Transactions
            </h2>
            <Link 
              to="/transactions" 
              className="text-emerald-700 hover:text-amber-600 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-emerald-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaMoneyBill className="text-emerald-600 text-2xl" />
              </div>
              <p className="text-emerald-700 font-medium mb-2">No transactions yet</p>
              <p className="text-emerald-600">Add your first transaction to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-200"
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 ${
                      transaction.type === "Income" 
                        ? "bg-emerald-100 text-emerald-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {transaction.type === "Income" ? <FaArrowUp /> : <FaArrowDown />}
                    </div>
                    <div>
                      <p className="font-medium text-emerald-800">{transaction.type}</p>
                      <p className="text-sm text-emerald-600">
                        {new Date(transaction.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    transaction.type === "Income" ? "text-emerald-700" : "text-red-700"
                  }`}>
                    ₹{transaction.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link 
            to="/transactions" 
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl p-6 shadow-lg transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-3 rounded-full mr-3">
                <FaMoneyBill className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-semibold">Transactions</h3>
            </div>
            <p className="text-emerald-100 text-sm">Manage your income and expenses</p>
          </Link>

          <Link 
            to="/dashboard" 
            className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-6 shadow-lg transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-3 rounded-full mr-3">
                <FaChartPie className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-semibold">Dashboard</h3>
            </div>
            <p className="text-blue-100 text-sm">View financial insights and charts</p>
          </Link>

          <Link 
            to="/budget" 
            className="bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl p-6 shadow-lg transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-3 rounded-full mr-3">
                <FaWallet className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-semibold">Budget Planner</h3>
            </div>
            <p className="text-amber-100 text-sm">Create and manage your budget</p>
          </Link>

          <Link 
            to="/calculator" 
            className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl p-6 shadow-lg transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-3 rounded-full mr-3">
                <FaCalculator className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-semibold">Calculator</h3>
            </div>
            <p className="text-purple-100 text-sm">Financial calculations made easy</p>
          </Link>
        </div>

        {/* Additional Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/chatbot" 
            className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-3">
                <FaRobot className="text-emerald-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">AI Chatbot</h3>
            </div>
            <p className="text-emerald-600 text-sm">Get financial advice from our AI assistant</p>
          </Link>

          <Link 
            to="/education" 
            className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-3">
                <FaGraduationCap className="text-emerald-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">Finance Education</h3>
            </div>
            <p className="text-emerald-600 text-sm">Learn with bite-sized financial videos</p>
          </Link>

          <Link 
            to="/about" 
            className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-3">
                <FaChartLine className="text-emerald-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">About SmartSpend</h3>
            </div>
            <p className="text-emerald-600 text-sm">Learn more about our features and mission</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;