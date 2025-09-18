import React, { useState, useEffect } from "react";
import { db, doc, setDoc, getDoc, updateDoc, arrayUnion } from "../firebase";
import { 
  FaPlus, 
  FaMinus, 
  FaWallet, 
  FaArrowUp, 
  FaArrowDown, 
  FaHistory, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaChartLine
} from "react-icons/fa";

function Transaction({ user }) {
  const [totalAmount, setTotalAmount] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeHover, setActiveHover] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.email) {
        setError("User not authenticated or email not available");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "transactions", user.email);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTotalAmount(data.totalAmount || 0);
          const validTransactions = (data.transactions || []).filter(t => t.date);
          setTransactions(validTransactions);
        } else {
          await setDoc(userDocRef, { totalAmount: 0, transactions: [] });
          setTotalAmount(0);
          setTransactions([]);
        }
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAddIncome = async () => {
    if (!user || !user.email) {
      setError("User not authenticated. Please sign in again.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    try {
      setError(null);
      const userDocRef = doc(db, "transactions", user.email);
      const newTotal = totalAmount + Number(amount);
      const clientTimestamp = new Date().toISOString();
      
      const transaction = {
        type: "Income",
        amount: Number(amount),
        date: clientTimestamp,
        createdAt: clientTimestamp,
      };

      await updateDoc(userDocRef, {
        totalAmount: newTotal,
        transactions: arrayUnion(transaction)
      });

      setTotalAmount(newTotal);
      setTransactions((prev) => [...prev, transaction].sort((a, b) => new Date(b.date) - new Date(a.date)));
      setAmount("");
    } catch (err) {
      console.error("Add income error:", err);
      setError("Failed to add income: " + err.message);
    }
  };

  const handleSubtractExpense = async () => {
    if (!user || !user.email) {
      setError("User not authenticated. Please sign in again.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0 || Number(amount) > totalAmount) {
      setError("Please enter a valid amount less than or equal to current total");
      return;
    }

    try {
      setError(null);
      const userDocRef = doc(db, "transactions", user.email);
      const newTotal = totalAmount - Number(amount);
      const clientTimestamp = new Date().toISOString();
      
      const transaction = {
        type: "Expense",
        amount: Number(amount),
        date: clientTimestamp,
        createdAt: clientTimestamp,
      };

      await updateDoc(userDocRef, {
        totalAmount: newTotal,
        transactions: arrayUnion(transaction)
      });

      setTotalAmount(newTotal);
      setTransactions((prev) => [...prev, transaction].sort((a, b) => new Date(b.date) - new Date(a.date)));
      setAmount("");
    } catch (err) {
      console.error("Subtract expense error:", err);
      setError("Failed to subtract expense: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-amber-500"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-amber-400 animate-pulse"></div>
        </div>
        <p className="text-emerald-800 mt-6 text-lg font-medium">Loading transactions...</p>
        <p className="text-amber-700 text-sm">Getting your financial data ready</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 border-b border-emerald-300 p-6 mb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-amber-500 rounded-full p-3 mr-4 shadow-lg">
              <FaWallet className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-800">
              Transaction Manager
            </h1>
          </div>
          <p className="text-emerald-700 text-lg font-medium">
            Track your income and expenses with ease
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mx-auto mt-4"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-8 rounded-2xl border border-emerald-300 mb-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-700/10 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="relative text-center">
            <div className="flex items-center justify-center mb-4">
              <FaChartLine className="text-amber-600 text-xl mr-3" />
              <h2 className="text-xl font-semibold text-emerald-800">Current Balance</h2>
            </div>
            <p className="text-5xl font-bold text-emerald-900 mb-2">
              ₹{totalAmount.toLocaleString("en-IN")}
            </p>
            <div className="text-amber-700 font-medium">
              {totalAmount > 0 ? "You're managing well!" : "Start adding income to begin"}
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-emerald-100 p-6 rounded-2xl border border-emerald-200 mb-6 shadow-md">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-700 font-semibold text-lg">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-10 pr-4 py-4 bg-white border-2 border-emerald-200 rounded-xl text-emerald-800 placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-medium transition-all duration-300"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={handleAddIncome}
                disabled={!amount || isNaN(amount) || Number(amount) <= 0}
                onMouseEnter={() => setActiveHover('income')}
                onMouseLeave={() => setActiveHover(null)}
                className="relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-300 disabled:to-emerald-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent opacity-0 transition-opacity duration-500 ${
                  activeHover === 'income' ? 'opacity-100' : ''
                }`} />
                <FaArrowUp className="text-amber-300" />
                <span>Add Income</span>
              </button>
              
              <button
                onClick={handleSubtractExpense}
                disabled={!amount || isNaN(amount) || Number(amount) <= 0 || Number(amount) > totalAmount}
                onMouseEnter={() => setActiveHover('expense')}
                onMouseLeave={() => setActiveHover(null)}
                className="relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent opacity-0 transition-opacity duration-500 ${
                  activeHover === 'expense' ? 'opacity-100' : ''
                }`} />
                <FaArrowDown className="text-amber-200" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 p-4 rounded-xl mb-6 shadow-md">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-red-500 text-lg" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-6 rounded-xl border border-emerald-300 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-700/10 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-emerald-700 text-sm font-semibold mb-1">Total Income</p>
                <p className="text-emerald-900 font-bold text-2xl">
                  ₹{transactions.filter(t => t.type === "Income").reduce((sum, t) => sum + t.amount, 0).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-amber-500 rounded-full p-3 shadow-md">
                <FaPlus className="text-white text-lg" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-700/10 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-red-700 text-sm font-semibold mb-1">Total Expenses</p>
                <p className="text-red-900 font-bold text-2xl">
                  ₹{transactions.filter(t => t.type === "Expense").reduce((sum, t) => sum + t.amount, 0).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-red-500 rounded-full p-3 shadow-md">
                <FaMinus className="text-white text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-emerald-100 p-6 rounded-2xl border border-emerald-200 shadow-md mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 rounded-full p-3 shadow-md">
                <FaHistory className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-800">Recent Transactions</h3>
                <p className="text-emerald-600 text-sm">Your latest financial activity</p>
              </div>
            </div>
            <div className="bg-emerald-700 text-amber-300 px-4 py-2 rounded-full">
              <span className="font-bold">{transactions.length}</span>
            </div>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-emerald-200 rounded-full p-8 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-emerald-600 text-2xl" />
              </div>
              <p className="text-emerald-700 text-lg font-semibold mb-2">No transactions yet</p>
              <p className="text-emerald-600">Add your first income or expense to get started!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transactions.slice(0, 10).map((transaction, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-4 bg-white rounded-xl border border-emerald-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full shadow-md ${
                      transaction.type === "Income" 
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600" 
                        : "bg-gradient-to-br from-red-500 to-red-600"
                    }`}>
                      {transaction.type === "Income" ? (
                        <FaArrowUp className="text-white text-sm" />
                      ) : (
                        <FaArrowDown className="text-white text-sm" />
                      )}
                    </div>
                    <div>
                      <span className={`font-bold text-lg ${
                        transaction.type === "Income" ? "text-emerald-700" : "text-red-700"
                      }`}>
                        {transaction.type}
                      </span>
                      <p className="text-emerald-600 font-semibold">₹{transaction.amount.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <p className="text-emerald-800 font-semibold">
                        {new Date(transaction.date).toLocaleDateString("en-IN", { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                      <p className="text-amber-700 text-sm flex items-center gap-1">
                        <FaClock className="text-xs" />
                        {new Date(transaction.date).toLocaleTimeString("en-IN", { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {transactions.length > 10 && (
                <p className="text-center text-emerald-600 mt-4 font-medium">Showing 10 most recent transactions</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transaction;