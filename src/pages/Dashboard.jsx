import React, { useState, useEffect, Component } from "react";
import { db, doc, getDoc } from "../firebase";
import { FaChartPie, FaWallet, FaArrowUp, FaArrowDown, FaCalculator, FaPiggyBank, FaChartLine, FaExclamationTriangle, FaEquals } from "react-icons/fa";

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md w-full text-center">
            <FaExclamationTriangle className="text-red-500 text-4xl mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Something went wrong</h2>
            <p className="text-red-600 mb-4">Error: {this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Dashboard({ user }) {
  const [balanceData, setBalanceData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("combined");

  // Fetch and aggregate data by year from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.email) {
        setError("User not authenticated or email not available");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userDocRef = doc(db, "transactions", user.email);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const transactions = data.transactions || [];
          const groupedData = transactions.reduce((acc, t) => {
            const year = new Date(t.date).getFullYear().toString();
            if (!acc[year]) acc[year] = { income: 0, expense: 0 };
            if (t.type === "Income") acc[year].income += t.amount || 0;
            if (t.type === "Expense") acc[year].expense += t.amount || 0;
            return acc;
          }, {});

          const sortedLabels = Object.keys(groupedData).sort((a, b) => a - b);
          const incomes = sortedLabels.map(year => groupedData[year].income);
          const expenses = sortedLabels.map(year => groupedData[year].expense);
          const balances = sortedLabels.map((_, i) => 
            incomes.slice(0, i + 1).reduce((a, b) => a + b, 0) - expenses.slice(0, i + 1).reduce((a, b) => a + b, 0)
          );

          setLabels(sortedLabels);
          setBalanceData(balances);
          setIncomeData(incomes);
          setExpenseData(expenses);
        } else {
          setLabels([]);
          setBalanceData([]);
          setIncomeData([]);
          setExpenseData([]);
        }
      } catch (err) {
        setError("Failed to load dashboard data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const totalIncome = incomeData.reduce((a, b) => a + b, 0);
  const totalExpense = expenseData.reduce((a, b) => a + b, 0);
  const currentBalance = balanceData[balanceData.length - 1] || 0;
  const previousBalance = balanceData[balanceData.length - 2] || 0;
  const balanceChange = currentBalance - previousBalance;

  const renderChart = () => {
    if (!balanceData.length) return null;

    const maxValue = Math.max(...balanceData, ...incomeData, ...expenseData);
    const minValue = Math.min(...balanceData, 0);
    const range = maxValue - minValue || 1;

    return (
      <div className="space-y-6">
        {/* Line Graph */}
        <div className="relative h-72 bg-emerald-50 rounded-lg border border-emerald-200 p-4">
          <svg className="w-full h-full" viewBox="0 0 400 240">
            {/* Vertical lines (right to left) */}
            {Array.from({ length: labels.length + 1 }, (_, i) => (
              <line
                key={`vertical-${i}`}
                x1={(i * 400) / labels.length}
                y1="0"
                x2={(i * 400) / labels.length}
                y2="240"
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
            {/* Horizontal lines (top to bottom) */}
            {Array.from({ length: 9 }, (_, i) => (
              <line
                key={`horizontal-${i}`}
                x1="0"
                y1={i * 30}
                x2="400"
                y2={i * 30}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Data lines */}
            {selectedMetric === "combined" && (
              <>
                {/* Balance line */}
                <polyline
                  points={balanceData.map((value, index) => 
                    `${(index * 400) / (balanceData.length - 1)},${240 - ((value - minValue) / range) * 240}`
                  ).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  className="drop-shadow-sm"
                />
                {/* Income line */}
                <polyline
                  points={incomeData.map((value, index) => 
                    `${(index * 400) / (incomeData.length - 1)},${240 - ((value - minValue) / range) * 240}`
                  ).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                {/* Expense line */}
                <polyline
                  points={expenseData.map((value, index) => 
                    `${(index * 400) / (expenseData.length - 1)},${240 - ((value - minValue) / range) * 240}`
                  ).join(' ')}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </>
            )}
            
            {selectedMetric === "income" && (
              <polyline
                points={incomeData.map((value, index) => 
                  `${(index * 400) / (incomeData.length - 1)},${240 - ((value - minValue) / range) * 240}`
                ).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                className="drop-shadow-sm"
              />
            )}
            
            {selectedMetric === "expense" && (
              <polyline
                points={expenseData.map((value, index) => 
                  `${(index * 400) / (expenseData.length - 1)},${240 - ((value - minValue) / range) * 240}`
                ).join(' ')}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                className="drop-shadow-sm"
              />
            )}
            
            {/* Data points */}
            {(selectedMetric === "combined" ? balanceData : 
              selectedMetric === "income" ? incomeData : expenseData).map((value, index) => (
              <circle
                key={index}
                cx={(index * 400) / (balanceData.length - 1)}
                cy={240 - ((value - minValue) / range) * 240}
                r="4"
                fill={selectedMetric === "combined" ? "#10b981" : 
                      selectedMetric === "income" ? "#3b82f6" : "#ef4444"}
                className="drop-shadow-sm"
              />
            ))}
            
            {/* X-axis labels (years) */}
            {labels.map((label, index) => (
              <text
                key={index}
                x={(index * 400) / (labels.length - 1)}
                y="230"
                textAnchor="middle"
                fill="#6b7280"
                fontSize="10"
              >
                {label}
              </text>
            ))}
          </svg>
          
          {/* Legend */}
          <div className="absolute bottom-2 left-2 flex gap-4 text-xs">
            {selectedMetric === "combined" && (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-emerald-500"></div>
                  <span className="text-emerald-700">Balance</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-blue-500 border-dashed border-t"></div>
                  <span className="text-blue-700">Income</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-red-500 border-dashed border-t"></div>
                  <span className="text-red-700">Expense</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        {totalIncome > 0 || totalExpense > 0 ? (
          <div className="relative h-48 bg-emerald-50 rounded-lg border border-emerald-200 p-4">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              {totalIncome > 0 && (
                <path
                  d={`
                    M 100 100
                    L ${100 + 80 * Math.cos(-0.5 * Math.PI)} ${100 + 80 * Math.sin(-0.5 * Math.PI)}
                    A 80 80 0 ${totalIncome + totalExpense > 0 ? (totalIncome / (totalIncome + totalExpense) > 0.5 ? 1 : 0) : 0} 1
                    ${100 + 80 * Math.cos(-0.5 * Math.PI + 2 * Math.PI * (totalIncome / (totalIncome + totalExpense)))}
                    ${100 + 80 * Math.sin(-0.5 * Math.PI + 2 * Math.PI * (totalIncome / (totalIncome + totalExpense)))}
                    Z
                  `}
                  fill="#3b82f6"
                />
              )}
              {totalExpense > 0 && (
                <path
                  d={`
                    M 100 100
                    L ${100 + 80 * Math.cos(-0.5 * Math.PI + 2 * Math.PI * (totalIncome / (totalIncome + totalExpense)))}
                    ${100 + 80 * Math.sin(-0.5 * Math.PI + 2 * Math.PI * (totalIncome / (totalIncome + totalExpense)))}
                    A 80 80 0 ${totalExpense / (totalIncome + totalExpense) > 0.5 ? 1 : 0} 1
                    ${100 + 80 * Math.cos(-0.5 * Math.PI + 2 * Math.PI)}
                    ${100 + 80 * Math.sin(-0.5 * Math.PI + 2 * Math.PI)}
                    Z
                  `}
                  fill="#ef4444"
                />
              )}
              <text x="100" y="110" textAnchor="middle" fill="#6b7280" fontSize="12" fontWeight="bold">
                Total: ₹{(totalIncome + totalExpense).toLocaleString("en-IN")}
              </text>
            </svg>
            <div className="absolute bottom-2 left-2 flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-blue-500"></div>
                <span className="text-blue-700">Income</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-red-500"></div>
                <span className="text-red-700">Expense</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-emerald-600">No data available for pie chart</div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-200 p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 mx-auto"></div>
          <p className="text-emerald-800 mt-4 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <FaPiggyBank className="text-amber-400 text-6xl" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <FaChartLine className="text-amber-400 text-6xl" />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-emerald-800 flex items-center justify-center mb-2">
              <FaChartPie className="mr-2 text-amber-600" />
              Financial Dashboard
            </h1>
            <p className="text-emerald-600 text-sm">Your financial overview at a glance</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Balance Card */}
            <div className="bg-white rounded-xl shadow-lg border border-emerald-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                    <FaWallet className="text-emerald-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">Current Balance</p>
                  </div>
                </div>
                {balanceChange !== 0 && (
                  <div className={`flex items-center text-xs ${balanceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {balanceChange > 0 ? <FaArrowUp className="w-3 h-3 mr-1" /> : <FaArrowDown className="w-3 h-3 mr-1" />}
                    ₹{Math.abs(balanceChange).toLocaleString("en-IN")}
                  </div>
                )}
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg font-mono text-xl font-bold text-emerald-800">
                ₹{currentBalance.toLocaleString("en-IN")}
              </div>
            </div>

            {/* Income Card */}
            <div className="bg-white rounded-xl shadow-lg border border-emerald-200 p-6">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FaArrowUp className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Total Income</p>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg font-mono text-xl font-bold text-blue-800">
                ₹{totalIncome.toLocaleString("en-IN")}
              </div>
            </div>

            {/* Expense Card */}
            <div className="bg-white rounded-xl shadow-lg border border-emerald-200 p-6">
              <div className="flex items-center mb-2">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <FaArrowDown className="text-red-600 w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Total Expenses</p>
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded-lg font-mono text-xl font-bold text-red-800">
                ₹{totalExpense.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-emerald-800 flex items-center">
                <FaCalculator className="mr-2 text-amber-600" />
                Financial Trends (Yearly)
              </h3>
              
              {/* Chart Toggle Buttons */}
              <div className="flex gap-2">
                {[
                  { key: "combined", label: "All", icon: <FaEquals className="w-3 h-3" /> },
                  { key: "income", label: "Income", icon: <FaArrowUp className="w-3 h-3" /> },
                  { key: "expense", label: "Expenses", icon: <FaArrowDown className="w-3 h-3" /> }
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMetric(key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                      selectedMetric === key
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            {renderChart()}
          </div>

          {/* Calculation Summary */}
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-200 p-6">
            <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center">
              <FaCalculator className="mr-2 text-amber-600" />
              Financial Calculations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Income vs Expense */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-2">Income vs Expenses</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Total Income:</span>
                    <span className="font-mono font-bold text-blue-600">₹{totalIncome.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Total Expenses:</span>
                    <span className="font-mono font-bold text-red-600">₹{totalExpense.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="border-t border-emerald-300 pt-2">
                    <div className="flex justify-between">
                      <span className="text-emerald-700 font-medium">Net Income:</span>
                      <span className={`font-mono font-bold ${(totalIncome - totalExpense) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{(totalIncome - totalExpense).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Rate */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-2">Savings Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Savings Amount:</span>
                    <span className="font-mono font-bold text-emerald-600">₹{Math.max(0, totalIncome - totalExpense).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Savings Rate:</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome * 100)).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Expense Ratio:</span>
                    <span className="font-mono font-bold text-amber-600">
                      {totalIncome > 0 ? (totalExpense / totalIncome * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated circles in background */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-amber-200 opacity-30 animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-emerald-200 opacity-30 animate-pulse delay-1000"></div>
      </div>
    </ErrorBoundary>
  );
}

export default Dashboard;