import React from "react";
import { FaInfoCircle, FaChartLine, FaUsers, FaRoad, FaImages, FaQuoteLeft, FaArrowRight, FaCalculator, FaPiggyBank, FaMoneyBillWave, FaWallet, FaChartPie, FaClipboardList, FaPercentage, FaExchangeAlt, FaRobot, FaBookOpen } from "react-icons/fa";

function About() {
  const currentDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6 mb-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-emerald-100 p-4 rounded-full mb-4">
              <FaInfoCircle className="text-amber-600 text-4xl" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-800 mb-2">About SmartSpendAI</h1>
            <p className="text-emerald-600 max-w-md">
              Your intelligent financial companion for smarter money management and planning
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overview Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-3">
                <FaInfoCircle className="text-amber-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">Overview</h3>
            </div>
            <p className="text-emerald-700 text-sm mb-3">
              Welcome to <strong className="text-amber-600">SmartSpendAI</strong>, your comprehensive financial management platform designed to simplify and optimize your money decisions.
            </p>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-medium text-emerald-800 mb-2">Key Features:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>Transactions:</strong> Track income, expenses, and categorize spending effortlessly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>Dashboard:</strong> Real-time overview of your financial health with charts and insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>Budget Planner:</strong> Create, monitor, and adjust budgets to stay on track</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>Calculator:</strong> Arithmetic, scientific, simple/compound interest, loan EMI, and tip calculations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>Inflation Calculator:</strong> Adjust future values for inflation impact</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>Currency Converter:</strong> Real-time conversion across global currencies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>AI Chatbot:</strong> Get personalized financial advice and answers instantly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>Finance Education:</strong> Learn key concepts through guides, tips, and resources</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Roadmap Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-3">
                <FaRoad className="text-amber-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">Roadmap</h3>
            </div>
            <p className="text-emerald-700 text-sm mb-3">
              We're committed to enhancing SmartSpendAI with innovative features:
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-xs font-bold">1</span>
                </div>
                <span className="text-emerald-700 text-sm">Integration with bank APIs for automatic transaction syncing</span>
              </div>
              <div className="flex items-start">
                <div className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-xs font-bold">2</span>
                </div>
                <span className="text-emerald-700 text-sm">Advanced analytics with predictive spending forecasts</span>
              </div>
              <div className="flex items-start">
                <div className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-xs font-bold">3</span>
                </div>
                <span className="text-emerald-700 text-sm">Goal-based savings trackers with milestone notifications</span>
              </div>
              <div className="flex items-start">
                <div className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-xs font-bold">4</span>
                </div>
                
                <span className="text-emerald-700 text-sm">Mobile app release for iOS and Android with offline support</span>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-emerald-700 text-sm italic mb-2">
                "Tracking transactions has never been easier, and the education section is full of valuable insights."
              </p>
            </div>
              
            </div>
          </div>

        </div>

        {/* Testimonials Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6 mt-6">
          <div className="flex items-center mb-4">
            <div className="bg-emerald-100 p-3 rounded-full mr-3">
              <FaQuoteLeft className="text-amber-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-800">Testimonials</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-emerald-700 text-sm italic mb-2">
                "The budget planner and dashboard have transformed how I manage my finances. Highly recommend!"
              </p>
              <p className="text-emerald-600 text-xs font-medium">- User A</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-emerald-700 text-sm italic mb-2">
                "AI Chatbot gives spot-on advice, and the currency converter is perfect for my travels. Game-changer!"
              </p>
              <p className="text-emerald-600 text-xs font-medium">- User B</p>
            </div>
            
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6 mt-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <p className="text-emerald-700 text-sm">
              <strong>Last Updated:</strong> {currentDate} IST
            </p>
          </div>
          <a
            href="/home"
            className="mt-4 md:mt-0 inline-flex items-center py-2 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all font-medium text-sm"
          >
            Get Started <FaArrowRight className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;