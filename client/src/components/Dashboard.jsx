import React from 'react';
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
import { auth } from '../services/indesx';

const ToolCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30 cursor-pointer"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-orange-500/10 rounded-xl">
        <Icon className="w-6 h-6 text-orange-500" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm">{description}</p>
  </motion.div>
);

const TransactionCard = ({ type, amount, description, date }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/30"
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
        {type === 'income' ? 
          <ArrowUpRight className="w-5 h-5 text-green-500" /> : 
          <ArrowDownRight className="w-5 h-5 text-red-500" />
        }
      </div>
      <div>
        <p className="text-white font-medium">{description}</p>
        <p className="text-sm text-gray-400">{date}</p>
      </div>
    </div>
    <p className={`font-semibold ${type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
      {type === 'income' ? '+' : '-'}${amount}
    </p>
  </motion.div>
);

const UpcomingBillCard = ({ icon: Icon, title, amount, dueDate }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30"
  >
    <div className="flex items-center gap-3 mb-3">
      <Icon className="w-5 h-5 text-orange-500" />
      <h4 className="text-white font-medium">{title}</h4>
    </div>
    <p className="text-xl font-bold text-white">${amount}</p>
    <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
      <Calendar className="w-4 h-4" />
      <p>Due {dueDate}</p>
    </div>
  </motion.div>
);

function App() {
  const tools = [
    {
      icon: Wallet,
      title: 'Budget Planner',
      description: 'Plan and track your monthly budget with smart categorization'
    },
    {
      icon: Zap,
      title: 'Predict Electricity Bill',
      description: 'Get accurate predictions for your upcoming electricity bills'
    },
    {
      icon: DivideCircle,
      title: 'Money Splitter',
      description: 'Split bills and expenses easily with friends and family'
    },
    {
      icon: Bot,
      title: 'GORA Assistant',
      description: 'Your AI-powered financial advisor and helper'
    }
  ];

  const recentTransactions = [
    { type: 'expense', amount: '100.50', description: 'Grocery Shopping', date: 'Today, 2:30 PM' },
    { type: 'income', amount: '1,200.00', description: 'Freelance Payment', date: 'Yesterday' },
    { type: 'expense', amount: '15.99', description: 'Netflix Subscription', date: 'Mar 15, 2024' },
    { type: 'expense', amount: '25.00', description: 'Transportation', date: 'Mar 14, 2024' }
  ];

  const upcomingBills = [
    { icon: Zap, title: 'Electricity Bill', amount: '1000.00', dueDate: 'Mar 30' },
    { icon: Wallet, title: 'Rent', amount: '1,200.00', dueDate: 'Apr 1' },
    { icon: TrendingUp, title: 'Internet', amount: '500.99', dueDate: 'Apr 5' }
  ];

  return (
    <div className="min-h-screen text-white p-8">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              Welcome {auth.currentUser.displayName}
            </h1>
            <p className="text-gray-400 mt-2">
              Access all your financial tools in one place
            </p>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/40 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Monthly Budget</p>
                <p className="text-2xl font-bold text-white mt-1">$2,400</p>
                <p className="text-sm text-green-500 mt-1">+12% from last month</p>
              </div>
              <div className="bg-gray-800/40 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Predicted Bill</p>
                <p className="text-2xl font-bold text-white mt-1">$85</p>
                <p className="text-sm text-orange-500 mt-1">Due in 15 days</p>
              </div>
              <div className="bg-gray-800/40 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Split Expenses</p>
                <p className="text-2xl font-bold text-white mt-1">$150</p>
                <p className="text-sm text-blue-500 mt-1">3 active splits</p>
              </div>
              <div className="bg-gray-800/40 rounded-xl p-4">
                <p className="text-gray-400 text-sm">GORA Insights</p>
                <p className="text-2xl font-bold text-white mt-1">4</p>
                <p className="text-sm text-purple-500 mt-1">New recommendations</p>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Financial Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <ToolCard key={index} {...tool} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <TransactionCard key={index} {...transaction} />
                ))}
              </div>
            </div>

            {/* Upcoming Bills */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Upcoming Bills</h2>
              <div className="space-y-3">
                {upcomingBills.map((bill, index) => (
                  <UpcomingBillCard key={index} {...bill} />
                ))}
              </div>
            </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;