import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { db, doc, updateDoc, arrayUnion, getDoc } from '../firebase';
import { 
  FaCamera, 
  FaUpload, 
  FaTimes, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaQrcode,
  FaEdit,
  FaSave
} from 'react-icons/fa';

const BillScanner = ({ user, onClose, onSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [extractedAmount, setExtractedAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [editableAmount, setEditableAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Enhanced amount extraction with better bill analysis
  const extractAmountFromText = (text) => {
    console.log("Extracted text:", text); // Debug log
    
    // Clean and normalize the text
    const cleanText = text
      .replace(/[|]/g, 'I') // Fix common OCR errors
      .replace(/[O]/g, '0') // Replace O with 0 in numbers
      .replace(/[l]/g, '1') // Replace l with 1 in numbers
      .replace(/\s+/g, ' ') // Normalize whitespace
      .toUpperCase();

    console.log("Cleaned text:", cleanText); // Debug log

    // Priority-based amount extraction
    const amountCandidates = [];

    // 1. Look for explicit total/amount labels (highest priority)
    const totalPatterns = [
      /(?:TOTAL|AMOUNT|GRAND\s*TOTAL|NET\s*AMOUNT|BILL\s*AMOUNT|PAYABLE|DUE|BALANCE)[\s:]*(?:RS\.?|₹)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/gi,
      /(?:RS\.?|₹)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:TOTAL|AMOUNT|PAYABLE|DUE)/gi,
      /TOTAL[\s:]*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/gi
    ];

    totalPatterns.forEach((pattern, index) => {
      const matches = [...cleanText.matchAll(pattern)];
      matches.forEach(match => {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (amount > 0 && amount < 1000000) {
          amountCandidates.push({
            amount,
            priority: 10 - index, // Higher priority for earlier patterns
            context: match[0],
            type: 'total'
          });
        }
      });
    });

    // 2. Look for currency symbols with amounts (medium priority)
    const currencyPatterns = [
      /(?:RS\.?|₹)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/gi,
      /(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:RS\.?|₹)/gi
    ];

    currencyPatterns.forEach((pattern, index) => {
      const matches = [...cleanText.matchAll(pattern)];
      matches.forEach(match => {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (amount > 10 && amount < 1000000) { // Minimum ₹10 for currency patterns
          amountCandidates.push({
            amount,
            priority: 7 - index,
            context: match[0],
            type: 'currency'
          });
        }
      });
    });

    // 3. Look for structured amounts (lower priority)
    const structuredPatterns = [
      /(\d{1,3}(?:,\d{3})+\.\d{2})/g, // 1,234.56 format
      /(\d{3,})\.\d{2}/g, // 1234.56 format
      /(\d{3,})/g // Large numbers without decimals
    ];

    structuredPatterns.forEach((pattern, index) => {
      const matches = [...cleanText.matchAll(pattern)];
      matches.forEach(match => {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (amount > 50 && amount < 1000000) { // Minimum ₹50 for structured patterns
          amountCandidates.push({
            amount,
            priority: 4 - index,
            context: match[0],
            type: 'structured'
          });
        }
      });
    });

    console.log("Amount candidates:", amountCandidates); // Debug log

    if (amountCandidates.length === 0) {
      return null;
    }

    // Sort by priority (highest first), then by amount (largest first)
    amountCandidates.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return b.amount - a.amount;
    });

    // Additional validation: prefer amounts that appear in bill-like contexts
    const billKeywords = ['TOTAL', 'AMOUNT', 'PAYABLE', 'DUE', 'BILL', 'INVOICE'];
    const contextualCandidate = amountCandidates.find(candidate => 
      billKeywords.some(keyword => candidate.context.includes(keyword))
    );

    const selectedAmount = contextualCandidate || amountCandidates[0];
    console.log("Selected amount:", selectedAmount); // Debug log

    return selectedAmount.amount;
  };

  // Capture image from webcam
  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false);
    processImage(imageSrc);
  }, [webcamRef]);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target.result;
        setCapturedImage(imageSrc);
        processImage(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  // Process image with OCR
  const processImage = async (imageSrc) => {
    setIsProcessing(true);
    setError('');
    setOcrProgress(0);

    try {
      // Enhanced OCR configuration for better bill recognition
      const { data: { text } } = await Tesseract.recognize(
        imageSrc,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          },
          tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT,
          tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:-₹Rs ',
          preserve_interword_spaces: '1'
        }
      );

      console.log("Raw OCR text:", text); // Debug log
      setExtractedText(text);
      
      const amount = extractAmountFromText(text);
      
      if (amount) {
        setExtractedAmount(amount.toString());
        setEditableAmount(amount.toString());
      } else {
        setError('Could not extract amount from the bill. Please check the image quality and try again, or enter the amount manually.');
        setEditableAmount('');
      }
    } catch (err) {
      console.error("OCR Error:", err);
      setError('Failed to process image: ' + err.message);
    } finally {
      setIsProcessing(false);
      setOcrProgress(0);
    }
  };

  // Save transaction to Firebase
  const saveTransaction = async () => {
    if (!user || !user.email) {
      setError('User not authenticated');
      return;
    }

    const amount = parseFloat(editableAmount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setIsProcessing(true);
      const userDocRef = doc(db, "transactions", user.email);
      
      // Get current data
      const docSnap = await getDoc(userDocRef);
      const currentData = docSnap.exists() ? docSnap.data() : { totalAmount: 0, transactions: [] };
      
      const newTotal = currentData.totalAmount - amount; // Subtract as it's an expense
      const clientTimestamp = new Date().toISOString();
      
      const transaction = {
        type: "Expense",
        amount: amount,
        date: clientTimestamp,
        createdAt: clientTimestamp,
        source: "Bill Scan",
        description: "Scanned from bill"
      };

      await updateDoc(userDocRef, {
        totalAmount: newTotal,
        transactions: arrayUnion(transaction)
      });

      if (onSuccess) {
        onSuccess(transaction);
      }
      
      onClose();
    } catch (err) {
      setError('Failed to save transaction: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-full">
              <FaQrcode className="text-emerald-600 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Scan Bill</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500 text-xl" />
          </button>
        </div>

        <div className="p-6">
          {/* Camera/Upload Options */}
          {!capturedImage && !showCamera && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-6">Choose how to capture your bill:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowCamera(true)}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-emerald-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                  >
                    <FaCamera className="text-emerald-600 text-3xl" />
                    <span className="font-medium text-gray-700">Use Camera</span>
                  </button>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <FaUpload className="text-blue-600 text-3xl" />
                    <span className="font-medium text-gray-700">Upload Image</span>
                  </button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Camera View */}
          {showCamera && (
            <div className="space-y-4">
              <div className="relative">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-xl"
                />
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-xl pointer-events-none opacity-50"></div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={captureImage}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <FaCamera />
                  Capture
                </button>
                <button
                  onClick={() => setShowCamera(false)}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Processing image...</p>
              {ocrProgress > 0 && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2 w-64 mx-auto">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{ocrProgress}% complete</p>
                </div>
              )}
            </div>
          )}

          {/* Captured Image and Results */}
          {capturedImage && !isProcessing && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Captured Image:</h3>
                <img 
                  src={capturedImage} 
                  alt="Captured bill" 
                  className="w-full max-w-md mx-auto rounded-xl border border-gray-200"
                />
              </div>

              {extractedAmount && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCheckCircle className="text-emerald-600" />
                    <h3 className="font-medium text-emerald-800">Amount Detected</h3>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">Amount:</span>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">₹</span>
                        <input
                          type="number"
                          value={editableAmount}
                          onChange={(e) => setEditableAmount(e.target.value)}
                          className="border border-gray-300 rounded px-3 py-1 w-32"
                          step="0.01"
                          min="0"
                        />
                        <button
                          onClick={() => setIsEditing(false)}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          <FaSave />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-800 text-xl">
                          ₹{parseFloat(editableAmount).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!extractedAmount && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaExclamationTriangle className="text-amber-600" />
                    <h3 className="font-medium text-amber-800">Manual Entry Required</h3>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">Enter amount:</span>
                    <span className="text-gray-600">₹</span>
                    <input
                      type="number"
                      value={editableAmount}
                      onChange={(e) => setEditableAmount(e.target.value)}
                      placeholder="0.00"
                      className="border border-gray-300 rounded px-3 py-2 w-32"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              )}

              {/* Extracted Text Preview */}
              {extractedText && (
                <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <summary className="font-medium text-gray-700 cursor-pointer">
                    View Extracted Text
                  </summary>
                  <div className="mt-3 text-sm text-gray-600 max-h-32 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">{extractedText}</pre>
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setCapturedImage(null);
                    setExtractedText('');
                    setExtractedAmount('');
                    setEditableAmount('');
                    setError('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Retake
                </button>
                <button
                  onClick={saveTransaction}
                  disabled={!editableAmount || parseFloat(editableAmount) <= 0}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors"
                >
                  Save Transaction
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <FaExclamationTriangle />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillScanner;