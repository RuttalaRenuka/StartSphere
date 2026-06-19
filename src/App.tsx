import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { AIGenerator } from './components/AIGenerator';
import { Compare } from './pages/Compare';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { Chatbot } from './components/Chatbot';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, ShieldCheck } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-900 text-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Rocket size={24} />
            </div>
            <span className="text-2xl font-bold font-display tracking-tighter">StartSphere</span>
          </div>
          <p className="text-slate-400 max-w-sm mb-6">
            Empowering the next generation of entrepreneurs with AI-driven business planning and simplified procurement.
          </p>
          <div className="flex space-x-4">
            {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
              <a key={social} href="#" className="w-10 h-10 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all">
                <span className="sr-only">{social}</span>
                <div className="w-5 h-5 bg-slate-700 rounded-sm" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">Platform</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
            <li><a href="#" className="hover:text-white transition-colors">AI Generator</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Supplier Network</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Market Insights</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>© 2026 StartSphere AI Technologies Inc. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-2">
            <ShieldCheck size={16} />
            <span>GDPR Compliant</span>
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Systems Normal</span>
          </span>
        </div>
      </div>
    </div>
  </footer>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/generate/:categoryId" element={<AIGenerator />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <BrowserRouter>
        <Navbar />
        <div className="flex-grow">
          <AnimatedRoutes />
        </div>
        <Footer />
        <Chatbot />
      </BrowserRouter>
    </div>
  );
}
