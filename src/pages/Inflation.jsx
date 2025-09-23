import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { FaCoins, FaChartLine, FaPiggyBank, FaMoneyBillWave, FaCalculator, FaExclamationTriangle } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Inflation = () => {
  const [currentExpenses, setCurrentExpenses] = useState(10000);
  const [inflationRate, setInflationRate] = useState(7);
  const [timePeriod, setTimePeriod] = useState(30);
  const [futureCost, setFutureCost] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const calculateFutureCost = () => {
    const futureValue = currentExpenses * Math.pow(1 + inflationRate / 100, timePeriod);
    setFutureCost(futureValue);
    generateChartData(futureValue);
  };

  const generateChartData = (finalFutureCost) => {
    const years = Array.from({ length: timePeriod + 1 }, (_, i) => i);
    const currentValues = years.map(year => currentExpenses);
    const futureValues = years.map(year => 
      currentExpenses * Math.pow(1 + inflationRate / 100, year)
    );

    const data = {
      labels: years.map(year => `Year ${year}`),
      datasets: [
        {
          label: 'Current Value (No Inflation)',
          data: currentValues,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 4,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 10,
        },
        {
          label: 'Future Value (With Inflation)',
          data: futureValues,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 4,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 10,
        }
      ]
    };

    setChartData(data);
  };

  useEffect(() => {
    calculateFutureCost();
  }, [currentExpenses, inflationRate, timePeriod]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#1f2937',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Inter', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Inflation Impact Over Time',
        color: '#1f2937',
        font: {
          size: 20,
          weight: 'bold',
          family: "'Inter', sans-serif"
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#10b981',
        bodyColor: '#ffffff',
        borderColor: '#f59e0b',
        borderWidth: 2,
        cornerRadius: 12,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString('en-IN', {
              maximumFractionDigits: 2
            })}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#4b5563',
          maxTicksLimit: 10,
          font: {
            family: "'Inter', sans-serif"
          }
        },
        title: {
          display: true,
          text: 'Years',
          color: '#4b5563',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#4b5563',
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          },
          font: {
            family: "'Inter', sans-serif"
          }
        },
        title: {
          display: true,
          text: 'Amount (₹)',
          color: '#4b5563',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <FaCoins className="text-amber-400 text-4xl" />
      </div>
      <div className="absolute top-40 right-20 opacity-30 animate-bounce" style={{ animationDelay: '1s' }}>
        <FaChartLine className="text-emerald-500 text-3xl" />
      </div>
      <div className="absolute bottom-40 left-20 opacity-20 animate-bounce" style={{ animationDelay: '1.5s' }}>
        <FaPiggyBank className="text-amber-400 text-5xl" />
      </div>
      <div className="absolute top-60 left-1/4 opacity-15 animate-pulse">
        <FaMoneyBillWave className="text-emerald-500 text-6xl" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-15 animate-pulse" style={{ animationDelay: '2s' }}>
        <FaCalculator className="text-emerald-500 text-6xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-emerald-800 mb-4 bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
            Inflation Calculator
          </h1>
          <p className="text-xl text-emerald-600 max-w-2xl mx-auto leading-relaxed">
            Calculate the impact of inflation on your money and visualize how your purchasing power changes over time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Calculator Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-200/50 p-6 md:p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-2xl mr-4">
                <FaCalculator className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-800">Calculate Future Costs</h2>
            </div>
            
            <div className="space-y-6">
{/* Current Expenses Input */}
<div className="group">
  <label className="block text-lg font-semibold text-emerald-700 mb-3 flex items-center">
    <FaMoneyBillWave className="mr-2 text-amber-600" />
    Value of Current Expenses (₹)
  </label>
  <div className="relative">
    <input
      type="number"
      value={currentExpenses}
      onChange={(e) => setCurrentExpenses(parseFloat(e.target.value) || 0)}
      className="w-full p-4 text-lg border-2 border-emerald-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/50 text-emerald-700 font-semibold"
      min="0"
      step="100"
    />
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
      <span className="text-emerald-600 font-bold text-lg bg-emerald-100 px-3 py-1 rounded-lg">
        ₹{currentExpenses.toLocaleString('en-IN')}
      </span>
    </div>
  </div>
</div>

{/* Inflation Rate Input */}
<div className="group">
  <label className="block text-lg font-semibold text-emerald-700 mb-3 flex items-center">
    <FaChartLine className="mr-2 text-amber-600" />
    Annual Inflation Rate (%)
  </label>
  <div className="relative">
    <input
      type="number"
      value={inflationRate}
      onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
      className="w-full p-4 text-lg border-2 border-emerald-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/50 text-emerald-700 font-semibold mb-3"
      min="0"
      max="50"
      step="0.1"
    />
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
      <span className="text-emerald-600 font-bold text-lg bg-emerald-100 px-3 py-1 rounded-lg">
        {inflationRate}%
      </span>
    </div>
  </div>
  <div className="mt-2">
    <input
      type="range"
      value={inflationRate}
      onChange={(e) => setInflationRate(parseFloat(e.target.value))}
      className="w-full h-3 bg-emerald-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600"
      min="0"
      max="20"
      step="0.1"
    />
    <div className="flex justify-between text-sm font-medium text-emerald-600 mt-2">
      <span>0%</span>
      <span>10%</span>
      <span>20%</span>
    </div>
  </div>
</div>

{/* Time Period Input */}
<div className="group">
  <label className="block text-lg font-semibold text-emerald-700 mb-3 flex items-center">
    <FaPiggyBank className="mr-2 text-amber-600" />
    Time Period (Years)
  </label>
  <div className="relative">
    <input
      type="number"
      value={timePeriod}
      onChange={(e) => setTimePeriod(parseInt(e.target.value) || 0)}
      className="w-full p-4 text-lg border-2 border-emerald-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/50 text-emerald-700 font-semibold mb-3"
      min="1"
      max="50"
    />
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
      <span className="text-emerald-600 font-bold text-lg bg-emerald-100 px-3 py-1 rounded-lg">
        {timePeriod} Years
      </span>
    </div>
  </div>
  <div className="mt-2">
    <input
      type="range"
      value={timePeriod}
      onChange={(e) => setTimePeriod(parseInt(e.target.value))}
      className="w-full h-3 bg-emerald-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600"
      min="1"
      max="50"
    />
    <div className="flex justify-between text-sm font-medium text-emerald-600 mt-2">
      <span>1 Year</span>
      <span>25 Years</span>
      <span>50 Years</span>
    </div>
  </div>
</div>

              {/* Result Display */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 border-2 border-emerald-400 shadow-lg transform hover:scale-105 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-3">Future Cost Estimate</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  ₹{futureCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
                <p className="text-emerald-100 text-lg">
                  You'll need this amount after {timePeriod} years to maintain your current lifestyle
                </p>
              </div>
            </div>
          </div>

          {/* Graph Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-200/50 p-6 md:p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 rounded-2xl mr-4">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-800">Inflation Impact Visualization</h2>
            </div>
            
            <div className="h-96 mb-6 bg-white/50 rounded-2xl p-4 border border-emerald-200">
              <Line data={chartData} options={chartOptions} />
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-6 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-2xl border-2 border-emerald-300 shadow-lg">
                <div className="text-3xl font-bold text-emerald-700 mb-2">
                  ₹{currentExpenses.toLocaleString('en-IN')}
                </div>
                <div className="text-lg font-semibold text-emerald-600">Current Value</div>
                <div className="text-sm text-emerald-500 mt-1">Today's purchasing power</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl border-2 border-amber-300 shadow-lg">
                <div className="text-3xl font-bold text-amber-700 mb-2">
                  ₹{futureCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
                <div className="text-lg font-semibold text-amber-600">Future Value</div>
                <div className="text-sm text-amber-500 mt-1">After {timePeriod} years</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-blue-700 mb-2">
              {(futureCost / currentExpenses).toFixed(1)}x
            </div>
            <div className="text-lg font-semibold text-blue-800">Increase Factor</div>
            <p className="text-blue-600 text-sm mt-2">Your money needs to grow this much</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-purple-700 mb-2">
              {((futureCost - currentExpenses) / timePeriod).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-lg font-semibold text-purple-800">Yearly Increase</div>
            <p className="text-purple-600 text-sm mt-2">Average annual amount increase</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-300 rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-red-700 mb-2">
              {inflationRate}%
            </div>
            <div className="text-lg font-semibold text-red-800">Inflation Rate</div>
            <p className="text-red-600 text-sm mt-2">Annual price increase assumption</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="bg-amber-500 p-2 rounded-full mr-3">
              <FaExclamationTriangle className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-bold text-amber-800">Important Disclaimer</h3>
          </div>
          <p className="text-amber-700 text-lg leading-relaxed">
            Please note that this calculator is for illustration purposes only and does not represent actual returns.
            The stock market does not have a fixed rate of return and it is not possible to predict the rate of return
            with certainty. Inflation rates may vary and this calculation assumes a constant inflation rate over the entire period.
            Always consult with a financial advisor for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inflation;