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
          
          // Group by year and calculate cumulative balance
          const yearlyData = transactions.reduce((acc, transaction) => {
            if (!transaction.date) return acc;
            
            const year = new Date(transaction.date).getFullYear().toString();
            if (!acc[year]) {
              acc[year] = { income: 0, expense: 0, balance: 0 };
            }
            
            if (transaction.type === "Income") {
              acc[year].income += transaction.amount || 0;
            } else if (transaction.type === "Expense") {
              acc[year].expense += transaction.amount || 0;
            }
            
            return acc;
          }, {});

          // Sort years and calculate cumulative balance
          const sortedYears = Object.keys(yearlyData).sort((a, b) => parseInt(a) - parseInt(b));
          let cumulativeBalance = 0;
          
          const processedData = sortedYears.map(year => {
            const yearData = yearlyData[year];
            cumulativeBalance += (yearData.income - yearData.expense);
            return {
              year,
              income: yearData.income,
              expense: yearData.expense,
              balance: cumulativeBalance
            };
          });

          setLabels(processedData.map(d => d.year));
          setBalanceData(processedData.map(d => d.balance));
          setIncomeData(processedData.map(d => d.income));
          setExpenseData(processedData.map(d => d.expense));

        } else {
          // Initialize with current year if no data exists
          const currentYear = new Date().getFullYear().toString();
          setLabels([currentYear]);
          setBalanceData([0]);
          setIncomeData([0]);
          setExpenseData([0]);
        }
      } catch (err) {
        setError("Failed to load dashboard data: " + err.message);
        console.error("Dashboard data error:", err);
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

  const renderLineGraph = () => {
    if (!balanceData.length || balanceData.every(val => val === 0)) {
      return (
        <div className="h-72 flex items-center justify-center bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="text-center text-emerald-600">
            <FaChartLine className="text-4xl mb-2 mx-auto opacity-50" />
            <p>No financial data available</p>
            <p className="text-sm">Start adding transactions to see your financial trends</p>
          </div>
        </div>
      );
    }

    const allValues = [...balanceData, ...incomeData, ...expenseData];
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues, 0);
    const range = Math.max(maxValue - minValue, 1); // Ensure range is at least 1

    const graphWidth = 400;
    const graphHeight = 240;
    const padding = 40;

    const scaleX = (index) => padding + (index * (graphWidth - 2 * padding)) / Math.max(labels.length - 1, 1);
    const scaleY = (value) => graphHeight - padding - ((value - minValue) / range) * (graphHeight - 2 * padding);

    return (
      <div className="relative h-72 bg-emerald-50 rounded-lg border border-emerald-200 p-4">
        <svg className="w-full h-full" viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
          {/* Grid Background */}
          {/* Vertical grid lines */}
          {labels.map((_, index) => (
            <line
              key={`v-grid-${index}`}
              x1={scaleX(index)}
              y1={padding}
              x2={scaleX(index)}
              y2={graphHeight - padding}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <line
              key={`h-grid-${index}`}
              x1={padding}
              y1={padding + ratio * (graphHeight - 2 * padding)}
              x2={graphWidth - padding}
              y2={padding + ratio * (graphHeight - 2 * padding)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 0.5, 1].map((ratio, index) => {
            const value = minValue + ratio * range;
            return (
              <text
                key={`y-label-${index}`}
                x={padding - 5}
                y={graphHeight - padding - ratio * (graphHeight - 2 * padding)}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#6b7280"
                fontSize="10"
              >
                {value >= 1000 ? `₹${(value/1000).toFixed(0)}k` : `₹${value}`}
              </text>
            );
          })}

          {/* X-axis labels */}
          {labels.map((label, index) => (
            <text
              key={`x-label-${index}`}
              x={scaleX(index)}
              y={graphHeight - padding + 15}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="10"
            >
              {label}
            </text>
          ))}

          {/* Data Lines */}
          {selectedMetric === "combined" && (
            <>
              {/* Balance Line */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                points={balanceData.map((value, index) => 
                  `${scaleX(index)},${scaleY(value)}`
                ).join(' ')}
              />
              {/* Income Line */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="4,2"
                points={incomeData.map((value, index) => 
                  `${scaleX(index)},${scaleY(value)}`
                ).join(' ')}
              />
              {/* Expense Line */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="4,2"
                points={expenseData.map((value, index) => 
                  `${scaleX(index)},${scaleY(value)}`
                ).join(' ')}
              />
            </>
          )}

          {selectedMetric === "income" && (
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points={incomeData.map((value, index) => 
                `${scaleX(index)},${scaleY(value)}`
              ).join(' ')}
            />
          )}

          {selectedMetric === "expense" && (
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              points={expenseData.map((value, index) => 
                `${scaleX(index)},${scaleY(value)}`
              ).join(' ')}
            />
          )}

          {/* Data Points */}
          {(selectedMetric === "combined" ? 
            [...balanceData, ...incomeData, ...expenseData] :
            selectedMetric === "income" ? incomeData : expenseData
          ).map((value, index) => {
            if (value === 0) return null;
            return (
              <circle
                key={`point-${index}`}
                cx={scaleX(index)}
                cy={scaleY(value)}
                r="4"
                fill={selectedMetric === "combined" ? 
                  (index < balanceData.length ? "#10b981" : 
                   index < balanceData.length + incomeData.length ? "#3b82f6" : "#ef4444") :
                  selectedMetric === "income" ? "#3b82f6" : "#ef4444"}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          {/* Axes */}
          <line
            x1={padding}
            y1={graphHeight - padding}
            x2={graphWidth - padding}
            y2={graphHeight - padding}
            stroke="#374151"
            strokeWidth="1"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={graphHeight - padding}
            stroke="#374151"
            strokeWidth="1"
          />
        </svg>

        {/* Legend */}
        <div className="absolute top-2 right-2 flex gap-3 text-xs bg-white/80 backdrop-blur-sm rounded-lg p-2">
          {selectedMetric === "combined" ? (
            <>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1 bg-emerald-500 rounded-full"></div>
                <span className="text-emerald-700 font-medium">Balance</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1 bg-blue-500 rounded-full border-dashed border-t"></div>
                <span className="text-blue-700 font-medium">Income</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1 bg-red-500 rounded-full border-dashed border-t"></div>
                <span className="text-red-700 font-medium">Expense</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <div className={`w-3 h-1 rounded-full ${
                selectedMetric === "income" ? "bg-blue-500" : "bg-red-500"
              }`}></div>
              <span className={`font-medium ${
                selectedMetric === "income" ? "text-blue-700" : "text-red-700"
              }`}>
                {selectedMetric === "income" ? "Income" : "Expense"}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    if (totalIncome === 0 && totalExpense === 0) {
      return (
        <div className="h-48 flex items-center justify-center bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="text-center text-emerald-600">
            <FaChartPie className="text-3xl mb-2 mx-auto opacity-50" />
            <p className="text-sm">No income/expense data available</p>
          </div>
        </div>
      );
    }

    const total = totalIncome + totalExpense;
    const incomePercentage = (totalIncome / total) * 100;
    const expensePercentage = (totalExpense / total) * 100;

    return (
      <div className="relative h-48 bg-emerald-50 rounded-lg border border-emerald-200 p-4">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Income Segment */}
          {totalIncome > 0 && (
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth="40"
              strokeDasharray={`${incomePercentage * 3.6} ${360 - incomePercentage * 3.6}`}
              strokeDashoffset="-90"
              transform="rotate(-90 100 100)"
            />
          )}
          
          {/* Expense Segment */}
          {totalExpense > 0 && (
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="transparent"
              stroke="#ef4444"
              strokeWidth="40"
              strokeDasharray={`${expensePercentage * 3.6} ${360 - expensePercentage * 3.6}`}
              strokeDashoffset={`${-90 + incomePercentage * 3.6}`}
              transform="rotate(-90 100 100)"
            />
          )}
          
          {/* Center Text */}
          <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fill="#374151" fontSize="14" fontWeight="bold">
            Total
          </text>
          <text x="100" y="120" textAnchor="middle" dominantBaseline="middle" fill="#6b7280" fontSize="12">
            ₹{total.toLocaleString("en-IN")}
          </text>
        </svg>

        <div className="absolute bottom-2 left-2 flex gap-3 text-xs bg-white/80 backdrop-blur-sm rounded-lg p-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-blue-700 font-medium">Income ({incomePercentage.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-700 font-medium">Expense ({expensePercentage.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-200 p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-emerald-800 text-lg font-medium">Loading dashboard...</p>
          <p className="text-emerald-600 text-sm mt-2">Analyzing your financial data</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-10 left-10 opacity-20 animate-float">
          <FaPiggyBank className="text-amber-400 text-6xl" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
          <FaChartLine className="text-emerald-400 text-6xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-emerald-800 mb-3 bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
              Financial Dashboard
            </h1>
            <p className="text-emerald-600 text-lg">Comprehensive overview of your financial health</p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Balance Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200/50 p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-xl mr-4">
                    <FaWallet className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">Current Balance</p>
                    <p className="text-2xl font-bold text-emerald-800">
                      ₹{currentBalance.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                {balanceChange !== 0 && (
                  <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                    balanceChange > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {balanceChange > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                    ₹{Math.abs(balanceChange).toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            </div>

            {/* Income Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200/50 p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl mr-4">
                  <FaArrowUp className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Total Income</p>
                  <p className="text-2xl font-bold text-blue-800">
                    ₹{totalIncome.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Expense Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200/50 p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl mr-4">
                  <FaArrowDown className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-800">
                    ₹{totalExpense.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200/50 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <h3 className="text-2xl font-bold text-emerald-800 mb-4 lg:mb-0 flex items-center">
                <FaChartLine className="mr-3 text-amber-600" />
                Financial Trends Analysis
              </h3>
              
              <div className="flex gap-2">
                {[
                  { key: "combined", label: "All Metrics", icon: <FaEquals className="w-4 h-4" /> },
                  { key: "income", label: "Income", icon: <FaArrowUp className="w-4 h-4" /> },
                  { key: "expense", label: "Expenses", icon: <FaArrowDown className="w-4 h-4" /> }
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMetric(key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedMetric === key
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-emerald-800 mb-4">Yearly Trends</h4>
                {renderLineGraph()}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-emerald-800 mb-4">Income vs Expenses</h4>
                {renderPieChart()}
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200/50 p-6">
            <h3 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center">
              <FaCalculator className="mr-3 text-amber-600" />
              Financial Health Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Metrics */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-emerald-800 border-b border-emerald-200 pb-2">Key Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-emerald-700 font-medium">Net Income:</span>
                    <span className={`text-lg font-bold ${(totalIncome - totalExpense) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{(totalIncome - totalExpense).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-700 font-medium">Savings Rate:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome * 100)).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-amber-700 font-medium">Expense Ratio:</span>
                    <span className="text-lg font-bold text-amber-600">
                      {totalIncome > 0 ? (totalExpense / totalIncome * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Yearly Breakdown */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-emerald-800 border-b border-emerald-200 pb-2">Yearly Overview</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {labels.map((year, index) => (
                    <div key={year} className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg">
                      <span className="text-emerald-700 font-medium">{year}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-blue-600">₹{incomeData[index]?.toLocaleString("en-IN") || 0}</span>
                        <span className="text-red-600">₹{expenseData[index]?.toLocaleString("en-IN") || 0}</span>
                        <span className={`font-bold ${balanceData[index] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{balanceData[index]?.toLocaleString("en-IN") || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Dashboard;