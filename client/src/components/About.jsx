import React from 'react';
import { 
  Bot, 
  Wallet, 
  Zap, 
  Users, 
  PieChart, 
  ArrowRight, 
  Shield, 
  Clock,
  Github,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30"
    >
      <div className="p-3 bg-orange-500/10 rounded-xl inline-block mb-4">
        <Icon className="h-6 w-6 text-orange-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30 text-center">
      <p className="text-3xl font-bold text-orange-500 mb-2">{number}</p>
      <p className="text-gray-400">{label}</p>
    </div>
  );
}

function About() {
  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              OnlyBills
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Your all-in-one solution for smart bill management, expense splitting, and financial guidance
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <StatCard number="50K+" label="Active Users" />
          <StatCard number="$2M+" label="Bills Processed" />
          <StatCard number="98%" label="Accuracy Rate" />
          <StatCard number="24/7" label="Support" />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={Zap}
            title="Bill Prediction"
            description="Advanced AI algorithms to predict your electricity bills with remarkable accuracy, helping you plan ahead."
          />
          <FeatureCard
            icon={Users}
            title="Split Bills"
            description="Effortlessly split expenses among friends and roommates with our intuitive bill-sharing features."
          />
          <FeatureCard
            icon={Bot}
            title="GORA - AI Assistant"
            description="Meet GORA, your personal financial advisor providing smart insights and recommendations 24/7."
          />
          <FeatureCard
            icon={PieChart}
            title="Budget Planner"
            description="Comprehensive tools to plan, track, and optimize your monthly budget with visual insights."
          />
          <FeatureCard
            icon={Shield}
            title="Secure Platform"
            description="Bank-grade encryption and security measures to keep your financial data safe and protected."
          />
          <FeatureCard
            icon={Clock}
            title="Bill Reminders"
            description="Never miss a payment with smart notifications and automated payment reminders."
          />
        </div>

        {/* Mission Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-400 mb-8">
            At OnlyBills, we're passionate about making financial management accessible and stress-free for everyone. 
            Our platform combines cutting-edge technology with user-friendly design to help you take control of your finances.
          </p>
          <div className="bg-gray-800/40 rounded-xl p-8 border border-gray-700/30">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80" 
              alt="Team collaboration" 
              className="rounded-lg mb-6 w-full h-64 object-cover"
            />
            <p className="text-gray-400 italic">
              "We believe that managing bills and expenses shouldn't be a hassle. Our goal is to empower users with smart tools and insights for better financial decisions."
            </p>
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Powered by Advanced Technology</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
              <h3 className="text-xl font-semibold mb-3 text-orange-500">AI & Machine Learning</h3>
              <p className="text-gray-400">State-of-the-art algorithms for accurate bill predictions and personalized insights.</p>
            </div>
            <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
              <h3 className="text-xl font-semibold mb-3 text-orange-500">Real-time Processing</h3>
              <p className="text-gray-400">Instant bill splitting calculations and immediate expense tracking updates.</p>
            </div>
            <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
              <h3 className="text-xl font-semibold mb-3 text-orange-500">Cloud Infrastructure</h3>
              <p className="text-gray-400">Reliable and scalable cloud-based system for seamless performance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800/50 border-t border-gray-700/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">OnlyBills</h3>
              <p className="text-gray-400">Making financial management simple and efficient for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Integration</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-700/30">
            <p className="text-gray-400 mb-4 md:mb-0">© 2024 OnlyBills. All rights reserved.</p>
            <div className="flex space-x-6">
              <Github className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Mail className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;