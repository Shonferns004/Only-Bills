import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getLocalStorage } from '../services/Storage';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

const categories = [
  { value: 'salary', label: 'Salary', icon: 'payments' },
  { value: 'food', label: 'Food', icon: 'restaurant' },
  { value: 'utilities', label: 'Utilities', icon: 'bolt' },
  { value: 'rent', label: 'Rent', icon: 'home' },
  { value: 'shopping', label: 'Shopping', icon: 'shopping_cart' },
  { value: 'transport', label: 'Transport', icon: 'directions_car' },
  { value: 'entertainment', label: 'Entertainment', icon: 'celebration' },
  { value: 'health', label: 'Health', icon: 'local_hospital' },
  { value: 'education', label: 'Education', icon: 'school' },
  { value: 'other', label: 'Other', icon: 'receipt' },
];

function Transactions() {
  const navigate = useNavigate();
  const user = getLocalStorage('userDetail');
  const userId = user?.id;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const fetchTransactions = () => {
    if (!userId) return;
    axios.get(`${API_URL}/api/data/transactions`, { params: { userId } })
      .then(r => setTransactions(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !amount || !description) return;
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/data/transactions`, {
        userId, type, amount: parseFloat(amount), description, category, date,
      });
      setAmount('');
      setDescription('');
      setCategory('other');
      setType('expense');
      setDate(new Date().toISOString().split('T')[0]);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to save transaction:', error?.response?.data || error.message);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/data/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="p-gutter max-w-container-max mx-auto w-full">
      <div className="flex items-center gap-sm mb-lg">
        <button onClick={() => navigate('/home')} className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary">Transactions</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Track your income and expenses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-4 space-y-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
            <h3 className="text-headline-sm font-headline-sm mb-md">Add Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-md">
              <div className="flex gap-sm">
                <button type="button" onClick={() => setType('expense')} className={`flex-1 py-sm rounded-lg font-label-md text-label-md transition-all ${type === 'expense' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                  <span className="material-symbols-outlined text-[18px] align-middle mr-xs">remove_circle</span>
                  Expense
                </button>
                <button type="button" onClick={() => setType('income')} className={`flex-1 py-sm rounded-lg font-label-md text-label-md transition-all ${type === 'income' ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                  <span className="material-symbols-outlined text-[18px] align-middle mr-xs">add_circle</span>
                  Income
                </button>
              </div>

              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Amount (₹)</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
              </div>

              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Description</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What for?" required />
              </div>

              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Category</label>
                <select className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div className="space-y-xs">
                <label className="text-label-md font-label-md text-on-surface-variant block">Date</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>

              <button type="submit" disabled={submitting || !amount || !description} className="w-full bg-primary text-on-primary py-md rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
                {submitting ? 'Adding...' : `${type === 'income' ? 'Add Income' : 'Add Expense'}`}
              </button>
            </form>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
            <div className="flex justify-between items-center mb-sm">
              <span className="text-label-md font-label-md text-on-surface-variant">Summary</span>
            </div>
            <div className="space-y-xs">
              <div className="flex justify-between">
                <span className="text-body-sm font-body-sm text-secondary">Income</span>
                <span className="text-body-sm font-body-sm font-bold text-secondary">+₹{totalIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-sm font-body-sm text-primary">Expenses</span>
                <span className="text-body-sm font-body-sm font-bold text-primary">-₹{totalExpense.toFixed(2)}</span>
              </div>
              <div className="border-t border-outline-variant/30 pt-xs flex justify-between">
                <span className="text-label-md font-label-md">Balance</span>
                <span className={`text-label-md font-label-md font-bold ${totalIncome - totalExpense >= 0 ? 'text-secondary' : 'text-error'}`}>
                  ₹{(totalIncome - totalExpense).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
          <div className="flex items-center justify-between mb-md">
            <h3 className="text-headline-sm font-headline-sm">All Transactions</h3>
            <span className="text-label-sm font-label-sm text-on-surface-variant">{transactions.length} entries</span>
          </div>

          {loading ? (
            <div className="space-y-sm">
              {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-14 w-full" />)}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-xl text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-sm">receipt_long</span>
              <p className="text-body-md font-body-md">No transactions yet</p>
              <p className="text-body-sm font-body-sm">Add your first transaction using the form</p>
            </div>
          ) : (
            <div className="space-y-sm">
              {transactions.map((t) => {
                const cat = categories.find(c => c.value === t.category) || categories[categories.length - 1];
                return (
                  <div key={t.id} className="flex items-center gap-sm p-sm rounded-lg hover:bg-surface-container-low transition-colors group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-secondary-container/20 text-secondary' : 'bg-surface-container-high text-primary'}`}>
                      <span className="material-symbols-outlined">{cat.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-label-md font-label-md truncate">{t.description}</p>
                      <p className="text-body-sm font-body-sm text-on-surface-variant">{t.date} &bull; {cat.label}</p>
                    </div>
                    <span className={`text-label-md font-label-md shrink-0 ${t.type === 'income' ? 'text-secondary' : 'text-primary'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toFixed(2)}
                    </span>
                    <button onClick={() => handleDelete(t.id)} className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-error/10 transition-all">
                      <span className="material-symbols-outlined text-error text-[18px]">delete</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transactions;
