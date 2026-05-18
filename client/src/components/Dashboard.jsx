import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getLocalStorage } from '../services/Storage';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

function Dashboard() {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [txs, setTxs] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [splits, setSplits] = useState([]);

  useEffect(() => {
    const user = getLocalStorage('userDetail');
    const id = user?.id || '';
    setUserName(user?.displayName || '');
    setUserId(id);
    if (!id) { setLoading(false); return; }
    Promise.all([
      axios.get(`${API_URL}/api/data/transactions`, { params: { userId: id } }),
      axios.get(`${API_URL}/api/data/predictions`, { params: { userId: id } }),
      axios.get(`${API_URL}/api/data/plans`, { params: { userId: id } }),
      axios.get(`${API_URL}/api/data/splits`, { params: { userId: id } }),
    ])
      .then(([txRes, predRes, planRes, splitRes]) => {
        setTxs(txRes.data || []);
        setPredictions(predRes.data || []);
        setPlans(planRes.data || []);
        setSplits(splitRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const incomes = txs.filter(t => t.type === 'income');
    const expenses = txs.filter(t => t.type === 'expense');
    const totalIncome = incomes.reduce((s, t) => s + Number(t.amount), 0);
    const totalExpenses = expenses.reduce((s, t) => s + Number(t.amount), 0);
    const totalBalance = totalIncome - totalExpenses;
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const monthlyExpenses = expenses.filter(t => {
      const d = new Date(t.date || t.created_at);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });
    const monthlySpending = monthlyExpenses.reduce((s, t) => s + Number(t.amount), 0);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingExpenses = expenses.filter(t => {
      if (!t.date) return false;
      const d = new Date(t.date);
      return d >= now && d <= nextWeek;
    });
    const upcomingTotal = upcomingExpenses.reduce((s, t) => s + Number(t.amount), 0);
    return { totalBalance, monthlySpending, upcomingTotal, totalIncome, totalExpenses, expenses };
  }, [txs]);

  const chartData = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const buckets = dayNames.map(() => 0);
    stats.expenses.forEach(t => {
      const d = t.date ? new Date(t.date) : new Date(t.created_at);
      const day = d.getDay();
      buckets[day] += Number(t.amount);
    });
    const max = Math.max(...buckets, 1);
    return dayNames.map((day, i) => ({
      day,
      height: max > 0 ? (buckets[i] / max) * 85 : 0,
      amount: buckets[i],
    }));
  }, [stats]);

  const recentTransactions = txs.slice(0, 5).map(t => ({
    type: t.type,
    amount: Number(t.amount).toFixed(2),
    description: t.description,
    date: t.date || new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    category: t.category || 'other',
  }));

  const upcomingPredictions = predictions.slice(0, 3);
  const latestPlan = plans.length > 0 ? plans[0] : null;
  const planCategories = useMemo(() => {
    if (!latestPlan || !latestPlan.budget_json) return [];
    try {
      const raw = JSON.parse(latestPlan.budget_json);
      if (Array.isArray(raw)) return raw;
      if (raw && typeof raw === 'object') {
        return Object.entries(raw).map(([name, amount]) => ({
          name,
          goal: Number(amount),
          spent: 0,
        }));
      }
      return [];
    }
    catch { return []; }
  }, [latestPlan]);
  const planTotalSpent = planCategories.reduce((s, c) => s + Number(c.spent || 0), 0);
  const planRemaining = latestPlan ? Number(latestPlan.income) - planTotalSpent : 0;
  const recentSplits = splits.slice(0, 3);

  return (
    <div className="p-gutter max-w-container-max mx-auto w-full space-y-xl">
      <div className="mb-6">
        <h1 className="text-headline-lg font-headline-lg text-primary">
          Welcome{userName ? `, ${userName}` : ''}
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant">Here's your financial overview</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-label-md font-label-md text-on-surface-variant">Total Balance</span>
            <h2 className="text-headline-lg font-headline-lg text-primary mt-xs">
              {loading ? '---' : `₹${stats.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h2>
          </div>
          <div className="flex justify-between items-end mt-lg">
            <span className="text-label-sm font-label-sm px-2 py-1 bg-secondary-container text-on-secondary-container rounded-full">
              {stats.totalIncome > 0 ? `+${((stats.totalIncome - stats.totalExpenses) / stats.totalIncome * 100).toFixed(1)}% net` : 'No data'}
            </span>
            <div className="w-16 h-8 bg-secondary-container/20 rounded-lg overflow-hidden relative">
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,80 Q25,20 50,60 T100,20" fill="none" stroke="#006c49" strokeWidth="4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-label-md font-label-md text-on-surface-variant">Upcoming Bills (7 Days)</span>
            <h2 className="text-headline-lg font-headline-lg text-error mt-xs">
              {loading ? '---' : `₹${stats.upcomingTotal.toFixed(2)}`}
            </h2>
          </div>
          <div className="mt-lg flex items-center gap-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-body-sm">event</span>
            <span className="text-body-sm font-body-sm">
              {loading ? 'Loading...' : `${txs.filter(t => {
                if (!t.date) return false;
                const d = new Date(t.date);
                const now = new Date();
                const nextWeek = new Date(now);
                nextWeek.setDate(nextWeek.getDate() + 7);
                return d >= now && d <= nextWeek && t.type === 'expense';
              }).length} bills pending`}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-label-md font-label-md text-on-surface-variant">Monthly Spending</span>
            <h2 className="text-headline-lg font-headline-lg text-primary mt-xs">
              {loading ? '---' : `₹${stats.monthlySpending.toFixed(2)}`}
            </h2>
          </div>
          <div className="flex justify-between items-end mt-lg">
            <span className="text-label-sm font-label-sm px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded-full">
              {stats.totalIncome > 0 ? `${Math.round((stats.monthlySpending / stats.totalIncome) * 100)}% of income` : 'No data'}
            </span>
            <div className="w-24 h-2 bg-outline-variant rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: `${stats.totalIncome > 0 ? Math.min(100, (stats.monthlySpending / stats.totalIncome) * 100) : 0}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm">
          <div className="flex justify-between items-center mb-lg">
            <div>
              <h3 className="text-headline-sm font-headline-sm text-primary">Spending Trends</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Daily analysis of your financial outflows</p>
            </div>
            <select className="bg-surface border-outline-variant text-label-md rounded-lg py-1 px-3 focus:ring-primary focus:border-primary">
              <option>This Month</option>
            </select>
          </div>
          <div className="h-[300px] flex items-end justify-between gap-2 pt-4">
            {chartData.map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-2 flex-1 min-w-0 group">
                <div className="w-full min-h-[4px] bg-secondary-container/30 group-hover:bg-secondary-container transition-colors rounded-t-sm" style={{ height: `${item.height || 4}%` }} />
                <span className="text-label-sm font-label-sm text-outline">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="text-headline-sm font-headline-sm text-primary">Recent</h3>
            <a className="text-label-md font-label-md text-secondary hover:underline transition-all" href="#">View All</a>
          </div>
          {loading ? (
            <div className="space-y-md flex-1">
              {[1,2,3].map(i => <div key={i} className="skeleton h-14 w-full" />)}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-body-sm font-body-sm text-on-surface-variant">No transactions yet</div>
          ) : (
            <div className="space-y-md flex-1">
              {recentTransactions.map((tx, i) => (
                <div key={i} className="flex items-center gap-sm p-base hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    tx.type === 'income' ? 'bg-secondary-container/20 text-secondary group-hover:bg-secondary-container' : 'bg-surface-container-high text-primary group-hover:bg-white'
                  }`}>
                    <span className="material-symbols-outlined">{tx.type === 'income' ? 'payments' : tx.category === 'utilities' ? 'electric_bolt' : tx.category === 'food' ? 'restaurant' : tx.category === 'shopping' ? 'shopping_cart' : 'receipt'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-label-md font-label-md truncate">{tx.description}</p>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">{tx.date}</p>
                  </div>
                  <span className={`text-label-md font-label-md shrink-0 ${tx.type === 'income' ? 'text-secondary' : 'text-primary'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link to="/transactions" className="block mt-lg w-full py-2 bg-primary text-on-primary rounded-lg font-label-md text-center hover:opacity-90 active:scale-95 transition-all">
            Add Transaction
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="relative rounded-xl overflow-hidden min-h-[240px] flex items-center px-lg border border-outline-variant">
          <img
            alt="Financial background"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3mUNfN98DLoiN4Ee-R-NjZNfzrpQ193zytjXRdxB3DjWDx_w-T0aFiryliO7QVtI2SU_NwBrOiZPJocDwRWjzo0ODH4NFQWp4vQgcFQLKZHGaYdGN3huL1TzQU9y0xbG7an5MlKYOF-dyqTv0OHhI2Rb72ffZDwqwT_k5lJ6G-9Dr9S48JxQaNjt5jUvP6-9LJ8tVToEMtzSr0BW6toK5rWWBIrdx8bA5T0iyy7oeVqtQVYuZbZUwGo4MggGS4KI3De1jGI8o1GE"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
          <div className="relative z-10 text-white space-y-sm">
            <h4 className="text-headline-md font-headline-md">Smart Predictions</h4>
            <p className="text-body-md font-body-md opacity-90 max-w-xs">
              {upcomingPredictions.length > 0
                ? `Your last prediction was ₹${Number(upcomingPredictions[0].predicted_amount).toFixed(2)}`
                : 'Use the Predictor to forecast your energy bills'}
            </p>
            <p className="text-label-sm font-label-sm opacity-80">{predictions.length} prediction{predictions.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-sm mb-sm">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">account_balance_wallet</span>
              </div>
              <h4 className="text-headline-sm font-headline-sm">Budget Snapshot</h4>
            </div>
            {loading ? (
              <div className="space-y-sm">
                <div className="skeleton h-12 w-full" />
                <div className="skeleton h-8 w-3/4" />
              </div>
            ) : latestPlan ? (
              <>
                <p className="text-label-md font-label-md text-on-surface-variant">Monthly Income</p>
                <p className="text-headline-md font-headline-md text-primary mb-sm">₹{Number(latestPlan.income).toFixed(2)}</p>
                <div className="flex justify-between text-label-sm font-label-sm text-on-surface-variant mb-sm">
                  <span>{planCategories.length} categories</span>
                  <span>Remaining: ₹{planRemaining.toFixed(2)}</span>
                </div>
                <div className="w-full bg-outline-variant h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: `${Math.min(100, (planTotalSpent / Number(latestPlan.income)) * 100)}%` }} />
                </div>
                {latestPlan.advice && (
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-sm line-clamp-2">{latestPlan.advice}</p>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-24 text-body-sm font-body-sm text-on-surface-variant">
                No budget plan yet. Create one in Planner.
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-sm mb-sm">
              <div className="w-10 h-10 rounded-lg bg-primary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">call_split</span>
              </div>
              <h4 className="text-headline-sm font-headline-sm">Recent Splits</h4>
            </div>
            {loading ? (
              <div className="space-y-sm">
                {[1,2,3].map(i => <div key={i} className="skeleton h-10 w-full" />)}
              </div>
            ) : recentSplits.length > 0 ? (
              <div className="space-y-sm">
                {recentSplits.map((s, i) => (
                  <div key={s.id || i} className="flex items-center justify-between p-sm rounded-lg bg-surface-container-low">
                    <div>
                      <p className="text-label-sm font-label-sm">₹{Number(s.amount).toFixed(2)} split</p>
                      <p className="text-body-xs font-body-xs text-on-surface-variant">{s.people} people &bull; {new Date(s.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-label-sm font-label-sm text-secondary">₹{Number(s.per_person).toFixed(2)}/ea</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-body-sm font-body-sm text-on-surface-variant">
                No splits yet. Use the Splitter.
              </div>
            )}
          </div>
          <div className="flex items-center gap-md mt-md pt-md border-t border-outline-variant/30">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-body-sm text-primary">analytics</span>
              <span className="text-label-sm font-label-sm">{predictions.length} prediction{predictions.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-body-sm text-secondary">savings</span>
              <span className="text-label-sm font-label-sm">{txs.length} transaction{txs.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
