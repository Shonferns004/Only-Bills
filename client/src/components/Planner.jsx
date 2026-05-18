import { useState, useEffect } from 'react';
import axios from 'axios';
import { getLocalStorage } from '../services/Storage';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

function Planner() {
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
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const user = getLocalStorage('userDetail');
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    setLoadingHistory(true);
    axios.get(`${API_URL}/api/data/plans`, { params: { userId } })
      .then(r => {
        setHistory(r.data);
        if (r.data.length > 0 && !result) {
          const latest = r.data[0];
          setIncome(String(latest.income));
          setNumFamilyMembers(String(latest.num_family_members));
          setMaritalStatus(latest.marital_status);
          setNumChildren(String(latest.num_children || 0));
          setHasRent(latest.has_rent || 'no');
          setRentAmount(String(latest.rent_amount || 0));
          setHasVehicle(latest.has_vehicle || 'no');
          setPetrolExpense(String(latest.petrol_expense || 0));
          try {
            const budget = typeof latest.budget_json === 'string' ? JSON.parse(latest.budget_json) : latest.budget_json;
            setResult({ budget, gemini_advice: latest.advice, income: latest.income });
          } catch {}
          setShowForm(false);
        }
      }).catch(console.error)
      .finally(() => setLoadingHistory(false));
  }, [userId]);

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
      const response = await axios.post(`${API_URL}/api/budget`, data);
      setResult(response.data);
      setShowForm(false);
      if (userId) {
        await axios.post(`${API_URL}/api/data/plans`, {
          userId, income: data.income, numFamilyMembers: data.num_family_members,
          maritalStatus, numChildren: data.num_children, hasRent, rentAmount: data.rent_amount,
          hasVehicle, petrolExpense: data.petrol_expense,
          budgetJson: JSON.stringify(response.data.budget), advice: response.data.gemini_advice,
        });
        const upd = await axios.get(`${API_URL}/api/data/plans`, { params: { userId } });
        setHistory(upd.data);
      }
    } catch (error) {
      console.error('Budget plan save failed:', error?.response?.data || error.message);
    }
    setIsLoading(false);
  };

  const incomeVal = parseFloat(income) || 0;
  const rentVal = parseFloat(rentAmount) || 0;
  const petrolVal = parseFloat(petrolExpense) || 0;
  const totalSpent = rentVal + petrolVal;
  const remaining = incomeVal - totalSpent;

  const iconMap = {
    'Housing (Rent)': 'home',
    'Food': 'restaurant',
    'Children': 'child_care',
    'Transportation (Petrol)': 'directions_car',
    'Utilities (Electricity, Water, Gas)': 'bolt',
    'Savings & Investments': 'savings',
    'Entertainment & Leisure': 'celebration',
    'Miscellaneous': 'more_horiz',
  };
  const colorMap = {
    'Housing (Rent)': 'bg-primary',
    'Food': 'bg-secondary',
    'Children': 'bg-tertiary-fixed-dim',
    'Transportation (Petrol)': 'bg-surface-dim',
    'Utilities (Electricity, Water, Gas)': 'bg-primary',
    'Savings & Investments': 'bg-secondary',
    'Entertainment & Leisure': 'bg-error',
    'Miscellaneous': 'bg-outline-variant',
  };
  const categories = result?.budget && typeof result.budget === 'object'
    ? Object.entries(result.budget).map(([name, amount]) => ({
        name,
        icon: iconMap[name] || 'receipt',
        spent: Number(amount),
        goal: Number(amount),
        color: colorMap[name] || 'bg-primary',
      }))
    : [
      { name: 'Housing (Rent)', icon: 'home', spent: 1450, goal: 1500, color: 'bg-primary' },
      { name: 'Food', icon: 'restaurant', spent: 420, goal: 800, color: 'bg-secondary' },
      { name: 'Utilities', icon: 'bolt', spent: 210, goal: 350, color: 'bg-primary' },
      { name: 'Entertainment & Leisure', icon: 'celebration', spent: 580, goal: 600, color: 'bg-error' },
    ];

  return (
    <div className="p-gutter max-w-container-max mx-auto w-full flex-1">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-xl">
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow flex flex-col justify-between relative overflow-hidden">
          <div className="z-10">
            <p className="text-label-md font-label-md text-on-surface-variant mb-xs">TOTAL REMAINING</p>
            <h3 className="text-headline-lg font-headline-lg text-primary">
              ₹{showForm ? '---' : (remaining > 0 ? remaining.toFixed(2) : '0.00')}
            </h3>
            <p className="text-body-sm font-body-sm text-secondary flex items-center gap-1 mt-2">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              On track to save more than last month
            </p>
          </div>
          {!showForm && result && (
            <div className="mt-lg flex gap-md items-end z-10">
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant">Budgeted</p>
                <p className="text-headline-sm font-headline-sm">₹{incomeVal.toFixed(2)}</p>
              </div>
              <div className="h-10 w-[1px] bg-outline-variant mb-1" />
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant">Spent</p>
                <p className="text-headline-sm font-headline-sm text-on-surface">₹{totalSpent.toFixed(2)}</p>
              </div>
            </div>
          )}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[180px]">account_balance_wallet</span>
          </div>
        </div>

        <div className="md:col-span-4 glass-panel rounded-xl p-md flex flex-col items-center justify-center text-center gap-base card-shadow border-primary/10">
          <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center mb-base">
            <span className="material-symbols-outlined fill">smart_toy</span>
          </div>
          <h4 className="text-headline-sm font-headline-sm">Ask Billy</h4>
          <p className="text-body-sm font-body-sm text-on-surface-variant px-base">&ldquo;Can I afford a new desk this month?&rdquo;</p>
          <button className="mt-base bg-primary text-on-primary px-lg py-sm rounded-full font-label-md text-label-md hover:opacity-90 transition-opacity active:scale-95">Chat Now</button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md card-shadow max-w-2xl mx-auto">
          <h3 className="text-headline-sm font-headline-sm mb-md">Budget Information</h3>
          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Monthly Income (₹)</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary" type="number" value={income} onChange={(e) => setIncome(e.target.value)} required />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Family Members</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary" type="number" value={numFamilyMembers} onChange={(e) => setNumFamilyMembers(e.target.value)} required />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Marital Status</label>
                <select className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                </select>
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Number of Children</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary" type="number" value={numChildren} onChange={(e) => setNumChildren(e.target.value)} required />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Have Rent?</label>
                <select className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary" value={hasRent} onChange={(e) => setHasRent(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              {hasRent === 'yes' && (
                <div className="space-y-xs">
                  <label className="text-label-md font-label-md text-on-surface-variant block">Rent Amount (₹)</label>
                  <input className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary" type="number" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} />
                </div>
              )}
              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Have Vehicle?</label>
                <select className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary" value={hasVehicle} onChange={(e) => setHasVehicle(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              {hasVehicle === 'yes' && (
                <div className="space-y-xs">
                  <label className="text-label-md font-label-md text-on-surface-variant block">Monthly Fuel (₹)</label>
                  <input className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary" type="number" value={petrolExpense} onChange={(e) => setPetrolExpense(e.target.value)} />
                </div>
              )}
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-primary text-on-primary py-md rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
              {isLoading ? 'Calculating...' : 'Generate Budget Plan'}
            </button>
          </form>
        </div>
      ) : result && (
        <>
          <div className="flex justify-between items-center mb-md">
            <h3 className="text-headline-md font-headline-md">Budget Categories</h3>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-xs text-primary font-label-md text-label-md border border-primary px-md py-sm rounded-lg hover:bg-primary hover:text-on-primary transition-all active:scale-95">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {categories.map((cat) => (
              <div key={cat.name} className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant card-shadow">
                <div className="flex justify-between items-start mb-md">
                  <div className="p-base bg-surface-container-high rounded-lg">
                    <span className="material-symbols-outlined text-primary">{cat.icon}</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_vert</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm mb-xs">{cat.name}</h4>
                <div className="flex justify-between text-label-sm font-label-sm text-on-surface-variant mb-base">
                  <span>Spent: ₹{cat.spent}</span>
                  <span>Goal: ₹{cat.goal}</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mb-sm">
                  <div className={`${cat.color} h-full`} style={{ width: `${Math.min(100, (cat.spent / cat.goal) * 100)}%` }} />
                </div>
                <p className={`text-label-sm font-label-sm flex items-center gap-1 ${cat.spent > cat.goal ? 'text-error' : 'text-secondary'}`}>
                  <span className="material-symbols-outlined text-[14px]">{cat.spent > cat.goal ? 'warning' : 'check_circle'}</span>
                  {cat.spent > cat.goal ? `${Math.round((cat.spent / cat.goal) * 100)}% of limit reached` : 'Healthy margin'}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-xl grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md card-shadow">
              <h4 className="text-headline-sm font-headline-sm mb-md">Spending Trends</h4>
              <div className="aspect-video w-full bg-surface-container-low rounded-lg flex items-end justify-between p-md overflow-hidden relative">
                {[40, 55, 45, 75, 60, 85, 65].map((h, i) => (
                  <div key={i} className={`w-8 rounded-t-lg ${i === 3 || i === 5 ? 'bg-secondary' : 'bg-primary'}`} style={{ height: `${h}%` }} />
                ))}
                <div className="absolute inset-0 border-b border-outline-variant/30 flex flex-col justify-between pointer-events-none p-md">
                  <div className="border-t border-outline-variant/20 w-full h-0" />
                  <div className="border-t border-outline-variant/20 w-full h-0" />
                  <div className="border-t border-outline-variant/20 w-full h-0" />
                </div>
              </div>
              <div className="mt-md flex justify-between text-label-sm font-label-sm text-on-surface-variant">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            <div className="bg-primary-container text-on-primary rounded-xl p-md flex flex-col justify-between card-shadow">
              <div>
                <h4 className="text-headline-sm font-headline-sm text-white mb-base">Smart Insight</h4>
                <p className="text-body-md font-body-md text-on-primary-container mb-md leading-relaxed">
                  Based on your current spending pace, you will have <span className="text-secondary-fixed font-bold">₹{Math.max(0, remaining).toFixed(2)}</span> available for your savings goal by the end of the month.
                </p>
              </div>
              {result?.gemini_advice && (
                <div className="p-md bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-sm mb-base">
                    <span className="material-symbols-outlined text-secondary-fixed">lightbulb</span>
                    <p className="text-label-md font-label-md text-white">Suggested Action</p>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-primary-container">{result.gemini_advice}</p>
                </div>
              )}
            </div>
          </div>

          {loadingHistory ? (
            <div className="mt-xl bg-surface-container-lowest border border-outline-variant rounded-xl p-md card-shadow">
              <div className="skeleton h-6 w-40 mb-md" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-surface-container-low rounded-lg p-md border border-outline-variant">
                    <div className="skeleton h-5 w-24 mb-1" />
                    <div className="skeleton h-4 w-32 mb-1" />
                    <div className="skeleton h-3 w-20" />
                  </div>
                ))}
              </div>
            </div>
          ) : history.length > 0 && (
            <div className="mt-xl bg-surface-container-lowest border border-outline-variant rounded-xl p-md card-shadow">
              <h3 className="text-headline-sm font-headline-sm mb-md">Budget History</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.slice(-3).reverse().map((p) => (
                  <div key={p.id} className="bg-surface-container-low rounded-lg p-md border border-outline-variant">
                    <p className="font-bold text-headline-sm text-primary">₹{Number(p.income).toFixed(2)}</p>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">{p.marital_status}, {p.num_family_members} members</p>
                    <p className="text-label-sm font-label-sm text-outline">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Planner;
