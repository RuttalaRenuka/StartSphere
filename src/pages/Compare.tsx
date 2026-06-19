import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Rocket, Scale, Shuffle, HelpCircle, ArrowRight, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL_BUSINESSES } from '../data/businesses';

export const Compare = () => {
  // Let the user select business A and business B from ALL_BUSINESSES
  const [bizAId, setBizAId] = useState<string>('coffee-shop');
  const [bizBId, setBizBId] = useState<string>('bakery');

  const businessList = ALL_BUSINESSES;

  // Handler to set preset comparisons
  const applyPreset = (idA: string, idB: string) => {
    setBizAId(idA);
    setBizBId(idB);
  };

  // Helper to extract advanced metrics for comparison for any business
  const getMetrics = (biz: typeof ALL_BUSINESSES[0]) => {
    // Dynamically calculate robust realistic financials matching Indian averages
    const capital = biz.costValue;
    const isTech = ['Technology', 'Emerging'].includes(biz.category);
    const isService = ['Professional Services', 'Content Creation'].includes(biz.category);

    const marginRate = isTech ? 0.45 : isService ? 0.35 : 0.22;
    const estRevenue = Math.floor(capital * 0.18);
    const estProfit = Math.floor(estRevenue * marginRate);
    
    let breakEven = 12;
    if (biz.difficulty === 'Very High' || biz.difficulty === 'Hard') {
      breakEven = 16;
    } else if (biz.difficulty === 'Medium') {
      breakEven = 10;
    } else {
      breakEven = 7;
    }

    const demandPercent = isTech ? 92 : isService ? 84 : 76;
    const scalability = isTech ? 'Extreme (Cloud scaling)' : isService ? 'High (Team agency)' : 'Moderate (Physical storefront)';

    const keyRisks = biz.difficulty === 'Very High' || biz.difficulty === 'Hard'
      ? ['High talent acquisition fees', 'Rapid technology lifecycle shifts', 'Intense initial capital outlay']
      : ['Local competitor price cuts', 'Realestate lease escalation', 'Staff turnover / attrition'];

    const coreSkills = isTech 
      ? ['Software Architecture', 'Full-stack development', 'Enterprise B2B sales'] 
      : isService 
      ? ['Digital Marketing', 'Creative copy', 'Account management'] 
      : ['Operational logistics', 'Customer care', 'Local supply chains'];

    return {
      capital,
      revenue: estRevenue,
      profit: estProfit,
      breakEven,
      marginPercent: Math.floor(marginRate * 100),
      demand: demandPercent,
      scalability,
      keyRisks,
      coreSkills
    };
  };

  const bizA = useMemo(() => businessList.find(b => b.id === bizAId) || businessList[0], [bizAId, businessList]);
  const bizB = useMemo(() => businessList.find(b => b.id === bizBId) || businessList[1], [bizBId, businessList]);

  const metricsA = useMemo(() => getMetrics(bizA), [bizA]);
  const metricsB = useMemo(() => getMetrics(bizB), [bizB]);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#030712] text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6 font-medium transition-colors group text-sm">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2 font-display flex items-center space-x-3">
                <Scale className="text-indigo-400" size={32} />
                <span>Side-by-Side Model Comparison</span>
              </h1>
              <p className="text-slate-400">Evaluate setup capital, break-even times, and risk metrics side-by-side to find your ideal sector.</p>
            </div>

            {/* Quick comparison presets */}
            <div className="flex flex-wrap gap-2.5 bg-slate-900/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
              <span className="text-xs text-slate-500 font-bold self-center px-2 uppercase tracking-widest">Presets:</span>
              <button 
                onClick={() => applyPreset('coffee-shop', 'bakery')}
                className="px-3.5 py-1.5 bg-slate-800 text-xs font-bold rounded-lg hover:bg-slate-700 transition"
              >
                Cafe vs Bakery
              </button>
              <button 
                onClick={() => applyPreset('gym', 'yoga-studio')}
                className="px-3.5 py-1.5 bg-slate-800 text-xs font-bold rounded-lg hover:bg-slate-700 transition"
              >
                Gym vs Yoga
              </button>
              <button 
                onClick={() => applyPreset('ai-startup', 'saas-company')}
                className="px-3.5 py-1.5 bg-slate-800 text-xs font-bold rounded-lg hover:bg-slate-700 transition"
              >
                AI vs SaaS
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Selectors Column Headers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Select A */}
          <div className="bg-slate-900/40 rounded-3xl p-6 border border-white/5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-xs font-bold text-indigo-400 uppercase font-mono tracking-wider mb-2 block">Enterprise Plan A</span>
            <select
              value={bizAId}
              onChange={(e) => setBizAId(e.target.value)}
              className="w-full bg-slate-800/80 border border-white/10 rounded-2xl p-4 text-white text-lg font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {businessList.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.category})</option>
              ))}
            </select>
          </div>

          {/* Select B */}
          <div className="bg-slate-900/40 rounded-3xl p-6 border border-white/5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-xs font-bold text-purple-400 uppercase font-mono tracking-wider mb-2 block">Enterprise Plan B</span>
            <select
              value={bizBId}
              onChange={(e) => setBizBId(e.target.value)}
              className="w-full bg-slate-800/80 border border-white/10 rounded-2xl p-4 text-white text-lg font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {businessList.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.category})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Dashboard Grid */}
        <div className="bg-slate-900/20 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/5 bg-slate-950/40 divide-y md:divide-y-0 md:divide-x divide-white/5">
            <div className="md:col-span-4 p-8 flex flex-col justify-center">
              <h3 className="text-sm uppercase font-mono font-bold text-slate-500 tracking-widest mb-3">CONCEIVED SECTORS</h3>
              <p className="text-xs text-slate-400">General industrial metrics side-by-side.</p>
            </div>
            
            {/* Sector A Title */}
            <div className="md:col-span-4 p-8 flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                <Rocket size={24} />
              </div>
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase block">{bizA.category}</span>
                <h4 className="text-xl font-extrabold text-white">{bizA.name}</h4>
              </div>
            </div>

            {/* Sector B Title */}
            <div className="md:col-span-4 p-8 flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                <Rocket size={24} />
              </div>
              <div>
                <span className="text-[10px] text-purple-400 font-bold uppercase block">{bizB.category}</span>
                <h4 className="text-xl font-extrabold text-white">{bizB.name}</h4>
              </div>
            </div>
          </div>

          {/* Setup Capital Cost */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/5 border-b border-white/5 items-center">
            <div className="md:col-span-4 p-8">
              <span className="text-xs font-bold text-slate-400 block mb-1">Standard Investment</span>
              <p className="text-xs text-slate-500">Calculated sum for inventory, setups, and legal reserves.</p>
            </div>
            <div className="md:col-span-4 p-8">
              <span className="text-3xl font-extrabold text-white block mb-1 font-mono">₹{metricsA.capital.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-400">Standard tier: {bizA.cost}</span>
            </div>
            <div className="md:col-span-4 p-8">
              <span className="text-3xl font-extrabold text-white block mb-1 font-mono">₹{metricsB.capital.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-400">Standard tier: {bizB.cost}</span>
            </div>
          </div>

          {/* Revenue and Margin */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/5 border-b border-white/5 items-center">
            <div className="md:col-span-4 p-8">
              <span className="text-xs font-bold text-slate-400 block mb-1">Est. Monthly Revenue</span>
              <p className="text-xs text-slate-500">Monthly gross sales predicted after 6 months launch.</p>
            </div>
            <div className="md:col-span-4 p-8">
              <span className="text-2xl font-bold text-indigo-400 block mb-1 font-mono">₹{metricsA.revenue.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-slate-400">Predicted margin rate: {metricsA.marginPercent}%</span>
            </div>
            <div className="md:col-span-4 p-8">
              <span className="text-2xl font-bold text-purple-400 block mb-1 font-mono">₹{metricsB.revenue.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-slate-400">Predicted margin rate: {metricsB.marginPercent}%</span>
            </div>
          </div>

          {/* Est Profit */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/5 border-b border-white/5 items-center">
            <div className="md:col-span-4 p-8">
              <span className="text-xs font-bold text-slate-400 block mb-1">Expected Monthly Profit</span>
              <p className="text-xs text-slate-500">Net profit margin after deducting rentals and labor.</p>
            </div>
            <div className="md:col-span-4 p-8">
              <span className="text-2xl font-bold text-emerald-400 block mb-1 font-mono">₹{metricsA.profit.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-500">High scalability potential</span>
            </div>
            <div className="md:col-span-4 p-8">
              <span className="text-2xl font-bold text-emerald-400 block mb-1 font-mono">₹{metricsB.profit.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-500">High stability vector</span>
            </div>
          </div>

          {/* Break Even */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/5 border-b border-white/5 items-center">
            <div className="md:col-span-4 p-8">
              <span className="text-xs font-bold text-slate-400 block mb-1">Break-Even Period</span>
              <p className="text-xs text-slate-500">Operational cycle duration to recover early investments.</p>
            </div>
            <div className="md:col-span-4 p-8">
              <span className="text-xl font-bold text-white block mb-1 font-mono">{metricsA.breakEven} Months</span>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-indigo-500 h-full" style={{ width: `${Math.max(20, 100 - metricsA.breakEven * 4)}%` }} />
              </div>
            </div>
            <div className="md:col-span-4 p-8">
              <span className="text-xl font-bold text-white block mb-1 font-mono">{metricsB.breakEven} Months</span>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-purple-500 h-full" style={{ width: `${Math.max(20, 100 - metricsB.breakEven * 4)}%` }} />
              </div>
            </div>
          </div>

          {/* Difficulty / Risks */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/5 border-b border-white/5 items-start">
            <div className="md:col-span-4 p-8">
              <span className="text-xs font-bold text-slate-400 block mb-1">Operational Difficulty & Risks</span>
              <p className="text-xs text-slate-500">Complexity factors and major industry threat areas.</p>
            </div>
            <div className="md:col-span-4 p-8 space-y-4">
              <div>
                <span className="text-xs text-slate-500 block mb-1">MANAGEMENT DIFFICULTY</span>
                <span className="inline-flex px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-400">
                  {bizA.difficulty}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">PRIMARY RISK EXPOSURES</span>
                <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                  {metricsA.keyRisks.map((k, idx) => (
                    <li key={idx}>{k}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:col-span-4 p-8 space-y-4">
              <div>
                <span className="text-xs text-slate-500 block mb-1">MANAGEMENT DIFFICULTY</span>
                <span className="inline-flex px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-400">
                  {bizB.difficulty}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">PRIMARY RISK EXPOSURES</span>
                <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                  {metricsB.keyRisks.map((k, idx) => (
                    <li key={idx}>{k}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action button linkages */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/5">
            <div className="md:col-span-4 p-8">
              <span className="text-xs font-bold text-slate-400 block mb-1">Launch Actions</span>
              <p className="text-xs text-slate-500">Review complete layouts for chosen models.</p>
            </div>
            <div className="md:col-span-4 p-8">
              <Link
                to={`/generate/${bizA.id}`}
                className="w-full text-center py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-all block glow-btn"
              >
                Access {bizA.name} Blueprint
              </Link>
            </div>
            <div className="md:col-span-4 p-8">
              <Link
                to={`/generate/${bizB.id}`}
                className="w-full text-center py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-all block glow-btn"
              >
                Access {bizB.name} Blueprint
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
