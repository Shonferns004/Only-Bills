import React, { useEffect, useState } from 'react';
import { 
  Wallet, 
  Zap, 
  DivideCircle, 
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLocalStorage } from '../services/Storage';

const ToolCard = ({ icon: Icon, title, description }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-800/40 rounded-xl p-5 border border-gray-700/30">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2.5 bg-orange-500/10 rounded-xl">
        <Icon className="w-5 h-5 text-orange-500" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const TransactionItem = ({ type, amount, description, date }) => (
  <div className="flex items-center justify-between py-2.5 px-3 hover:bg-gray-800/20 rounded-xl transition-colors">
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-lg ${type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
        {type === 'income' ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
      </div>
      <div>
        <p className="text-white text-sm font-medium">{description}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
    <p className={`text-sm font-semibold ${type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
      {type === 'income' ? '+' : '-'}${amount}
    </p>
  </div>
);

const BillCard = ({ icon: Icon, title, amount, dueDate }) => (
  <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30">
    <div className="flex items-center gap-2.5 mb-2">
      <Icon className="w-4 h-4 text-orange-500" />
      <h4 className="text-white text-sm font-medium">{title}</h4>
    </div>
    <p className="text-lg font-bold text-white">${amount}</p>
    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
      <Calendar className="w-3.5 h-3.5" />
      <p>Due {dueDate}</p>
    </div>
  </div>
);

function App() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = getLocalStorage('userDetail');
    if (user?.displayName) setUserName(user.displayName);
  }, []);

  const tools = [
    { icon: Wallet, title: 'Budget Planner', description: 'Plan and track your monthly budget with smart categorization' },
    { icon: Zap, title: 'Predict Electricity Bill', description: 'Get accurate predictions for your upcoming electricity bills' },
    { icon: DivideCircle, title: 'Money Splitter', description: 'Split bills and expenses easily with friends and family' },
    { icon: Bot, title: 'GORA Assistant', description: 'Your AI-powered financial advisor and helper' },
  ];

  const recentTransactions = [
    { type: 'expense', amount: '100.50', description: 'Grocery Shopping', date: 'Today, 2:30 PM' },
    { type: 'income', amount: '1,200.00', description: 'Freelance Payment', date: 'Yesterday' },
    { type: 'expense', amount: '15.99', description: 'Netflix Subscription', date: 'Mar 15, 2024' },
    { type: 'expense', amount: '25.00', description: 'Transportation', date: 'Mar 14, 2024' },
  ];

  const upcomingBills = [
    { icon: Zap, title: 'Electricity Bill', amount: '1000.00', dueDate: 'Mar 30' },
    { icon: Wallet, title: 'Rent', amount: '1,200.00', dueDate: 'Apr 1' },
    { icon: TrendingUp, title: 'Internet', amount: '500.99', dueDate: 'Apr 5' },
  ];

  return (
    <div className="text-white">
      <AnimatePresence>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-teal-300 bg-clip-text text-transparent">
              Welcome {userName || 'User'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">Access all your financial tools in one place</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-5 border border-gray-700/50 mb-6">
            <h2 className="text-base font-semibold mb-4">Quick Overview</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-gray-800/40 rounded-xl p-3">
                <p className="text-gray-400 text-xs">Monthly Budget</p>
                <p className="text-xl font-bold text-white mt-0.5">$2,400</p>
                <p className="text-xs text-green-500 mt-1">+12%</p>
              </div>
              <div className="bg-gray-800/40 rounded-xl p-3">
                <p className="text-gray-400 text-xs">Predicted Bill</p>
                <p className="text-xl font-bold text-white mt-0.5">$85</p>
                <p className="text-xs text-orange-500 mt-1">Due 15d</p>
              </div>
              <div className="bg-gray-800/40 rounded-xl p-3">
                <p className="text-gray-400 text-xs">Split Expenses</p>
                <p className="text-xl font-bold text-white mt-0.5">$150</p>
                <p className="text-xs text-blue-500 mt-1">3 splits</p>
              </div>
              <div className="bg-gray-800/40 rounded-xl p-3">
                <p className="text-gray-400 text-xs">GORA Insights</p>
                <p className="text-xl font-bold text-white mt-0.5">4</p>
                <p className="text-xs text-purple-500 mt-1">New</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3">Financial Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool, index) => <ToolCard key={index} {...tool} />)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-base font-semibold">Recent Transactions</h2>
              <div className="bg-gray-800/40 rounded-xl border border-gray-700/30 divide-y divide-gray-700/20">
                {recentTransactions.map((transaction, index) => <TransactionItem key={index} {...transaction} />)}
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-base font-semibold">Upcoming Bills</h2>
              <div className="space-y-2">
                {upcomingBills.map((bill, index) => <BillCard key={index} {...bill} />)}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
