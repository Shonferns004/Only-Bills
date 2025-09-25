import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Users, Percent, Calculator, Loader2, History, Trash2, Globe2, Receipt, Clock } from 'lucide-react';


const currencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'JPY', symbol: '¥' },
];

const tipPresets = [10, 15, 20, 25];

const BillSplitter = () => {
  const [bill, setBill] = useState('');
  const [people, setPeople] = useState('');
  const [tip, setTip] = useState('');
  const [perPerson, setPerPerson] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [showDetails, setShowDetails] = useState(false);

  const calculateSplit = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const total = parseFloat(bill);
      const numPeople = parseInt(people);
      const tipAmount = (parseFloat(tip) / 100) * total;
      const totalWithTip = total + tipAmount;

      if (!isNaN(totalWithTip) && numPeople > 0) {
        const amountPerPerson = Number((totalWithTip / numPeople).toFixed(2));
        setPerPerson(amountPerPerson);
        
        const newSplit = {
          id: Date.now().toString(),
          amount: total,
          people: numPeople,
          tip: parseFloat(tip),
          perPerson: amountPerPerson,
          currency: selectedCurrency.code,
          timestamp: new Date(),
        };
        
        setHistory(prev => [newSplit, ...prev.slice(0, 4)]);
        setShowDetails(true);
      } else {
        setPerPerson(null);
      }
      setIsCalculating(false);
    }, 500);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const inputClasses = "w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors pl-10";
  const labelClasses = "block text-gray-300 text-sm font-medium mb-2";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Main Calculator Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8"
          >
            <h1 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
              <span className="text-3xl">🍽️</span> Bill Splitter
            </h1>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className={labelClasses}>
                    Total Bill Amount
                    <div className="relative mt-1">
                      <DollarSign className={iconClasses} size={20} />
                      <input
                        type="number"
                        placeholder="Enter total amount"
                        value={bill}
                        onChange={(e) => setBill(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  </label>
                </div>
                
                <div className="sm:w-32">
                  <label className={labelClasses}>
                    Currency
                    <div className="relative mt-1">
                      <Globe2 className={iconClasses} size={20} />
                      <select
                        value={selectedCurrency.code}
                        onChange={(e) => setSelectedCurrency(currencies.find(c => c.code === e.target.value) || currencies[0])}
                        className={inputClasses}
                      >
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className={labelClasses}>
                  Number of People
                  <div className="relative mt-1">
                    <Users className={iconClasses} size={20} />
                    <input
                      type="number"
                      placeholder="How many people?"
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </label>
              </div>

              <div>
                <label className={labelClasses}>
                  Tip Percentage
                  <div className="relative mt-1">
                    <Percent className={iconClasses} size={20} />
                    <input
                      type="number"
                      placeholder="Tip percentage"
                      value={tip}
                      onChange={(e) => setTip(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tipPresets.map(preset => (
                    <button
                      key={preset}
                      onClick={() => setTip(preset.toString())}
                      className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={calculateSplit}
                disabled={isCalculating || !bill || !people}
                className="w-full bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    <span>Calculate Split</span>
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {perPerson && showDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 bg-gray-700/50 rounded-xl p-6"
                  >
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-gray-400 mb-1">Each person pays</div>
                        <div className="text-4xl font-bold text-white">
                          {selectedCurrency.symbol}{perPerson}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-600">
                        <div>
                          <div className="text-gray-400 text-sm">Subtotal</div>
                          <div className="text-white">{selectedCurrency.symbol}{bill}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">Tip Amount</div>
                          <div className="text-white">{selectedCurrency.symbol}{((parseFloat(bill) * parseFloat(tip)) / 100).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* History Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <History size={20} />
                Recent Splits
              </h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  title="Clear history"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No splits yet. Start by calculating a split!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((split) => (
                  <motion.div
                    key={split.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gray-700/50 rounded-xl p-4 hover:bg-gray-700/70 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-white font-medium">
                          {split.currency} {split.perPerson} / person
                        </div>
                        <div className="text-gray-400 text-sm">
                          Split between {split.people} people
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Clock size={14} />
                        {new Date(split.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <div>Total: {split.currency} {split.amount}</div>
                      <div>Tip: {split.tip}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BillSplitter;