import { useState, useEffect } from 'react';
import axios from 'axios';
import { getLocalStorage } from '../services/Storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const currencies = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '\u20AC' },
  { code: 'GBP', symbol: '\u00A3' },
  { code: 'JPY', symbol: '\u00A5' },
];

const tipPresets = [10, 15, 20, 25];

function BillSplitter() {
  const [bill, setBill] = useState('');
  const [people, setPeople] = useState('');
  const [tip, setTip] = useState('');
  const [perPerson, setPerPerson] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [showDetails, setShowDetails] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const user = getLocalStorage('userDetail');
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_URL}/api/data/splits`, { params: { userId } })
      .then(r => setHistory(r.data)).catch(console.error)
      .finally(() => setLoadingHistory(false));
  }, [userId]);

  const calculateSplit = async () => {
    setIsCalculating(true);
    try {
      const total = parseFloat(bill);
      const numPeople = parseInt(people);
      const tipAmount = (parseFloat(tip || 0) / 100) * total;
      const totalWithTip = total + tipAmount;
      if (!isNaN(totalWithTip) && numPeople > 0) {
        const amountPerPerson = Number((totalWithTip / numPeople).toFixed(2));
        setPerPerson(amountPerPerson);
        setShowDetails(true);
        if (userId) {
          await axios.post(`${API_URL}/api/data/splits`, {
            userId, amount: total, people: numPeople, tipPercent: parseFloat(tip || 0),
            tipAmount, totalWithTip, perPerson: amountPerPerson, currency: selectedCurrency.code,
          });
          const r = await axios.get(`${API_URL}/api/data/splits`, { params: { userId } });
          setHistory(r.data);
        }
      }
    } catch (error) {
      console.error('Save split failed:', error);
    }
    setIsCalculating(false);
  };

  return (
    <div className="p-gutter max-w-container-max mx-auto">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-primary">Money Splitter</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">Fair division for every shared expense.</p>
        </div>
        <button className="flex items-center gap-base bg-primary text-on-primary px-lg py-sm rounded-xl font-label-md hover:opacity-90 transition-opacity active:scale-95 shadow-sm">
          <span className="material-symbols-outlined">add</span>
          New Split
        </button>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm h-full">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-headline-sm font-headline-sm">Calculator</h3>
              <span className="material-symbols-outlined text-secondary">calculate</span>
            </div>
            <div className="space-y-md">
              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Bill Amount ({selectedCurrency.symbol})</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary" type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Number of People</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary" type="number" value={people} onChange={(e) => setPeople(e.target.value)} placeholder="2" />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Tip %</label>
                <div className="flex gap-xs flex-wrap">
                  {tipPresets.map((p) => (
                    <button key={p} onClick={() => setTip(p.toString())} className={`px-3 py-1 rounded-full text-label-sm font-label-sm transition-colors ${tip === p.toString() ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                      {p}%
                    </button>
                  ))}
                </div>
                <input className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary mt-xs" type="number" value={tip} onChange={(e) => setTip(e.target.value)} placeholder="Custom %" />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Currency</label>
                <select className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary" value={selectedCurrency.code} onChange={(e) => setSelectedCurrency(currencies.find(c => c.code === e.target.value) || currencies[0])}>
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                  ))}
                </select>
              </div>
              <button onClick={calculateSplit} disabled={isCalculating || !bill || !people} className="w-full bg-primary text-on-primary py-md rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
                {isCalculating ? 'Calculating...' : 'Calculate Split'}
              </button>
            </div>
          </div>

          {showDetails && perPerson !== null && (
            <div className="bg-primary-container text-on-primary-container rounded-xl p-md shadow-sm">
              <p className="text-label-md font-label-md opacity-70 mb-xs">Per Person</p>
              <p className="text-headline-lg font-headline-lg text-secondary-fixed">{selectedCurrency.symbol}{perPerson.toFixed(2)}</p>
              <div className="mt-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-secondary-fixed text-sm">trending_up</span>
                <span className="text-label-sm font-label-sm text-secondary-fixed">
                  Total: {selectedCurrency.symbol}{(parseFloat(bill) * (1 + parseFloat(tip || 0) / 100)).toFixed(2)} with {parseInt(people)} people
                </span>
              </div>
            </div>
          )}

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-headline-sm font-headline-sm">Recent Splits</h3>
              <span className="material-symbols-outlined text-secondary">sync_alt</span>
            </div>
            <div className="flex flex-col gap-md">
              {history.length === 0 ? (
                <p className="text-body-sm font-body-sm text-on-surface-variant text-center py-4">No splits yet. Use the calculator to create one.</p>
              ) : history.slice(0, 3).map((h, i) => (
                <div key={h.id || i} className="flex items-center justify-between p-sm rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center font-bold text-label-md">{(h.currency || '₹')}</div>
                    <div>
                      <p className="text-label-md font-label-md">₹{Number(h.amount).toFixed(2)} split</p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">{h.people} people &bull; {h.tip_percent || 0}% tip</p>
                    </div>
                  </div>
                  <span className="text-label-md font-label-md text-secondary">₹{Number(h.per_person).toFixed(2)}/ea</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-8 flex flex-col gap-md">
          <div className="flex items-center justify-between">
            <h3 className="text-headline-sm font-headline-sm">All Splits</h3>
            <div className="flex gap-sm">
              <button className="p-base rounded-full hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
              <button className="p-base rounded-full hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined">search</span></button>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex items-center justify-center h-32 shadow-sm">
              <p className="text-body-sm font-body-sm text-on-surface-variant">No split history yet</p>
            </div>
          ) : history.map((h) => (
            <div key={h.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col md:flex-row items-start md:items-center gap-md shadow-sm group hover:border-primary/30 transition-all">
              <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-headline-md">call_split</span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-sm mb-xs">
                  <h4 className="text-headline-sm font-headline-sm">₹{Number(h.amount).toFixed(2)} Split</h4>
                  <span className="px-base py-xs bg-surface-variant text-on-surface-variant text-label-sm font-label-sm rounded-full">{h.people} people</span>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">{h.currency || 'USD'} &bull; {new Date(h.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-headline-sm font-headline-sm text-primary">₹{Number(h.per_person).toFixed(2)}</p>
                <p className="text-label-sm font-label-sm text-secondary font-bold">per person</p>
              </div>
              <button className="p-base rounded-full hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
          ))}

          <div className="relative overflow-hidden rounded-xl h-48 group cursor-pointer">
            <img
              alt="Financial Growth"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrF33FgKADT7YiyWov9zSNic7tehnIWo3J4AHwBhZmpkgkzo7FY5uBvv5V6pPOUV1xw_-hIVOAaqkCwdWaBXBpw0BRMQ2VdRVLm961G_IZnuhaVyWvCitNjFfVYARYrUCc0_-GTvhyXeAb4GGMXAR_84UaU_8eeNAAJGwCiJ6MDhsZnPHVvHa_RSkjCDH2wEy2Z99R0I9dYYPe61-4KbGF3qzdHcjo3D-WI-pohUI5zU03_wTM27oz6M4xHkoG9_lpSPtvtD4uAt4"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex flex-col justify-center px-lg">
              <h4 className="text-headline-md font-headline-md text-white">Smart Split Insights</h4>
              <p className="text-body-md font-body-md text-white/80 max-w-xs">Billy AI noticed you're often paying for groceries. Want to set up a recurring split?</p>
              <button className="mt-md bg-white text-primary w-fit px-base py-xs rounded-lg font-label-md text-label-sm active:scale-95 transition-all">Check Suggestions</button>
            </div>
          </div>

          {history.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
              <h3 className="text-headline-sm font-headline-sm mb-md">Split History</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.slice(-3).reverse().map((p) => (
                  <div key={p.id} className="bg-surface-container-low rounded-lg p-md border border-outline-variant">
                    <p className="font-bold text-headline-sm text-primary">{p.currency || '₹'}{Number(p.amount).toFixed(2)}</p>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">{p.people} people, {p.tip_percent || 0}% tip</p>
                    <p className="text-label-sm font-label-sm text-outline">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default BillSplitter;
