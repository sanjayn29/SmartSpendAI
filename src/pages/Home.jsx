import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, doc, getDoc } from "../firebase";
import BillScanner from "../components/BillScanner";
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
  FaChartLine,
  FaBell,
  FaCalendarAlt,
  FaLightbulb,
  FaQuestionCircle,
  FaMoneyCheckAlt,
  FaChartBar,
  FaCog,
  FaSync,
  FaQrcode,
  FaCamera
} from "react-icons/fa";

function Home({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [financialTips] = useState([
    "Set aside 20% of your income for savings",
    "Review your subscriptions monthly to eliminate unused services",
    "Create a budget for variable expenses like dining out and entertainment",
    "Build an emergency fund covering 3-6 months of expenses",
    "Consider automating your savings to make it effortless",
    "Track your spending for 30 days to identify patterns",
    "Set specific financial goals with target dates",
    "Compare prices before making significant purchases"
  ]);
  const [currentTip, setCurrentTip] = useState(0);
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
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [showBillScanner, setShowBillScanner] = useState(false);

  // Fetch user data from Firebase
  const fetchData = async () => {
    if (!user || !user.email) {
      setLoading(false);
      setRefreshing(false);
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
        
        // Generate notifications based on spending patterns
        generateNotifications(validTransactions, data.totalAmount || 0);
        
        // Simulate upcoming bills (in a real app, this would come from a bills collection)
        simulateUpcomingBills(validTransactions);
      }

      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Generate notifications based on spending patterns
  const generateNotifications = (transactions, currentBalance) => {
    const newNotifications = [];
    
    // Check for low balance
    if (currentBalance < 1000) {
      newNotifications.push({
        id: 1,
        type: 'warning',
        message: 'Your balance is getting low. Consider adding funds.',
        time: 'Just now'
      });
    }
    
    // Check for high spending rate
    const lastWeekTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return transactionDate > weekAgo && t.type === 'Expense';
    });
    
    const weeklySpending = lastWeekTransactions.reduce((sum, t) => sum + t.amount, 0);
    if (weeklySpending > 5000) {
      newNotifications.push({
        id: 2,
        type: 'info',
        message: `You've spent ₹${weeklySpending.toLocaleString('en-IN')} this week.`,
        time: 'Today'
      });
    }
    
    // Check for income vs expense ratio
    const lastMonthIncome = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return transactionDate > monthAgo && t.type === 'Income';
    }).reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthExpenses = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return transactionDate > monthAgo && t.type === 'Expense';
    }).reduce((sum, t) => sum + t.amount, 0);
    
    if (lastMonthIncome > 0 && (lastMonthExpenses / lastMonthIncome) > 0.8) {
      newNotifications.push({
        id: 3,
        type: 'warning',
        message: 'Your expenses are high compared to your income.',
        time: 'Today'
      });
    }
    
    // Add a positive notification if savings rate is good
    if (lastMonthIncome > 0 && (lastMonthExpenses / lastMonthIncome) < 0.6) {
      newNotifications.push({
        id: 4,
        type: 'success',
        message: 'Great job! You\'re saving a good portion of your income.',
        time: 'Today'
      });
    }
    
    setNotifications(newNotifications);
  };

  // Simulate upcoming bills (in a real app, this would come from a bills collection)
  const simulateUpcomingBills = (transactions) => {
    // Analyze past transactions to predict upcoming bills
    const recurringExpenses = {};
    
    transactions.forEach(transaction => {
      if (transaction.type === 'Expense') {
        const date = new Date(transaction.date);
        const dayOfMonth = date.getDate();
        
        if (!recurringExpenses[dayOfMonth]) {
          recurringExpenses[dayOfMonth] = {
            count: 1,
            totalAmount: transaction.amount,
            description: transaction.description || 'Recurring expense'
          };
        } else {
          recurringExpenses[dayOfMonth].count += 1;
          recurringExpenses[dayOfMonth].totalAmount += transaction.amount;
        }
      }
    });
    
    // Find likely recurring bills (occurred at least 3 times on the same day)
    const likelyBills = [];
    const today = new Date();
    
    Object.entries(recurringExpenses).forEach(([day, data]) => {
      if (data.count >= 2) {
        const billDay = parseInt(day);
        const nextOccurrence = new Date(today.getFullYear(), today.getMonth(), billDay);
        
        // If the bill day has already passed this month, show it for next month
        if (billDay < today.getDate()) {
          nextOccurrence.setMonth(nextOccurrence.getMonth() + 1);
        }
        
        likelyBills.push({
          id: billDay,
          name: data.description,
          amount: Math.round(data.totalAmount / data.count),
          dueDate: nextOccurrence.toISOString().split('T')[0]
        });
      }
    });
    
    setUpcomingBills(likelyBills.slice(0, 3)); // Show top 3 likely bills
  };

  // Rotate quotes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);

    return () => clearInterval(quoteInterval);
  }, [quotes.length]);

  // Rotate tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % financialTips.length);
    }, 10000);

    return () => clearInterval(tipInterval);
  }, [financialTips.length]);

  // Handle manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Handle successful bill scan
  const handleBillScanSuccess = (transaction) => {
    // Update local state with new transaction
    setTransactions(prev => [transaction, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
    setTotalAmount(prev => prev - transaction.amount); // Subtract expense from total
    
    // Refresh data to ensure consistency
    fetchData();
  };

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
        {/* Header with refresh button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-emerald-800 mb-2">
              Welcome back, {user?.displayName?.split(' ')[0] || 'Financial Explorer'}!
            </h1>
            <p className="text-emerald-600 text-lg">Your financial dashboard at a glance</p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium py-2 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            <FaSync className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <FaBell className="text-amber-600" />
              <span>Notifications</span>
            </div>
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-xl border-l-4 ${
                  notification.type === 'warning' 
                    ? 'bg-amber-50 border-amber-500 text-amber-800' 
                    : notification.type === 'success'
                    ? 'bg-green-50 border-green-500 text-green-800'
                    : 'bg-blue-50 border-blue-500 text-blue-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <p>{notification.message}</p>
                  <span className="text-xs opacity-70">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Financial Quote and Tip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300 rounded-2xl p-6 text-center shadow-lg">
            <FaQuoteLeft className="text-amber-600 text-xl mb-2 mx-auto" />
            <p className="text-amber-800 text-lg italic font-medium">{quotes[currentQuote]}</p>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 border border-emerald-300 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-center mb-2">
              <FaLightbulb className="text-amber-600 text-xl mr-2" />
              <h3 className="text-lg font-semibold text-emerald-800">Financial Tip</h3>
            </div>
            <p className="text-emerald-800 text-center">{financialTips[currentTip]}</p>
          </div>
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
              {savingsRate > 20 ? "Excellent savings!" : savingsRate > 10 ? "Good job!" : "Keep working on it!"}
            </p>
          </div>
        </div>

        {/* Bill Scanner Feature */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-orange-500 rounded-full p-4 mr-4 shadow-lg">
                  <FaQrcode className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-800 mb-1">Scan Your Bills</h3>
                  <p className="text-orange-700">Use AI to extract amounts from your bills automatically</p>
                </div>
              </div>
              <button
                onClick={() => setShowBillScanner(true)}
                className="flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                <FaCamera className="text-xl" />
                <span>Scan Bill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions and Upcoming Bills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6">
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

          {/* Upcoming Bills */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-emerald-800 flex items-center">
                <FaCalendarAlt className="mr-2 text-amber-600" />
                Upcoming Bills
              </h2>
              <Link 
                to="/budget" 
                className="text-emerald-700 hover:text-amber-600 text-sm font-medium"
              >
                Manage Bills →
              </Link>
            </div>
            
            {upcomingBills.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-emerald-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt className="text-emerald-600 text-2xl" />
                </div>
                <p className="text-emerald-700 font-medium mb-2">No upcoming bills detected</p>
                <p className="text-emerald-600">We'll notify you when we detect recurring expenses</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBills.map((bill) => (
                  <div 
                    key={bill.id} 
                    className="flex justify-between items-center p-4 bg-amber-50 rounded-xl border border-amber-200"
                  >
                    <div>
                      <p className="font-medium text-amber-800">{bill.name}</p>
                      <p className="text-sm text-amber-600">
                        Due: {new Date(bill.dueDate).toLocaleDateString("en-IN", { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </p>
                    </div>
                    <div className="font-bold text-amber-700">
                      ₹{bill.amount.toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      {/* Bill Scanner Modal */}
      {showBillScanner && (
        <BillScanner
          user={user}
          onClose={() => setShowBillScanner(false)}
          onSuccess={handleBillScanSuccess}
        />
      )}
    </div>
  );
}

export default Home;