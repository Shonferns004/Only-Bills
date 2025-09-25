import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, Printer, Loader2 } from 'lucide-react';

function CustomDropdown({ value, onChange, options, placeholder, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-gray-800 text-left text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
          !value && 'text-gray-400'
        }`}
      >
        <div className="flex items-center justify-between">
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            {options.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left transition-colors ${
                  option.value === value
                    ? 'bg-orange-600/20 text-orange-500'
                    : 'text-white hover:bg-gray-700'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {required && (
        <input
          type="text"
          tabIndex={-1}
          value={value}
          required
          className="sr-only"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

function App() {
  const [income, setIncome] = useState('');
  const [numFamilyMembers, setNumFamilyMembers] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [numChildren, setNumChildren] = useState('');
  const [hasRent, setHasRent] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [hasVehicle, setHasVehicle] = useState('');
  const [petrolExpense, setPetrolExpense] = useState('');
  const [result, setResult] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [expandedSection, setExpandedSection] = useState('budget');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);


    const data = {
      income: parseFloat(income),
      num_family_members: parseInt(numFamilyMembers),
      marital_status: maritalStatus,
      num_children: parseInt(numChildren),
      has_rent: hasRent,
      rent_amount: parseFloat(rentAmount),
      has_vehicle: hasVehicle,
      petrol_expense: parseFloat(petrolExpense),
    };

    try {
      const response = await axios.post('https://onlybills-1.onrender.com/api/budget', data);
      setResult(response.data);
      setShowForm(false);
    } catch (error) {
      console.error('Error fetching budget advice:', error);
      setResult({ error: 'Failed to fetch budget advice' });
    } finally {
      setIsLoading(false);
    }
  };


  const formatGeminiText = (text) => {
    if (!text) return "";
  
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
      .replace(/\*(.*?)\*/g, "<li>$1</li>") // convert bullet points
      .replace(/\n{2,}/g, "<br/><br/>") // multiple line breaks
      .replace(/\n/g, "<br/>")
      .replace(/^\s*\*\s?/gm, "") // remove leading asterisks and spaces from each line
      .replace(/\n/g, "<br/>") // single line breaks
      .replace(/\n\s*\*\s(.*?)(?=\n|$)/g, "<li>$1</li>") // single line breaks
  };
  
  

  const handleReset = () => {
    setShowForm(true);
    setResult(null);
    setExpandedSection('budget');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Budget Analysis Report</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 900px;
        margin: 0 auto;
        padding: 30px;
        background: linear-gradient(to right, #f1f1f1, #e6f0ff);
      }

      h1 {
        color: #2c3e50;
        text-align: center;
        padding-bottom: 15px;
        border-bottom: 3px solid #3498db;
        font-size: 2.5em;
      }

      h2 {
        color: #2c3e50;
        margin-top: 30px;
        font-size: 1.8em;
      }

      .section {
        margin: 30px 0;
        padding: 25px;
        background: #ffffff;
        border-left: 5px solid #3498db;
        border-radius: 10px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .info-item {
        padding: 15px;
        background: #f4faff;
        border-left: 4px solid #2980b9;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease;
      }

      .info-item:hover {
        transform: translateY(-3px);
      }

      .label {
        font-weight: 600;
        color: #555;
        margin-bottom: 5px;
        display: block;
      }

      pre {
        border-radius: 8px;
        padding: 15px;
        overflow-x: auto;
        white-space: pre-wrap;
        font-family: 'Courier New', Courier, monospace;
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
      }

      @media print {
        body {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }

        .section {
          break-inside: avoid;
        }

        .info-item {
          box-shadow: none;
        }
      }
    </style>
  </head>
  <body>
    <h1>Budget Analysis Report</h1>

    <div class="section">
      <h2>Input Information</h2>
      <div class="info-grid">
        <div class="info-item">
          <div class="label">Monthly Income:</div>
          ${income}
        </div>
        <div class="info-item">
          <div class="label">Family Members:</div>
          ${numFamilyMembers}
        </div>
        <div class="info-item">
          <div class="label">Marital Status:</div>
          ${maritalStatus.charAt(0).toUpperCase() + maritalStatus.slice(1)}
        </div>
        ${maritalStatus === 'married' ? `
        <div class="info-item">
          <div class="label">Number of Children:</div>
          ${numChildren}
        </div>` : ''}
        <div class="info-item">
          <div class="label">Paying Rent:</div>
          ${hasRent === 'yes' ? `Yes (${rentAmount})` : 'No'}
        </div>
        <div class="info-item">
          <div class="label">Has Vehicle:</div>
          ${hasVehicle === 'yes' ? `Yes (Petrol: ${petrolExpense})` : 'No'}
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Budget Breakdown</h2>
      <pre>
${JSON.stringify(result.budget, null, 2)}
      </pre>
    </div>

    <div class="section">
      <h2>Financial Advice</h2>
      <pre>
      ${formatGeminiText(result?.gemini_advice)}
      </pre>
    </div>
  </body>
</html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const inputClasses = "w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors";
  const labelClasses = "block text-gray-300 text-sm font-medium mb-2";

  const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
  ];

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8"
            >
              <h1 className="text-3xl font-bold text-white mb-8 text-center">Budget Planner</h1>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className={labelClasses}>
                        Monthly Income
                        <input
                          type="number"
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          required
                          className={inputClasses}
                          placeholder="Enter amount"
                        />
                      </label>
                    </div>
                    
                    <div>
                      <label className={labelClasses}>
                        Number of Family Members
                        <input
                          type="number"
                          value={numFamilyMembers}
                          onChange={(e) => setNumFamilyMembers(e.target.value)}
                          required
                          className={inputClasses}
                          placeholder="Enter number"
                        />
                      </label>
                    </div>

                    <div>
                      <label className={labelClasses}>
                        Marital Status
                        <CustomDropdown
                          value={maritalStatus}
                          onChange={setMaritalStatus}
                          options={maritalStatusOptions}
                          placeholder="Select status"
                          required
                        />
                      </label>
                    </div>

                    {maritalStatus === 'married' && (
                      <div>
                        <label className={labelClasses}>
                          Number of Children
                          <input
                            type="number"
                            value={numChildren}
                            onChange={(e) => setNumChildren(e.target.value)}
                            className={inputClasses}
                            placeholder="Enter number"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className={labelClasses}>
                        Do you pay rent?
                        <CustomDropdown
                          value={hasRent}
                          onChange={setHasRent}
                          options={yesNoOptions}
                          placeholder="Select option"
                          required
                        />
                      </label>
                    </div>

                    {hasRent === 'yes' && (
                      <div>
                        <label className={labelClasses}>
                          Rent Amount
                          <input
                            type="number"
                            value={rentAmount}
                            onChange={(e) => setRentAmount(e.target.value)}
                            required
                            className={inputClasses}
                            placeholder="Enter amount"
                          />
                        </label>
                      </div>
                    )}

                    <div>
                      <label className={labelClasses}>
                        Do you have a vehicle?
                        <CustomDropdown
                          value={hasVehicle}
                          onChange={setHasVehicle}
                          options={yesNoOptions}
                          placeholder="Select option"
                          required
                        />
                      </label>
                    </div>

                    {hasVehicle === 'yes' && (
                      <div>
                        <label className={labelClasses}>
                          Petrol Expense
                          <input
                            type="number"
                            value={petrolExpense}
                            onChange={(e) => setPetrolExpense(e.target.value)}
                            required
                            className={inputClasses}
                            placeholder="Enter amount"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating Budget Plan...</span>
                      </>
                    ) : (
                      'Generate Budget Plan'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <ArrowLeft size={20} />
                    <span>Back to Form</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrint}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Printer size={20} />
                    <span>Print Report</span>
                  </motion.button>
                </div>
                <h2 className="text-2xl font-bold text-white">Your Budget Analysis</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => setExpandedSection('budget')}
                    className={`w-full px-6 py-4 text-left flex items-center justify-between ${
                      expandedSection === 'budget' ? 'bg-gray-700' : ''
                    }`}
                  >
                    <h3 className="text-xl font-semibold text-white">Budget Breakdown</h3>
                    <span className="text-gray-400">{expandedSection === 'budget' ? '−' : '+'}</span>
                  </button>
                  {expandedSection === 'budget' && (
                    <div className="p-6 bg-gray-900">
                      <pre className="text-gray-300 whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(result.budget, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => setExpandedSection('advice')}
                    className={`w-full px-6 py-4 text-left flex items-center justify-between ${
                      expandedSection === 'advice' ? 'bg-gray-700' : ''
                    }`}
                  >
                    <h3 className="text-xl font-semibold text-white">Financial Advice</h3>
                    <span className="text-gray-400">{expandedSection === 'advice' ? '−' : '+'}</span>
                  </button>
                  {expandedSection === 'advice' && (
                    <div className="p-6 bg-gray-900">
                      <pre dangerouslySetInnerHTML={{
            __html: formatGeminiText(result?.gemini_advice)
          }} className="text-gray-300 whitespace-pre-wrap overflow-x-auto">
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;