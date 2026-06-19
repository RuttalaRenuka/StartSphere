import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-primary-600 uppercase bg-primary-50 rounded-full">
            Launch Your Dream Business in Minutes
          </span>
          <h1 className="text-5xl md:text-8xl font-bold text-slate-900 mb-8 max-w-5xl mx-auto leading-[1.05] tracking-tighter">
            Start Any Business <br className="hidden md:block" /> with <span className="gradient-text">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Choose your business idea and get a complete startup plan, budget, equipment list, and suppliers instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#categories" className="btn-premium bg-slate-900 text-white hover:bg-primary-600 w-full sm:w-auto min-w-[200px]">
              <span>Generate Complete Business Blueprint</span>
              <ArrowRight size={20} />
            </a>
            <button className="btn-premium bg-white text-slate-700 border border-slate-200 hover:border-primary-200 w-full sm:w-auto min-w-[200px]">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-primary-600">
                <Play size={14} fill="currentColor" />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>
        </motion.div>

        {/* Hero Illustration Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative px-4"
        >
          <div className="max-w-5xl mx-auto aspect-video glass rounded-[2.5rem] overflow-hidden p-2">
            <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center border border-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop" 
                alt="Startup Dashboard" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
