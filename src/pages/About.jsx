import React from "react";
import { FaInfoCircle, FaChartLine, FaUsers, FaRoad, FaImages, FaQuoteLeft, FaArrowRight, FaCalculator, FaPiggyBank, FaMoneyBillWave } from "react-icons/fa";

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
              Your intelligent financial companion for smarter money management
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
              Welcome to <strong className="text-amber-600">SmartSpendAI</strong>, your all-in-one financial calculator designed to simplify money management.
            </p>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-medium text-emerald-800 mb-2">Key Features:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>Basic Calculator:</strong> Arithmetic, scientific, and memory functions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>Simple Interest:</strong> Calculate interest with principal, rate, and time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>Compound Interest:</strong> Compute compound interest for investments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>Loan EMI:</strong> Determine monthly loan payments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span className="text-emerald-700 text-sm"><strong>Tip Calculator:</strong> Add tips to bills effortlessly</span>
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
              We're committed to enhancing SmartSpendAI with new features:
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-xs font-bold">1</span>
                </div>
                <span className="text-emerald-700 text-sm">Integration with cloud storage for saved calculations</span>
              </div>
              <div className="flex items-start">
                <div className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-xs font-bold">2</span>
                </div>
                <span className="text-emerald-700 text-sm">Advanced financial tools (tax calculator, savings planner)</span>
              </div>
              <div className="flex items-start">
                <div className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-xs font-bold">3</span>
                </div>
                <span className="text-emerald-700 text-sm">Multi-currency support and real-time exchange rates</span>
              </div>
              <div className="flex items-start">
                <div className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-xs font-bold">4</span>
                </div>
                <span className="text-emerald-700 text-sm">Mobile app release for iOS and Android</span>
              </div>
            </div>
          </div>

          {/* Contributors Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-3">
                <FaUsers className="text-amber-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">Contributors</h3>
            </div>
            <p className="text-emerald-700 text-sm mb-3">
              SmartSpendAI is developed by a passionate team dedicated to financial empowerment.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-emerald-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-emerald-700 font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-medium text-emerald-800">Sanja</h4>
                  <p className="text-emerald-600 text-xs">Lead Developer</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-amber-700 font-bold">AI</span>
                </div>
                <div>
                  <h4 className="font-medium text-emerald-800">AI Assistant (xAI)</h4>
                  <p className="text-emerald-600 text-xs">Code Optimization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-3">
                <FaImages className="text-amber-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">Gallery</h3>
            </div>
            <p className="text-emerald-700 text-sm mb-3">
              Explore visuals of SmartSpendAI in action:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 h-20 rounded-lg flex flex-col items-center justify-center text-amber-600 border border-emerald-200">
                <FaCalculator className="mb-1" />
                <span className="text-xs text-emerald-700">Calculator</span>
              </div>
              <div className="bg-emerald-50 h-20 rounded-lg flex flex-col items-center justify-center text-amber-600 border border-emerald-200">
                <FaPiggyBank className="mb-1" />
                <span className="text-xs text-emerald-700">Savings</span>
              </div>
              <div className="bg-emerald-50 h-20 rounded-lg flex flex-col items-center justify-center text-amber-600 border border-emerald-200">
                <FaMoneyBillWave className="mb-1" />
                <span className="text-xs text-emerald-700">EMI</span>
              </div>
              <div className="bg-emerald-50 h-20 rounded-lg flex flex-col items-center justify-center text-amber-600 border border-emerald-200">
                <FaChartLine className="mb-1" />
                <span className="text-xs text-emerald-700">Charts</span>
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
                "SmartSpendAI saved me hours on loan calculations! The interface is so intuitive."
              </p>
              <p className="text-emerald-600 text-xs font-medium">- User A</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-emerald-700 text-sm italic mb-2">
                "The tip calculator is a game-changer for dining out. No more mental math!"
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
            href="/calculator"
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