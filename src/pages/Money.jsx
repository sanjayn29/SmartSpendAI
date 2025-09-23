import React, { useState, useEffect } from "react";
import { 
  FaExchangeAlt, 
  FaRupeeSign, 
  FaDollarSign, 
  FaEuroSign, 
  FaPoundSign, 
  FaYenSign, 
  FaCoins,
  FaSync,
  FaChartLine,
  FaGlobeAmericas,
  FaInfoCircle
} from "react-icons/fa";

const Money = () => {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");

  // Popular currencies with flags and symbols
  const currencies = [
    { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", icon: <FaRupeeSign /> },
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", icon: <FaDollarSign /> },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", icon: <FaEuroSign /> },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", icon: <FaPoundSign /> },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", icon: <FaYenSign /> },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", icon: <FaDollarSign /> },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", icon: <FaDollarSign /> },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭", icon: <FaCoins /> },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", icon: <FaYenSign /> },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", icon: <FaDollarSign /> },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪", icon: <FaCoins /> },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦", icon: <FaCoins /> },
  ];

  // Free Currency API (no API key required for basic usage)
  const API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_1olC1JQ8kYVJ7fY1v8K2v6a3q7Q3w4zX6b7vJ7q3&base_currency=${fromCurrency}`;

  const fetchExchangeRate = async () => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
      setConvertedAmount(amount);
      setLastUpdated(new Date().toLocaleString());
      return;
    }

    setLoading(true);
    setError("");

    try {
      // For demo purposes, using free API with limited requests
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data = await response.json();
      
      if (data.data && data.data[toCurrency]) {
        const rate = data.data[toCurrency];
        setExchangeRate(rate);
        setConvertedAmount(amount * rate);
        setLastUpdated(new Date().toLocaleString());
      } else {
        // Fallback to mock data if API fails
        useMockData();
      }
    } catch (err) {
      console.error("Error fetching exchange rates:", err);
      setError("Unable to fetch real-time rates. Showing demo data.");
      useMockData();
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demo purposes
  const useMockData = () => {
    const mockRates = {
      "USD": 0.012,
      "EUR": 0.011,
      "GBP": 0.0095,
      "JPY": 1.78,
      "AUD": 0.018,
      "CAD": 0.016,
      "CHF": 0.0105,
      "CNY": 0.086,
      "SGD": 0.016,
      "AED": 0.044,
      "SAR": 0.045,
    };
    
    const rate = mockRates[toCurrency] || 1;
    setExchangeRate(rate);
    setConvertedAmount(amount * rate);
    setLastUpdated(new Date().toLocaleString() + " (Demo Data)");
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(value);
  };

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency, amount]);

  const getCurrencySymbol = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : code;
  };

  const getCurrencyIcon = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.icon : <FaCoins />;
  };

  const getCurrencyFlag = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.flag : "🏳️";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <FaCoins className="text-amber-400 text-4xl" />
      </div>
      <div className="absolute top-40 right-20 opacity-30 animate-bounce" style={{ animationDelay: '1s' }}>
        <FaGlobeAmericas className="text-emerald-500 text-3xl" />
      </div>
      <div className="absolute bottom-40 left-20 opacity-20 animate-bounce" style={{ animationDelay: '1.5s' }}>
        <FaExchangeAlt className="text-amber-400 text-5xl" />
      </div>
      <div className="absolute top-60 left-1/4 opacity-15 animate-pulse">
        <FaChartLine className="text-emerald-500 text-6xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-emerald-800 mb-4 bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
            Currency Converter
          </h1>
          <p className="text-xl text-emerald-600 max-w-2xl mx-auto leading-relaxed">
            Convert Indian Rupees to any currency with real-time exchange rates
          </p>
        </div>

        {/* Main Converter Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-200/50 p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* From Currency */}
            <div className="text-center">
              <label className="block text-lg font-semibold text-emerald-700 mb-4">
                Amount to Convert
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full p-4 text-2xl font-bold text-emerald-800 border-2 border-emerald-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/50 text-center"
                  min="0"
                  step="100"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <span className="text-emerald-600 font-bold text-lg bg-emerald-100 px-3 py-1 rounded-lg">
                    {getCurrencySymbol(fromCurrency)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full p-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-emerald-800 font-medium"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSwapCurrencies}
                className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <FaExchangeAlt className="text-2xl" />
              </button>
            </div>

            {/* To Currency */}
            <div className="text-center">
              <label className="block text-lg font-semibold text-emerald-700 mb-4">
                Converted Amount
              </label>
              <div className="relative">
                <div className="w-full p-4 text-2xl font-bold text-emerald-800 border-2 border-emerald-300 rounded-xl bg-white/50 text-center min-h-[76px] flex items-center justify-center">
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"></div>
                  ) : (
                    <>
                      {getCurrencySymbol(toCurrency)} {convertedAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full p-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-emerald-800 font-medium"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="mt-8 p-4 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-2xl border border-emerald-300 text-center">
            <div className="flex items-center justify-center mb-2">
              <FaChartLine className="text-emerald-600 mr-2" />
              <span className="font-semibold text-emerald-800">Exchange Rate</span>
            </div>
            <div className="text-2xl font-bold text-emerald-700">
              1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </div>
            {lastUpdated && (
              <div className="text-sm text-emerald-600 mt-1">
                Last updated: {lastUpdated}
              </div>
            )}
            {error && (
              <div className="text-sm text-amber-600 mt-1 flex items-center justify-center">
                <FaInfoCircle className="mr-1" /> {error}
              </div>
            )}
          </div>
        </div>

        {/* Quick Conversion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {currencies.filter(c => c.code !== 'INR').slice(0, 4).map(currency => (
            <button
              key={currency.code}
              onClick={() => setToCurrency(currency.code)}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                toCurrency === currency.code 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-600 text-white' 
                  : 'bg-white border-emerald-300 text-emerald-800 hover:border-emerald-500'
              }`}
            >
              <div className="text-2xl mb-2">{currency.flag}</div>
              <div className="font-bold">{currency.code}</div>
              <div className="text-sm opacity-80">{currency.name}</div>
              <div className="text-lg font-semibold mt-2">
                {getCurrencySymbol(currency.code)} {(amount * (exchangeRate || 0.012)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
            </button>
          ))}
        </div>

        {/* Currency Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-200/50 p-6">
          <h3 className="text-2xl font-bold text-emerald-800 mb-6 text-center flex items-center justify-center">
            <FaGlobeAmericas className="mr-2 text-amber-600" />
            Popular Currency Rates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currencies.filter(c => c.code !== fromCurrency).map(currency => (
              <div key={currency.code} className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 hover:border-emerald-400 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{currency.flag}</span>
                  <span className="font-bold text-emerald-700">{currency.code}</span>
                </div>
                <div className="text-sm text-emerald-600 mb-2">{currency.name}</div>
                <div className="text-lg font-semibold text-emerald-800">
                  1 {fromCurrency} = {exchangeRate.toFixed(4)} {currency.code}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-300 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <FaInfoCircle className="text-amber-600 text-xl mr-2" />
            <h3 className="text-lg font-bold text-amber-800">Important Information</h3>
          </div>
          <p className="text-amber-700">
            Exchange rates are updated in real-time using Free Currency API. 
            Rates may vary slightly from actual market rates. 
            This converter is for informational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Money;