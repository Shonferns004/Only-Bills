import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, Lightbulb, Thermometer, Users, Loader2, History, Trash2, Clock, Battery, Smartphone } from 'lucide-react';
import axios from 'axios';



const App = () => {
  // Energy Predictor State
  const [energyForm, setEnergyForm] = useState({
    size: '',
    people: '',
    insulation: '',
    heating_cooling_systems: ''
  });
  const [energyResult, setEnergyResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('predictor');

  const handleEnergyPredict = async (e) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await axios.post('https://onlybills.onrender.com/predict', energyForm);
      setEnergyResult(res.data);
      
      const newPrediction = {
        id: Date.now().toString(),
        rooms: Number(energyForm.size),
        people: Number(energyForm.people),
        appliances: Number(energyForm.insulation),
        systems: Number(energyForm.heating_cooling_systems),
        prediction: res.data.predicted_energy,
        perRoom: res.data.predicted_energy_divided,
        timestamp: new Date()
      };
      
      setHistory(prev => [newPrediction, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Prediction failed:', error);
    }
    setIsPredicting(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const inputClasses = "w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors pl-10";
  const labelClasses = "block text-gray-300 text-sm font-medium mb-2";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";

  const energyTips = [
    { icon: <Lightbulb size={24} />, tip: "Switch to LED bulbs to save up to 80% on lighting costs" },
    { icon: <Thermometer size={24} />, tip: "Maintain optimal temperature settings: 24°C for cooling, 20°C for heating" },
    { icon: <Battery size={24} />, tip: "Unplug devices when not in use to avoid phantom energy consumption" },
    { icon: <Smartphone size={24} />, tip: "Use smart power strips to automatically cut power to idle devices" }
  ];

  const usagePatterns = [
    { time: "Morning Peak", usage: "High", description: "7-9 AM: Most appliances active" },
    { time: "Midday", usage: "Moderate", description: "10 AM-4 PM: Regular usage" },
    { time: "Evening Peak", usage: "Very High", description: "6-10 PM: Maximum consumption" },
    { time: "Night", usage: "Low", description: "11 PM-6 AM: Minimal usage" }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Main Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8"
          >
            <h1 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
              <Zap className="text-yellow-400" size={32} />
              Smart Energy Predictor
            </h1>

            <div className="flex justify-center mb-8">
              <div className="bg-gray-700/50 rounded-xl p-1 flex">
                {(['predictor', 'tips', 'usage']).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-yellow-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'predictor' && (
                <motion.div
                  key="predictor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <form onSubmit={handleEnergyPredict} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}>
                        Number of Rooms
                        <div className="relative mt-1">
                          <Home className={iconClasses} size={20} />
                          <input
                            type="number"
                            name="size"
                            placeholder="Enter number of rooms"
                            value={energyForm.size}
                            onChange={(e) => setEnergyForm({ ...energyForm, size: e.target.value })}
                            className={inputClasses}
                            required
                          />
                        </div>
                      </label>
                    </div>

                    <div>
                      <label className={labelClasses}>
                        Occupancy
                        <div className="relative mt-1">
                          <Users className={iconClasses} size={20} />
                          <input
                            type="number"
                            name="people"
                            placeholder="Number of occupants"
                            value={energyForm.people}
                            onChange={(e) => setEnergyForm({ ...energyForm, people: e.target.value })}
                            className={inputClasses}
                            required
                          />
                        </div>
                      </label>
                    </div>

                    <div>
                      <label className={labelClasses}>
                        Heavy Appliances
                        <div className="relative mt-1">
                          <Lightbulb className={iconClasses} size={20} />
                          <input
                            type="number"
                            name="insulation"
                            placeholder="Number of heavy appliances"
                            value={energyForm.insulation}
                            onChange={(e) => setEnergyForm({ ...energyForm, insulation: e.target.value })}
                            className={inputClasses}
                            required
                          />
                        </div>
                      </label>
                    </div>

                    <div>
                      <label className={labelClasses}>
                        Heating/Cooling Systems
                        <div className="relative mt-1">
                          <Thermometer className={iconClasses} size={20} />
                          <input
                            type="number"
                            name="heating_cooling_systems"
                            placeholder="Number of heating/cooling systems"
                            value={energyForm.heating_cooling_systems}
                            onChange={(e) => setEnergyForm({ ...energyForm, heating_cooling_systems: e.target.value })}
                            className={inputClasses}
                            required
                          />
                        </div>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isPredicting}
                        className="w-full bg-yellow-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isPredicting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Predicting...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5" />
                            <span>Predict Energy Usage</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>

                  <AnimatePresence>
                    {energyResult && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-8 bg-gray-700/50 rounded-xl p-6"
                      >
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-gray-400 mb-1">Predicted Monthly Bill</div>
                            <div className="text-4xl font-bold text-white">
                              ₹{energyResult.predicted_energy}
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-gray-600">
                            <div className="text-gray-400 text-sm">Per Room Cost</div>
                            <div className="text-white text-xl">₹{energyResult.predicted_energy_divided}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {activeTab === 'tips' && (
                <motion.div
                  key="tips"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {energyTips.map((tip, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-xl p-6 flex items-start gap-4">
                      <div className="text-yellow-400 flex-shrink-0">
                        {tip.icon}
                      </div>
                      <p className="text-gray-300">{tip.tip}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'usage' && (
                <motion.div
                  key="usage"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {usagePatterns.map((pattern, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-xl p-6">
                      <h3 className="text-white font-medium mb-2">{pattern.time}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          pattern.usage === 'High' ? 'bg-orange-600' :
                          pattern.usage === 'Very High' ? 'bg-red-600' :
                          pattern.usage === 'Moderate' ? 'bg-yellow-600' :
                          'bg-green-600'
                        } text-white`}>
                          {pattern.usage}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{pattern.description}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* History Section */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <History size={20} />
                  Recent Predictions
                </h2>
                <button
                  onClick={clearHistory}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  title="Clear history"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((prediction) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gray-700/50 rounded-xl p-4 hover:bg-gray-700/70 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-white font-medium">
                          ₹{prediction.prediction}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {prediction.rooms} rooms, {prediction.people} people
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Clock size={14} />
                        {new Date(prediction.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <div>Per Room: ₹{prediction.perRoom}</div>
                      <div>Systems: {prediction.systems}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;