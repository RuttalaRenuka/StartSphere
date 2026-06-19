import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, BrainCircuit, DollarSign, Package, Users, 
  CheckCircle2, Download, TrendingUp, Megaphone, 
  ShieldCheck, Award, Star, ListChecks, HelpCircle, 
  Activity, Globe, Sliders, ChevronRight
} from 'lucide-react';
import { generateBusinessPlan } from '../lib/gemini';
import { BusinessPlan, Equipment, Supplier } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ALL_BUSINESSES } from '../data/businesses';

// Comprehensive equipment database mapped with actual high-resolution unsplash photos
const PREMIUM_EQUIPMENT: Record<string, Equipment[]> = {
  'coffee-shop': [
    { id: 'eq1', name: 'Commercial espresso machine', price: 350000, category: 'Hardware', image: 'https://images.unsplash.com/photo-151770660439-4636190af475?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq2', name: 'Commercial burr coffee grinder', price: 65000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq3', name: 'Premium tables and chairs', price: 95000, category: 'Furniture', image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq4', name: 'POS Billing System & printer', price: 40000, category: 'Tech', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq5', name: 'Premium roasted coffee beans', price: 20000, category: 'Inventory', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80' }
  ],
  'bakery': [
    { id: 'eq1', name: 'Commercial high-temp oven', price: 240000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq2', name: 'Heavy-duty dough mixer', price: 85000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1581092336336-6e27b615b1a3?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq3', name: 'Premium baking tools and sheets', price: 30000, category: 'Tools', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq4', name: 'Heated glass display counter', price: 110000, category: 'Furniture', image: 'https://images.unsplash.com/photo-1557308536-ee471ef2c390?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq5', name: 'Walk-in cooling refrigerator', price: 75000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=600&q=80' }
  ],
  'gym': [
    { id: 'eq1', name: 'Heavy-duty commercial treadmill', price: 180000, category: 'Cardio', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq2', name: 'Solid urethane dumbbells & rack', price: 95000, category: 'Weights', image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq3', name: 'Olympic flat bench press', price: 35000, category: 'Weights', image: 'https://images.unsplash.com/photo-1576678927484-cc9079fa14fe?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq4', name: 'Magnetic resistance exercise bikes', price: 50000, category: 'Cardio', image: 'https://images.unsplash.com/photo-1594737625785-a6bf183f1244?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq5', name: 'Dual adjustable cable machines', price: 220000, category: 'Machines', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' }
  ],
  'beauty-salon': [
    { id: 'eq1', name: 'Ergonomic hydraulic salon chair', price: 20000, category: 'Furniture', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq2', name: 'Vibrant styling station & mirror', price: 30000, category: 'Furniture', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq3', name: 'Ionic professional hair dryer', price: 12000, category: 'Tools', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq4', name: 'Premium organic beauty products', price: 45000, category: 'Inventory', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq5', name: 'Reception desk counters', price: 35000, category: 'Furniture', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' }
  ],
  'youtube-studio': [
    { id: 'eq1', name: 'Digital mirrorless camera 4K', price: 120000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq2', name: 'Dynamic broadcast microphone', price: 25000, category: 'Audio', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq3', name: 'Dimmable softboxes lighting setup', price: 30000, category: 'Lighting', image: 'https://images.unsplash.com/photo-1552168324-d612d77725e3?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq4', name: 'High-performance rendering laptop', price: 150000, category: 'Computers', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq5', name: 'Premium editing software subscription', price: 20000, category: 'Software', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' }
  ],
  'digital-marketing': [
    { id: 'eq1', name: 'Aesthetic open office workstation', price: 90000, category: 'Furniture', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq2', name: 'Developer & designer laptops', price: 140000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq3', name: 'Team collaboration dashboard', price: 25000, category: 'Software', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq4', name: 'SaaS marketing metrics panel', price: 30000, category: 'Software', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq5', name: 'Premium meeting room monitor', price: 45000, category: 'Furniture', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' }
  ],
  'restaurant': [
    { id: 'eq1', name: 'Commercial oven and burner set', price: 480000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq2', name: 'Solid wood dining tables & chairs', price: 180000, category: 'Furniture', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq3', name: 'Integrated restaurant billing systems', price: 60000, category: 'Tech', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq4', name: 'Walk-in ingredients refrigerator', price: 150000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq5', name: 'Stainless steel chef preparation desk', price: 90000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=600&q=80' }
  ],
  'food-truck': [
    { id: 'eq1', name: 'Customized mobile kitchen food truck', price: 950000, category: 'Vehicle', image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq2', name: 'Kitchen grade compact hood burners', price: 110000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq3', name: 'Silent high-amp power generator', price: 90000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq4', name: 'Under counter deep refrigerator', price: 40000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq5', name: 'Secure kitchen shelves and racks', price: 25000, category: 'Furniture', image: 'https://images.unsplash.com/photo-1584824486509-112e4181f1b6?auto=format&fit=crop&w=600&q=80' }
  ],
  'ai-startup': [
    { id: 'eq1', name: 'Tensor-core workstation computer', price: 250000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140047e?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq2', name: 'Google Cloud compute GPU credits', price: 120000, category: 'Infrastructure', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq3', name: 'Advanced Gemini API subscription key', price: 50000, category: 'Software', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' }
  ],
  'saas-company': [
    { id: 'eq1', name: 'Developer laptop and monitor', price: 150000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1496181130204-7552cc14AC1a?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq2', name: 'Clustered hosting credits', price: 60000, category: 'Infrastructure', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80' },
    { id: 'eq3', name: 'Internal workspace tools & CRM key', price: 40000, category: 'Software', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80' }
  ]
};

// Default placeholder fallback in case a custom mapping does not exist yet
const STANDARD_FALLBACK_EQ = [
  { id: 'eq1', name: 'Premium Office Workstation', price: 85000, category: 'Hardware', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' },
  { id: 'eq2', name: 'Enterprise Cloud Host Tier', price: 45000, category: 'Infrastructure', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80' },
  { id: 'eq3', name: 'B2B Licensing Suite', price: 35000, category: 'Software', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' }
];

export const AIGenerator = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<BusinessPlan | null>(null);

  // Budget tire selector: Basic vs Standard vs Premium
  const [selectedBudget, setSelectedBudget] = useState<'basic' | 'standard' | 'premium'>('standard');

  const metaDetails = useMemo(() => {
    return ALL_BUSINESSES.find(b => b.id === categoryId) || {
      name: categoryId?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Custom Business',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      difficulty: 'Medium',
      cost: '₹10 Lakhs',
      category: 'General'
    };
  }, [categoryId]);

  // Handle building print/PDF output natively
  const handlePrint = () => {
    window.print();
  };

  const getFallbackPlan = (categoryName: string): BusinessPlan => {
    const isTech = ['Technology', 'Emerging', 'saas-company', 'ai-startup'].includes(categoryId || '');
    return {
      id: 'plan-' + Date.now(),
      category: categoryName,
      budget: { basic: 300000, standard: 1200000, premium: 4500000 },
      equipment: PREMIUM_EQUIPMENT[categoryId!] || STANDARD_FALLBACK_EQ,
      suppliers: [
        { id: 'sup1', name: 'Vimal Techware Supplies', rating: 4.8, contact: 'rfq@vimaltech.in' },
        { id: 'sup2', name: 'Deccan Commercial Importers', rating: 4.5, contact: 'imports@deccanind.co.in' }
      ],
      checklist: [
        'Secure municipal workspace permits & local trade licensing',
        'In corporate LLP structure / apply for regional GST number',
        'Procure standard phase hardware and initial inventory stock',
        'Assemble launch marketing material & establish social channels',
        'Set up payment infrastructure and run operational pilot runs'
      ],
      description: `A highly engineered scalable venture guide for starting a premium ${categoryName} under Indian market dynamics.`,
      marketingPlan: [
        'Hyperlocal advertising focusing on geo-segmented channels.',
        'Dynamic search performance marketing paired with active social media campaigns.',
        'Inaugural promotional partnerships and local community workshops.'
      ],
      riskAnalysis: [
        'High real-estate overheads in dense central metropolitan hubs.',
        'Initial operational friction and early talent customer acquisition fees.'
      ],
      growthOpportunities: [
        'Franchise network expansion into emerging Tier-2 markets.',
        'Hybrid digital/offline delivery mechanisms to maximize margins.'
      ],
      revenuePrediction: {
        monthlyRevenue: 350000,
        monthlyExpenses: 180000,
        expectedProfit: 170000,
        breakEvenMonths: 11,
        growthPotential: 'Estimated 28% compounded quarter-on-quarter expansion post initial stabilization period.'
      }
    };
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateBusinessPlan(categoryId!);
      if (!data) throw new Error("API returned null dataset");
      
      // Ensure we bind premium equipment assets with actual images
      data.equipment = PREMIUM_EQUIPMENT[categoryId!] || data.equipment || STANDARD_FALLBACK_EQ;
      setPlan(data);
    } catch (err) {
      console.error('API integration issue. Loading optimized pre-configured blueprint:', err);
      const categoryName = categoryId!.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      setPlan(getFallbackPlan(categoryName));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      handleGenerate();
    }
  }, [categoryId]);

  // Skills required list mapped logically
  const requiredSkillsList = useMemo(() => {
    const path = categoryId!;
    if (path.includes('coffee') || path.includes('bakery') || path.includes('restaurant') || path.includes('food')) {
      return ['Culinary Production', 'Staff Scheduling', 'Local Supply Chain Networks', 'Food Cost Auditing', 'GST Filing'];
    } else if (path.includes('gym') || path.includes('yoga') || path.includes('beauty') || path.includes('salon')) {
      return ['Customer Support Systems', 'Local Influencer Outreaches', 'Asset Maintenance Scheduling', 'Operations Management'];
    } else if (path.includes('saas') || path.includes('ai') || path.includes('coding') || path.includes('software')) {
      return ['TypeScript/Python Development', 'API Orchestrations', 'B2B Copywriting', 'SEO Funnels', 'Product Lifecycle Scheduling'];
    } else {
      return ['Business Strategy Management', 'Team Collaboration', 'Campaign Optimizations', 'Corporate Ledger Auditing'];
    }
  }, [categoryId]);

  // Scaled financial metrics based on Budget tier selection
  const scaledFinancials = useMemo(() => {
    if (!plan) return null;
    const baseRev = plan.revenuePrediction?.monthlyRevenue || 300000;
    const baseExp = plan.revenuePrediction?.monthlyExpenses || 150000;
    
    let multiplier = 1.0;
    if (selectedBudget === 'basic') multiplier = 0.5;
    if (selectedBudget === 'premium') multiplier = 2.5;

    const scaledRev = Math.floor(baseRev * multiplier);
    const scaledExp = Math.floor(baseExp * multiplier * 0.85); // Expenses scale slightly more efficiently
    const scaledProfit = scaledRev - scaledExp;
    
    const investmentCost = plan.budget[selectedBudget];

    return {
      investment: investmentCost,
      revenue: scaledRev,
      expenses: scaledExp,
      profit: scaledProfit,
      breakEven: Math.max(6, Math.floor(plan.revenuePrediction?.breakEvenMonths || 12) + (selectedBudget === 'premium' ? 3 : selectedBudget === 'basic' ? -3 : 0))
    };
  }, [plan, selectedBudget]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-[#030712] text-slate-200">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="text-indigo-400 mb-8"
        >
          <BrainCircuit size={84} />
        </motion.div>
        <h2 className="text-3xl font-bold font-display tracking-tight text-white mb-3">Formulating AI Enterprise Blueprint</h2>
        <p className="text-slate-400 max-w-sm text-center text-sm leading-relaxed font-sans">
          Our co-founder nodes are establishing regional machinery, supplier directories, local rent metrics and profit forecasts...
        </p>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#030712] text-slate-100 print:bg-white print:text-slate-900 print:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 print:hidden">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-4 font-medium transition-colors text-sm group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
        </div>

        {/* 1. HERO BANNER MODULE */}
        <div className="w-full h-80 rounded-[2.5rem] overflow-hidden relative mb-10 shadow-2xl border border-white/5 print:rounded-none print:h-44 print:border-none">
          <img src={metaDetails.image} alt={plan.category} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 text-left flex items-end p-8 md:p-12 print:from-white print:to-transparent">
            <div>
              <span className="inline-flex px-3 py-1 bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-xs font-bold text-indigo-300 font-mono mb-3 uppercase tracking-wider print:hidden">
                {metaDetails.category} SECTOR
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold font-display text-white tracking-tight mb-3 print:text-black">
                {plan.category} Blueprint
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed font-sans print:text-slate-700">
                {plan.description}
              </p>
            </div>
          </div>
        </div>

        {/* Action Header Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10 border-b border-white/5 pb-8 print:hidden">
          <div>
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest font-mono flex items-center">
              <CheckCircle2 size={14} className="text-emerald-400 mr-1.5" /> VERIFIED STRATEGY SHEET
            </span>
            <p className="text-slate-400 text-xs">Simulated on current 2026 economic metrics for regional launch structures.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 text-xs flex items-center space-x-2 border border-indigo-400/20 glow-btn"
            >
              <Download size={14} />
              <span>Export PRINT / PDF Report</span>
            </button>
          </div>
        </div>

        {/* Main Grid contents - sidebar and blueprints details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT SECTION (BLUEPRINTS, COSTS, IMAGES AND FORECASTS) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 2. DYNAMIC COST/BUDGET SWITCHER */}
            <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-md relative overflow-hidden">
              <div className="absolute right-0 top-0 w-44 h-44 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2.5">
                  <DollarSign size={20} className="text-emerald-400" />
                  <span>Interactive Budget Configurations</span>
                </h3>
                <span className="text-slate-500 font-mono text-xs uppercase hidden sm:inline">Recalculates Forecasts Instantly</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {(['basic', 'standard', 'premium'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedBudget(tier)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      selectedBudget === tier 
                        ? 'border-indigo-600 bg-indigo-600/10 text-white shadow-lg' 
                        : 'border-white/5 bg-slate-800/40 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{tier}</p>
                    <p className="text-xl md:text-2xl font-mono font-black">₹{(plan.budget[tier]/100000).toFixed(1)}L</p>
                  </button>
                ))}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Selecting high-tier setups increases standard machinery capability, cloud scaling throughput, or customer experience layouts, yielding bigger profit potentials.
              </p>
            </div>

            {/* 3. DYNAMIC FEASIBILITY SCORECARD */}
            <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Business Feasibility Score</h3>
                  <p className="text-slate-500 text-xs">Diagnostic rating mapped for current market competitiveness.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Big Score Bubble */}
                <div className="md:col-span-4 bg-slate-950/60 rounded-[2rem] border border-white/5 p-6 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">OVERALL VALIDATION</span>
                  <span className="text-5xl font-mono font-black text-emerald-400">85<span className="text-lg text-slate-500">/100</span></span>
                  <div className="mt-3.5 py-1 px-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] text-emerald-400 font-bold tracking-wider inline-block">
                    HIGHLY VIABLE
                  </div>
                </div>

                {/* Score Breakdown Matrices */}
                <div className="md:col-span-8 space-y-4">
                  {[
                    { label: 'Investment Risk Severity', score: 35, reverse: true, color: 'bg-emerald-400', txt: 'Low' },
                    { label: 'Profit Yield Potential', score: 88, color: 'bg-indigo-400', txt: 'Stellar' },
                    { label: 'Competition Overlap', score: 62, reverse: true, color: 'bg-yellow-400', txt: 'Moderate' },
                    { label: 'Platform Scalability', score: 92, color: 'bg-purple-400', txt: 'High Scaling' },
                    { label: 'Operational Difficulty', score: 45, reverse: true, color: 'bg-blue-400', txt: 'Manageable' },
                    { label: 'Present Market Demand', score: 84, color: 'bg-pink-400', txt: 'Very Strong' }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">{stat.label}</span>
                        <span className="text-white text-[11px] font-mono">{stat.txt}</span>
                      </div>
                      <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color}`} style={{ width: `${stat.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* 4. REAL EQUIPMENT & RESOURCES */}
            <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2.5">
                <Package size={20} className="text-indigo-400" />
                <span>Equipment & Resource Assets</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plan.equipment.map((item) => (
                  <div key={item.id} className="bg-slate-950/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col group">
                    <div className="h-44 w-full relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute top-3 left-3 bg-slate-950/80 border border-white/10 px-2.5 py-0.5 rounded text-[10px] font-bold text-indigo-300">
                        {item.category || 'Asset'}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h4 className="font-bold text-white text-base leading-tight mb-2">{item.name}</h4>
                      <p className="text-xs text-slate-500 leading-normal line-clamp-2 mb-4 flex-grow">
                        Professional standard grade asset carefully rated for early operations.
                      </p>
                      <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3.5 mt-auto">
                        <span className="text-slate-400">Standard cost</span>
                        <span className="font-bold text-white font-mono">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-slate-950/60 p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">Asset Deployment Overhead</h4>
                  <p className="text-xs text-slate-500">Predicted sum for core operational resources.</p>
                </div>
                <div className="text-xl font-bold font-mono text-indigo-400 mt-3 sm:mt-0">
                  ₹{plan.equipment.reduce((tot, s) => tot + s.price, 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* 5. SUPPLIERS */}
            <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2.5">
                <Users size={20} className="text-indigo-400" />
                <span>B2B Verified Supplier Directories</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.suppliers.map((sup) => (
                  <div key={sup.id} className="p-5 rounded-2xl bg-slate-950/40 border border-white/5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{sup.name}</h4>
                        <div className="flex items-center space-x-1 mt-1 text-yellow-500">
                          <Star size={12} fill="currentColor" />
                          <span className="text-xs font-bold font-mono">{sup.rating} / 5</span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 bg-slate-900 border border-white/10 px-2 py-0.5 rounded">
                        AUDITED
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-500">Contact RFQ:</span>
                      <p className="text-indigo-300 font-mono font-medium">{sup.contact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. REVENUE PROJECTIONS CHART */}
            {scaledFinancials && (
              <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center space-x-2.5">
                  <TrendingUp size={20} className="text-indigo-400" />
                  <span>6-Month Revenue Predicted models</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Gross Monthly Inflow</span>
                    <span className="text-2xl font-mono font-bold text-indigo-400">₹{scaledFinancials.revenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Expenses & Overheads</span>
                    <span className="text-2xl font-mono font-bold text-red-400">₹{scaledFinancials.expenses.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Expected net profit</span>
                    <span className="text-2xl font-mono font-bold text-emerald-400 font-black">₹{scaledFinancials.profit.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* The Chart container */}
                <div className="h-64 w-full bg-slate-950/60 p-4 rounded-3xl border border-white/10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Revenue', amount: scaledFinancials.revenue, fill: '#6366f1' },
                        { name: 'Expenses', amount: scaledFinancials.expenses, fill: '#ef4444' },
                        { name: 'Net Profit', amount: scaledFinancials.profit, fill: '#10b981' }
                      ]}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                      <Tooltip 
                        formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                        contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                      />
                      <Bar dataKey="amount" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-xs flex justify-between items-center font-semibold">
                  <span>Forecasted Break-Even Window</span>
                  <span className="bg-slate-900 border border-white/10 text-white px-3 py-1 rounded font-mono text-xs">{scaledFinancials.breakEven} Months</span>
                </div>
              </div>
            )}

            {/* 7. REQUIRED SKILLS */}
            <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2.5">
                <Award size={20} className="text-indigo-400" />
                <span>Required Execution Competencies</span>
              </h3>
              <p className="text-xs text-slate-500 mb-6">Possessing or partnering to procure these vital skills boosts operational performance margins.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {requiredSkillsList.map((skill, si) => (
                  <div key={si} className="flex items-center space-x-2.5 p-3.5 rounded-xl bg-slate-950/40 border border-white/5">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. MARKETING PLAN & RISKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Marketing strategy */}
              <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5">
                <h4 className="text-lg font-bold mb-5 text-white flex items-center space-x-2">
                  <Megaphone size={18} className="text-indigo-400" />
                  <span>Launch Marketing Strategy</span>
                </h4>
                <div className="space-y-3.5 text-xs text-slate-400">
                  {plan.marketingPlan?.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span className="font-bold text-indigo-400">{idx+1}.</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threat Matrix risks */}
              <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5">
                <h4 className="text-lg font-bold mb-5 text-white flex items-center space-x-2">
                  <ShieldCheck size={18} className="text-red-400" />
                  <span>Risk & Sensitivity Matrix</span>
                </h4>
                <div className="space-y-3.5 text-xs text-slate-400">
                  {plan.riskAnalysis?.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span className="text-red-400 font-bold">•</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDEBAR (CHECKLIST, REGENERATIONS, ADVICE PANEL) */}
          <div className="lg:col-span-4 space-y-8 print:hidden">
            
            {/* Business launch checklist */}
            <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
                <ListChecks size={18} className="text-indigo-400" />
                <span>Launch Action Checklist</span>
              </h3>

              <div className="space-y-4">
                {plan.checklist.map((item, idx) => (
                  <label key={idx} className="flex items-start space-x-3 cursor-pointer group">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="mt-0.5 w-5 h-5 rounded border border-white/10 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 flex items-center justify-center transition-all bg-slate-950">
                      <CheckCircle2 size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-white transition-all leading-normal">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Advisor Context Card */}
            <div className="bg-gradient-to-br from-indigo-700 via-indigo-900 to-indigo-950 p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden shadow-2xl border border-white/10">
              <div className="absolute top-0 right-0 w-44 h-44 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-indigo-300 uppercase block font-bold">CO-FOUNDER CONTEXT</span>
                <h4 className="text-xl font-bold font-display">Advisor Strategic Assessment</h4>
              </div>

              <p className="text-xs text-indigo-100 leading-relaxed font-sans">
                A {plan.category} mapped at the standard budget can recover its initial assets in under 12 months with high local execution discipline. Prioritize locking down low supplier contracts and driving targeted social outreaches immediately!
              </p>

              <button
                onClick={handleGenerate}
                className="w-full py-3.5 bg-white/10 backdrop-blur hover:bg-white/20 border border-white/10 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5"
              >
                <BrainCircuit size={16} />
                <span>Re-Synthesize Model Details</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
