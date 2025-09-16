import React, { useState } from "react";
import { FaCalculator, FaPercent, FaSquareRootAlt, FaBackspace, FaTimes, FaDivide, FaPlus, FaMinus, FaEquals, FaMemory, FaDollarSign, FaCreditCard, FaUniversity, FaUtensils, FaPiggyBank, FaChartLine } from "react-icons/fa";

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [memory, setMemory] = useState(0);
  const [currentMode, setCurrentMode] = useState("basic");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [tipPercent, setTipPercent] = useState("");
  const [amount, setAmount] = useState("");
  const [activeButton, setActiveButton] = useState(null);

  // Handle number and decimal input
  const handleNumber = (value) => {
    const activeField = document.activeElement.id;
    if (currentMode !== "basic") {
      switch (currentMode) {
        case "simple":
        case "compound":
        case "emi":
          if (activeField === "principal") {
            setPrincipal((prev) => (prev === "" ? value : prev + value));
          } else if (activeField === "rate") {
            setRate((prev) => (prev === "" ? value : prev + value));
          } else if (activeField === "time") {
            setTime((prev) => (prev === "" ? value : prev + value));
          }
          break;
        case "tip":
          if (activeField === "amount") {
            setAmount((prev) => (prev === "" ? value : prev + value));
          } else if (activeField === "tipPercent") {
            setTipPercent((prev) => (prev === "" ? value : prev + value));
          }
          break;
        default:
          break;
      }
    } else {
      setDisplay((prev) => (prev === "0" ? value : prev + value));
      setExpression((prev) => prev + value);
    }
  };

  // Handle operator input
  const handleOperator = (op) => {
    if (currentMode !== "basic") return;
    setExpression((prev) => prev + " " + op + " ");
    setDisplay("0");
  };

  // Handle equals to evaluate expression
  const handleEquals = () => {
    let result;
    switch (currentMode) {
      case "simple":
        const p = parseFloat(principal);
        const r = parseFloat(rate);
        const t = parseFloat(time);
        if (isNaN(p) || isNaN(r) || isNaN(t)) {
          setDisplay("Invalid Input");
          return;
        }
        result = (p * r * t) / 100;
        setDisplay(result.toFixed(2));
        setPrincipal("");
        setRate("");
        setTime("");
        break;
      case "compound":
        const pComp = parseFloat(principal);
        const rComp = parseFloat(rate);
        const tComp = parseFloat(time);
        if (isNaN(pComp) || isNaN(rComp) || isNaN(tComp)) {
          setDisplay("Invalid Input");
          return;
        }
        result = pComp * Math.pow(1 + rComp / 100, tComp) - pComp;
        setDisplay(result.toFixed(2));
        setPrincipal("");
        setRate("");
        setTime("");
        break;
      case "tip":
        const amt = parseFloat(amount);
        const tipP = parseFloat(tipPercent);
        if (isNaN(amt) || isNaN(tipP)) {
          setDisplay("Invalid Input");
          return;
        }
        result = amt * (1 + tipP / 100);
        setDisplay(result.toFixed(2));
        setAmount("");
        setTipPercent("");
        break;
      case "emi":
        const pEmi = parseFloat(principal);
        const rEmi = parseFloat(rate) / 12 / 100; // Monthly rate
        const n = parseFloat(time) * 12; // Months
        if (isNaN(pEmi) || isNaN(rEmi) || isNaN(n)) {
          setDisplay("Invalid Input");
          return;
        }
        if (rEmi === 0) {
          result = pEmi / n;
        } else {
          result = pEmi * rEmi * Math.pow(1 + rEmi, n) / (Math.pow(1 + rEmi, n) - 1);
        }
        setDisplay(result.toFixed(2));
        setPrincipal("");
        setRate("");
        setTime("");
        break;
      case "basic":
        try {
          const result = eval(expression);
          setDisplay(result.toString());
          setExpression(result.toString());
        } catch (error) {
          setDisplay("Error");
          setExpression("");
        }
        break;
      default:
        setDisplay("Error");
        return;
    }
  };

  // Handle clear
  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setPrincipal("");
    setRate("");
    setTime("");
    setAmount("");
    setTipPercent("");
    setMemory(0);
  };

  // Handle backspace
  const handleBackspace = () => {
    const activeField = document.activeElement.id;
    if (currentMode !== "basic") {
      switch (currentMode) {
        case "simple":
        case "compound":
        case "emi":
          if (activeField === "principal") {
            setPrincipal((prev) => (prev.slice(0, -1) || ""));
          } else if (activeField === "rate") {
            setRate((prev) => (prev.slice(0, -1) || ""));
          } else if (activeField === "time") {
            setTime((prev) => (prev.slice(0, -1) || ""));
          }
          break;
        case "tip":
          if (activeField === "amount") {
            setAmount((prev) => (prev.slice(0, -1) || ""));
          } else if (activeField === "tipPercent") {
            setTipPercent((prev) => (prev.slice(0, -1) || ""));
          }
          break;
        default:
          break;
      }
    } else {
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      setExpression((prev) => (prev.length > 1 ? prev.slice(0, -1) : ""));
    }
  };

  // Handle scientific functions
  const handleScientific = (func) => {
    if (currentMode !== "basic") return;
    const num = parseFloat(display);
    if (isNaN(num)) {
      setDisplay("Error");
      return;
    }
    let result;
    switch (func) {
      case "square":
        result = num * num;
        break;
      case "sqrt":
        result = Math.sqrt(num);
        break;
      case "percent":
        result = num / 100;
        break;
      case "reciprocal":
        result = 1 / num;
        break;
      default:
        return;
    }
    setDisplay(result.toString());
    setExpression(result.toString());
  };

  // Handle memory functions
  const handleMemory = (func) => {
    if (currentMode !== "basic") return;
    const num = parseFloat(display);
    if (isNaN(num)) return;
    switch (func) {
      case "m+":
        setMemory((prev) => prev + num);
        break;
      case "m-":
        setMemory((prev) => prev - num);
        break;
      case "mr":
        setDisplay(memory.toString());
        setExpression(memory.toString());
        break;
      case "mc":
        setMemory(0);
        break;
      default:
        return;
    }
  };

  // Button animation handler
  const handleButtonAnimation = (buttonId) => {
    setActiveButton(buttonId);
    setTimeout(() => setActiveButton(null), 150);
  };

  // Render inputs for current mode
  const renderInputs = () => {
    switch (currentMode) {
      case "simple":
      case "compound":
      case "emi":
        return (
          <div className="space-y-3">
            <div className="relative">
              <FaDollarSign className="absolute left-3 top-3 text-amber-600 w-4 h-4" />
              <input
                id="principal"
                type="text"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder={currentMode === "emi" ? "Loan Amount" : "Principal Amount"}
                className="w-full p-2 pl-9 text-sm border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-emerald-800 bg-emerald-50 transition-all"
              />
            </div>
            <div className="relative">
              <FaPercent className="absolute left-3 top-3 text-amber-600 w-4 h-4" />
              <input
                id="rate"
                type="text"
                value={rate}
                onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder={currentMode === "emi" ? "Annual Rate (%)" : "Interest Rate (%)"}
                className="w-full p-2 pl-9 text-sm border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-emerald-800 bg-emerald-50 transition-all"
              />
            </div>
            <div className="relative">
              <FaUniversity className={currentMode === "emi" ? "absolute left-3 top-3 text-amber-600 w-4 h-4" : "hidden"} />
              <input
                id="time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Time (Years)"
                className={`w-full p-2 ${currentMode === "emi" ? "pl-9" : ""} text-sm border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-emerald-800 bg-emerald-50 transition-all`}
              />
            </div>
            <button
              onClick={() => {
                handleEquals();
                handleButtonAnimation('calculate');
              }}
              className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Calculate
            </button>
          </div>
        );
      case "tip":
        return (
          <div className="space-y-3">
            <div className="relative">
              <FaDollarSign className="absolute left-3 top-3 text-amber-600 w-4 h-4" />
              <input
                id="amount"
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Bill Amount"
                className="w-full p-2 pl-9 text-sm border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-emerald-800 bg-emerald-50 transition-all"
              />
            </div>
            <div className="relative">
              <FaPercent className="absolute left-3 top-3 text-amber-600 w-4 h-4" />
              <input
                id="tipPercent"
                type="text"
                value={tipPercent}
                onChange={(e) => setTipPercent(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Tip Percentage (%)"
                className="w-full p-2 pl-9 text-sm border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-emerald-800 bg-emerald-50 transition-all"
              />
            </div>
            <button
              onClick={() => {
                handleEquals();
                handleButtonAnimation('calculate');
              }}
              className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Calculate
            </button>
          </div>
        );
      case "basic":
        return (
          <div className="grid grid-cols-4 gap-2">
            {/* Memory buttons */}
            <button
              onClick={() => {
                handleMemory("mc");
                handleButtonAnimation('mc');
              }}
              className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200 flex items-center justify-center text-emerald-700 text-sm font-medium transition-all transform active:scale-95"
              title="Memory Clear"
            >
              <FaMemory className="mr-1 w-3 h-3" /> C
            </button>
            <button
              onClick={() => {
                handleMemory("mr");
                handleButtonAnimation('mr');
              }}
              className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200 flex items-center justify-center text-emerald-700 text-sm font-medium transition-all transform active:scale-95"
              title="Memory Recall"
            >
              <FaMemory className="mr-1 w-3 h-3" /> R
            </button>
            <button
              onClick={() => {
                handleMemory("m+");
                handleButtonAnimation('m+');
              }}
              className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200 flex items-center justify-center text-emerald-700 text-sm font-medium transition-all transform active:scale-95"
              title="Memory Add"
            >
              <FaMemory className="mr-1 w-3 h-3" /> +
            </button>
            <button
              onClick={() => {
                handleMemory("m-");
                handleButtonAnimation('m-');
              }}
              className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200 flex items-center justify-center text-emerald-700 text-sm font-medium transition-all transform active:scale-95"
              title="Memory Subtract"
            >
              <FaMemory className="mr-1 w-3 h-3" /> -
            </button>
            
            {/* Scientific functions */}
            <button
              onClick={() => {
                handleScientific("square");
                handleButtonAnimation('square');
              }}
              className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200 text-emerald-700 text-xs font-medium transition-all transform active:scale-95"
            >
              x²
            </button>
            <button
              onClick={() => {
                handleScientific("sqrt");
                handleButtonAnimation('sqrt');
              }}
              className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200 text-emerald-700 text-xs font-medium transition-all transform active:scale-95"
            >
              <FaSquareRootAlt className="w-3 h-3 mx-auto" />
            </button>
            <button
              onClick={() => {
                handleScientific("percent");
                handleButtonAnimation('percent');
              }}
              className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200 text-emerald-700 text-xs font-medium transition-all transform active:scale-95"
            >
              <FaPercent className="w-3 h-3 mx-auto" />
            </button>
            <button
              onClick={() => {
                handleScientific("reciprocal");
                handleButtonAnimation('reciprocal');
              }}
              className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200 text-emerald-700 text-xs font-medium transition-all transform active:scale-95"
            >
              1/x
            </button>
            
            {/* Control buttons */}
            <button
              onClick={() => {
                handleClear();
                handleButtonAnimation('clear');
              }}
              className="p-2 bg-red-100 rounded-lg hover:bg-red-200 text-red-700 font-medium text-sm transition-all transform active:scale-95"
            >
              AC
            </button>
            <button
              onClick={() => {
                handleBackspace();
                handleButtonAnimation('backspace');
              }}
              className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200 text-emerald-700 flex items-center justify-center text-sm transition-all transform active:scale-95"
            >
              <FaBackspace className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                handleOperator("/");
                handleButtonAnimation('divide');
              }}
              className="p-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 flex items-center justify-center text-sm font-medium transition-all transform active:scale-95"
            >
              <FaDivide className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                handleOperator("*");
                handleButtonAnimation('multiply');
              }}
              className="p-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 flex items-center justify-center text-sm font-medium transition-all transform active:scale-95"
            >
              <FaTimes className="w-3 h-3" />
            </button>
            
            {/* Number pad */}
            {[7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => {
                  handleNumber(num.toString());
                  handleButtonAnimation(`num-${num}`);
                }}
                className="p-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 text-emerald-800 font-bold text-base transition-all transform active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => {
                handleOperator("-");
                handleButtonAnimation('subtract');
              }}
              className="p-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 flex items-center justify-center text-sm font-medium transition-all transform active:scale-95"
            >
              <FaMinus className="w-3 h-3" />
            </button>
            
            {[4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => {
                  handleNumber(num.toString());
                  handleButtonAnimation(`num-${num}`);
                }}
                className="p-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 text-emerald-800 font-bold text-base transition-all transform active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => {
                handleOperator("+");
                handleButtonAnimation('add');
              }}
              className="p-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 flex items-center justify-center text-sm font-medium transition-all transform active:scale-95"
            >
              <FaPlus className="w-3 h-3" />
            </button>
            
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => {
                  handleNumber(num.toString());
                  handleButtonAnimation(`num-${num}`);
                }}
                className="p-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 text-emerald-800 font-bold text-base transition-all transform active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => {
                handleNumber("0");
                handleButtonAnimation('num-0');
              }}
              className="p-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 text-emerald-800 font-bold text-base col-span-2 transition-all transform active:scale-95"
            >
              0
            </button>
            <button
              onClick={() => {
                handleNumber(".");
                handleButtonAnimation('decimal');
              }}
              className="p-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 text-emerald-800 font-bold text-base transition-all transform active:scale-95"
            >
              .
            </button>
            <button
              onClick={() => {
                handleEquals();
                handleButtonAnimation('equals');
              }}
              className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 flex items-center justify-center text-sm font-bold transition-all transform active:scale-95"
            >
              <FaEquals className="w-4 h-4" />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <FaPiggyBank className="text-amber-400 text-6xl" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <FaChartLine className="text-amber-400 text-6xl" />
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl border border-emerald-200 p-6 max-w-3xl w-full relative overflow-hidden">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-800 flex items-center justify-center">
            <FaCalculator className="mr-2 text-amber-600" />
            Financial Calculator
          </h1>
          <p className="text-emerald-600 text-sm">Smart calculations for your finances</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-row overflow-x-auto border-b border-emerald-300 mb-4 whitespace-nowrap">
          {[
            { mode: "basic", label: "Calculator", icon: <FaCalculator className="w-4 h-4 mr-1" /> },
            { mode: "simple", label: "Simple Interest", icon: <FaPercent className="w-4 h-4 mr-1" /> },
            { mode: "compound", label: "Compound Interest", icon: <FaPercent className="w-4 h-4 mr-1" /> },
            { mode: "emi", label: "Loan EMI", icon: <FaCreditCard className="w-4 h-4 mr-1" /> },
            { mode: "tip", label: "Tip Calculator", icon: <FaUtensils className="w-4 h-4 mr-1" /> },
          ].map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => {
                setCurrentMode(mode);
                setDisplay("0");
                setExpression("");
                setPrincipal("");
                setRate("");
                setTime("");
                setAmount("");
                setTipPercent("");
              }}
              className={`flex items-center px-4 py-2 text-sm font-medium transition-all ${
                currentMode === mode
                  ? "bg-emerald-700 text-white border-b-2 border-amber-500"
                  : "text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Display */}
        <div className="bg-emerald-100 p-4 rounded-xl mb-4 text-right font-mono text-xl font-semibold text-emerald-800 border border-emerald-200 shadow-inner">
          {display}
        </div>

        {/* Content Area */}
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 shadow-sm">
          {renderInputs()}
        </div>
      </div>

      {/* Animated circles in background */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-amber-200 opacity-30 animate-pulse"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-emerald-200 opacity-30 animate-pulse delay-1000"></div>
    </div>
  );
}

export default Calculator;