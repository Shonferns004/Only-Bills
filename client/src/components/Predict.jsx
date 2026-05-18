import { useState, useEffect } from 'react';
import axios from 'axios';
import { getLocalStorage } from '../services/Storage';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

function Predict() {
  const [energyForm, setEnergyForm] = useState({ size: '', people: '', insulation: '', heating_cooling_systems: '' });
  const [energyResult, setEnergyResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const user = getLocalStorage('userDetail');
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_URL}/api/data/predictions`, { params: { userId } })
      .then(r => {
        setHistory(r.data);
        if (r.data.length > 0 && !energyResult) {
          setEnergyResult({ predicted_energy: r.data[0].predicted_amount, predicted_energy_divided: r.data[0].per_room });
        }
      }).catch(console.error)
      .finally(() => setLoadingHistory(false));
  }, [userId]);

  const handleEnergyPredict = async (e) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await axios.post(`${API_URL}/api/predict`, energyForm);
      setEnergyResult(res.data);
      if (userId) {
        await axios.post(`${API_URL}/api/data/predictions`, {
          userId, rooms: Number(energyForm.size), people: Number(energyForm.people),
          appliances: Number(energyForm.insulation), systems: Number(energyForm.heating_cooling_systems),
          predictedAmount: res.data.predicted_energy, perRoom: res.data.predicted_energy_divided,
        });
        const upd = await axios.get(`${API_URL}/api/data/predictions`, { params: { userId } });
        setHistory(upd.data);
      }
    } catch (error) {
      console.error('Prediction failed:', error);
    }
    setIsPredicting(false);
  };

  const usageBreakdown = [
    { label: 'Heating/Cooling', percent: 45, color: 'bg-secondary' },
    { label: 'Appliances', percent: 30, color: 'bg-surface-dim' },
    { label: 'Lighting', percent: 15, color: 'bg-primary-fixed-dim' },
    { label: 'Other', percent: 10, color: 'bg-outline-variant' },
  ];

  return (
    <div className="p-gutter lg:p-xl">
      <div className="max-w-container-max mx-auto">
        <div className="mb-lg">
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Electricity Bill Predictor</h1>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl">Use our advanced forecasting engine to estimate your next bill and discover ways to optimize your energy consumption.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-md card-shadow">
            <div className="flex items-center gap-base mb-md">
              <span className="material-symbols-outlined text-secondary">settings_input_component</span>
              <h3 className="text-headline-sm font-headline-sm">Input Parameters</h3>
            </div>
            <form onSubmit={handleEnergyPredict} className="space-y-lg">
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-xs">Number of Rooms</label>
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g. 3"
                  type="number"
                  value={energyForm.size}
                  onChange={(e) => setEnergyForm({ ...energyForm, size: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-xs">Occupants</label>
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g. 4"
                  type="number"
                  value={energyForm.people}
                  onChange={(e) => setEnergyForm({ ...energyForm, people: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-xs">Heavy Appliances</label>
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g. 5"
                  type="number"
                  value={energyForm.insulation}
                  onChange={(e) => setEnergyForm({ ...energyForm, insulation: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-xs">Heating/Cooling Systems</label>
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g. 2"
                  type="number"
                  value={energyForm.heating_cooling_systems}
                  onChange={(e) => setEnergyForm({ ...energyForm, heating_cooling_systems: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isPredicting}
                className="w-full bg-primary text-on-primary py-md rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isPredicting ? 'Predicting...' : 'Calculate Prediction'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md card-shadow flex-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-gutter">
                <span className="bg-secondary-container text-on-secondary-container text-label-sm font-label-sm px-sm py-xs rounded-full">High Accuracy</span>
              </div>
              <h3 className="text-label-md font-label-md text-on-surface-variant mb-lg">PREDICTED NEXT BILL</h3>
              <div className="flex flex-col items-center justify-center py-lg">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12" />
                    <circle className="text-secondary" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502.4" strokeDashoffset="150" strokeWidth="12" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2 overflow-hidden">
                    <span className="text-headline-sm font-headline-sm truncate max-w-full">{energyResult ? `₹${Number(energyResult.predicted_energy).toLocaleString('en-IN')}` : '---'}</span>
                    {energyResult && <span className="text-label-sm font-label-sm text-secondary">Estimated next bill</span>}
                    {!energyResult && <span className="text-label-sm font-label-sm text-on-surface-variant">Enter values</span>}
                  </div>
                </div>
              </div>
              <div className="mt-md p-md bg-surface-container-low rounded-lg border border-outline-variant">
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  {energyResult
                    ? `Per room cost: ₹${energyResult.predicted_energy_divided}`
                    : 'Based on your inputs, the prediction will appear here.'}
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md card-shadow">
              <div className="flex justify-between items-center mb-md">
                <h4 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Historical Trend</h4>
                <span className="material-symbols-outlined text-on-surface-variant">trending_up</span>
              </div>
              <div className="h-24 w-full flex items-end gap-xs">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-1 bg-surface-container-high rounded-t-sm" style={{ height: `${[50, 66, 33, 75][i]}%` }} />
                ))}
                <div className="flex-1 bg-secondary h-full rounded-t-sm relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-secondary">Predicted</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-md card-shadow">
            <h3 className="text-headline-sm font-headline-sm mb-md">Usage Breakdown</h3>
            <div className="space-y-md">
              {usageBreakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-sm">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-body-sm font-body-sm">{item.label}</span>
                  </div>
                  <span className="font-bold">{item.percent}%</span>
                </div>
              ))}
            </div>
            <div className="mt-lg pt-md border-t border-outline-variant">
              <img
                alt="Efficiency"
                className="w-full h-32 object-cover rounded-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkkn80lQXCVbeiO9ndMhRWtl7tOrxnPfGua9egTM3G8_FyNHNGIKA-z-CdDm_qgXyGv-NI1tRRZuWUrW2GNJWDzamGKgN5px70OREgUoQKjiqrNPvwJpltloW7O1QDsfOXV_NwSiXV8eRqUhIAC4z-tDfd5Xql2tlkGcy8RJh__aVA9qMSMpUDqpJBFxRkNNXD1c6gpk4_BuQ8cYPmV3jhp5DZtfoX1VvDWiZgFHorg3wgCj5iuMKQpmnfOdpetBoJS3vnztR2DvQ"
              />
            </div>
          </div>

          <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-md card-shadow">
            <div className="flex items-center justify-between mb-md">
              <h3 className="text-headline-sm font-headline-sm">Reduction Tips</h3>
              <button className="text-label-md font-label-md text-secondary hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="flex gap-md p-sm bg-secondary-container/10 border border-secondary-container rounded-lg">
                <span className="material-symbols-outlined text-secondary shrink-0">lightbulb</span>
                <div>
                  <h4 className="text-label-md font-label-md text-primary">Switch to LED</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Converting remaining bulbs could save you up to ₹15/month.</p>
                </div>
              </div>
              <div className="flex gap-md p-sm border border-outline-variant rounded-lg hover:border-secondary transition-all">
                <span className="material-symbols-outlined text-on-surface-variant shrink-0">thermostat</span>
                <div>
                  <h4 className="text-label-md font-label-md text-primary">Optimize AC</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Increasing temp by 2° during peak hours saves ~8%.</p>
                </div>
              </div>
              <div className="flex gap-md p-sm border border-outline-variant rounded-lg hover:border-secondary transition-all">
                <span className="material-symbols-outlined text-on-surface-variant shrink-0">timer</span>
                <div>
                  <h4 className="text-label-md font-label-md text-primary">Off-Peak Laundry</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Shift laundry to after 9 PM for lower utility rates.</p>
                </div>
              </div>
              <div className="flex gap-md p-sm border border-outline-variant rounded-lg hover:border-secondary transition-all">
                <span className="material-symbols-outlined text-on-surface-variant shrink-0">bolt</span>
                <div>
                  <h4 className="text-label-md font-label-md text-primary">Unplug Idle Tech</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Vampire power costs the average home ₹120 per year.</p>
                </div>
              </div>
            </div>
          </div>

          {history.length > 0 && (
            <div className="lg:col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-md card-shadow">
              <h3 className="text-headline-sm font-headline-sm mb-md">Prediction History</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((p) => (
                  <div key={p.id} className="bg-surface-container-low rounded-lg p-md border border-outline-variant">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-primary font-bold text-headline-sm">₹{Number(p.predicted_amount).toFixed(2)}</div>
                      <span className="text-label-sm font-label-sm text-on-surface-variant">{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-body-sm font-body-sm text-on-surface-variant">
                      {p.rooms} rooms, {p.people} people
                    </div>
                    <div className="text-label-sm font-label-sm text-outline mt-1">
                      Per Room: ₹{Number(p.per_room).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Predict;
