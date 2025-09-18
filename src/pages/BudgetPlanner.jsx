import React, { useState, useEffect } from "react";
import { FaCalculator, FaChartPie, FaDownload, FaPiggyBank, FaChartLine, FaPercent, FaDollarSign, FaUniversity, FaCreditCard, FaUtensils, FaMemory, FaBackspace } from "react-icons/fa";

function BudgetPlanner({ user }) {
  const [step, setStep] = useState("plan"); // "plan" or "amount"
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [totalBudget, setTotalBudget] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const plans = [
    { id: 1, ratio: [3, 4, 3], names: ["Needs", "Essentials", "Savings"], color: "emerald" },
    { id: 2, ratio: [2, 3, 5], names: ["Needs", "Essentials", "Savings"], color: "amber" },
    { id: 3, ratio: [6, 2, 2], names: ["Needs", "Essentials", "Savings"], color: "emerald" },
  ];

  // Button animation handler
  const handleButtonAnimation = (buttonId) => {
    setActiveButton(buttonId);
    setTimeout(() => setActiveButton(null), 150);
  };

  // Handle number input for budget
  const handleNumber = (value) => {
    if (step !== "amount") return;
    setTotalBudget(prev => prev === "" || prev === "0" ? value : prev + value);
  };

  // Handle clear
  const handleClear = () => {
    setTotalBudget("");
    setError(null);
  };

  // Handle backspace
  const handleBackspace = () => {
    setTotalBudget(prev => prev.length > 1 ? prev.slice(0, -1) : "");
  };

  const handlePlanSelect = (plan) => {
    const totalRatio = plan.ratio.reduce((a, b) => a + b, 0);
    const colorMap = {
      emerald: ["emerald-500", "green-500", "teal-500"],
      amber: ["amber-500", "yellow-500", "orange-500"],
      purple: ["purple-500", "indigo-500", "pink-500"]
    };
    
    setCategories(
      plan.ratio.map((perc, index) => ({
        id: index + 1,
        name: plan.names[index] || `Category ${index + 1}`,
        percentage: (perc / totalRatio) * 100,
        color: colorMap[plan.color][index] || "gray-500",
      }))
    );
    setSelectedPlan(plan);
    setStep("amount");
    setTotalBudget("");
  };

  const calculateAmounts = () => {
    const budget = parseFloat(totalBudget) || 0;
    return categories.map(cat => ({
      ...cat,
      amount: Math.round((budget * cat.percentage) / 100)
    }));
  };

  const saveBudget = async () => {
    const budget = parseFloat(totalBudget) || 0;
    if (!budget) {
      setError("Please enter a valid budget amount");
      return;
    }

    setLoading(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError(null);
      alert("Budget saved successfully!");
    } catch (err) {
      setError("Failed to save budget: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadText = () => {
    const amounts = calculateAmounts();
    const budget = parseFloat(totalBudget) || 0;
    const text = `Budget Plan - ${new Date().toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })}
Total Budget: ₹${budget.toLocaleString("en-IN")}

Categories:
${amounts.map(cat => `${cat.name}: ${cat.percentage.toFixed(1)}% - ₹${cat.amount.toLocaleString("en-IN")}`).join("\n")}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-plan-${selectedPlan.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderNumberPad = () => (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <button
          key={num}
          onClick={() => {
            handleNumber(num.toString());
            handleButtonAnimation(`num-${num}`);
          }}
          className={`p-3 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 text-emerald-800 font-bold text-lg transition-all transform active:scale-95 ${
            activeButton === `num-${num}` ? 'scale-95 bg-emerald-100' : ''
          }`}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => {
          handleClear();
          handleButtonAnimation('clear');
        }}
        className={`p-3 bg-red-100 rounded-lg hover:bg-red-200 text-red-700 font-medium text-sm transition-all transform active:scale-95 ${
          activeButton === 'clear' ? 'scale-95 bg-red-200' : ''
        }`}
      >
        Clear
      </button>
      <button
        onClick={() => {
          handleNumber("0");
          handleButtonAnimation('num-0');
        }}
        className={`p-3 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 text-emerald-800 font-bold text-lg transition-all transform active:scale-95 ${
          activeButton === 'num-0' ? 'scale-95 bg-emerald-100' : ''
        }`}
      >
        0
      </button>
      <button
        onClick={() => {
          handleBackspace();
          handleButtonAnimation('backspace');
        }}
        className={`p-3 bg-emerald-100 rounded-lg hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-all transform active:scale-95 ${
          activeButton === 'backspace' ? 'scale-95 bg-emerald-200' : ''
        }`}
      >
        <FaBackspace className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <FaPiggyBank className="text-amber-400 text-6xl" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <FaChartLine className="text-amber-400 text-6xl" />
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl border border-emerald-200 p-6 max-w-4xl w-full relative overflow-hidden">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-800 flex items-center justify-center">
            <FaChartPie className="mr-2 text-amber-600" />
            Budget Planner
          </h1>
          <p className="text-emerald-600 text-sm">Smart financial planning with calculator precision</p>
        </div>

        {step === "plan" && (
          <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200 shadow-sm">
            <h3 className="text-xl font-semibold text-emerald-800 mb-4 text-center">Select Your Budget Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan)}
                  className={`bg-gradient-to-r from-${plan.color}-500 to-${plan.color}-600 hover:from-${plan.color}-600 hover:to-${plan.color}-700 text-white p-6 rounded-xl transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{plan.ratio.join(":")}</div>
                    <div className="text-sm opacity-90">{plan.names.join(" • ")}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "amount" && selectedPlan && (
          <>
            {/* Display */}
            <div className="bg-emerald-100 p-4 rounded-xl mb-4 text-right font-mono text-2xl font-semibold text-emerald-800 border border-emerald-200 shadow-inner">
              ₹{totalBudget || "0"}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Input */}
              <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200 shadow-sm">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                  <FaDollarSign className="mr-2 text-amber-600" />
                  Enter Total Budget
                </h3>
                {renderNumberPad()}
                
                {parseFloat(totalBudget) > 0 && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => {
                        saveBudget();
                        handleButtonAnimation('save');
                      }}
                      disabled={loading}
                      className={`w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      } ${activeButton === 'save' ? 'scale-95' : ''}`}
                    >
                      {loading ? 'Saving...' : 'Save Budget'}
                    </button>
                    <button
                      onClick={() => {
                        downloadText();
                        handleButtonAnimation('download');
                      }}
                      className={`w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center ${
                        activeButton === 'download' ? 'scale-95' : ''
                      }`}
                    >
                      <FaDownload className="mr-2 w-4 h-4" />
                      Download Report
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column - Results */}
              {parseFloat(totalBudget) > 0 && (
                <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                    <FaChartPie className="mr-2 text-amber-600" />
                    Budget Breakdown
                  </h3>
                  
                  {/* Pie Chart Visualization */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full border-4 border-emerald-200 overflow-hidden shadow-lg">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {(() => {
                            let currentAngle = 0;
                            return calculateAmounts().map((cat, index) => {
                              const angle = (cat.percentage / 100) * 360;
                              const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
                              const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
                              const x2 = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
                              const y2 = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
                              const largeArcFlag = angle > 180 ? 1 : 0;
                              const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                              currentAngle += angle;
                              
                              return (
                                <path
                                  key={index}
                                  d={pathData}
                                  fill={`rgb(${cat.color === 'emerald-500' ? '16 185 129' : 
                                              cat.color === 'green-500' ? '34 197 94' :
                                              cat.color === 'teal-500' ? '20 184 166' :
                                              cat.color === 'amber-500' ? '245 158 11' :
                                              cat.color === 'yellow-500' ? '234 179 8' :
                                              cat.color === 'orange-500' ? '249 115 22' :
                                              cat.color === 'purple-500' ? '168 85 247' :
                                              cat.color === 'indigo-500' ? '99 102 241' :
                                              cat.color === 'pink-500' ? '236 72 153' : '107 114 128'})`}
                                  className="hover:opacity-80 transition-opacity"
                                />
                              );
                            });
                          })()}
                        </svg>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center bg-white rounded-full p-2 shadow-md">
                          <div className="text-sm font-bold text-emerald-800">Total</div>
                          <div className="text-xs text-emerald-600">₹{parseFloat(totalBudget).toLocaleString("en-IN")}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category List */}
                  <div className="space-y-3">
                    {calculateAmounts().map((cat) => (
                      <div key={cat.id} className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-3`} style={{
                              backgroundColor: `rgb(${cat.color === 'emerald-500' ? '16 185 129' : 
                                                    cat.color === 'green-500' ? '34 197 94' :
                                                    cat.color === 'teal-500' ? '20 184 166' :
                                                    cat.color === 'amber-500' ? '245 158 11' :
                                                    cat.color === 'yellow-500' ? '234 179 8' :
                                                    cat.color === 'orange-500' ? '249 115 22' :
                                                    cat.color === 'purple-500' ? '168 85 247' :
                                                    cat.color === 'indigo-500' ? '99 102 241' :
                                                    cat.color === 'pink-500' ? '236 72 153' : '107 114 128'})`
                            }} />
                            <span className="font-medium text-emerald-800">{cat.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-emerald-800">₹{cat.amount.toLocaleString("en-IN")}</div>
                            <div className="text-sm text-emerald-600">{cat.percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Back button */}
        {step === "amount" && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setStep("plan");
                setTotalBudget("");
                setSelectedPlan(null);
                setCategories([]);
              }}
              className="py-2 px-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              ← Back to Plans
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>

      {/* Animated circles in background */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-amber-200 opacity-30 animate-pulse"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-emerald-200 opacity-30 animate-pulse delay-1000"></div>
    </div>
  );
}

export default BudgetPlanner;