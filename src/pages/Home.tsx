import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Rocket, BarChart3, Users, Factory, Target, 
  Briefcase, ChevronRight, TrendingUp, ShieldCheck, 
  DollarSign, MapPin, SlidersHorizontal, Sparkles, 
  CheckCircle2, Clock, Award, HelpCircle, ArrowRight, Laptop, Star
} from 'lucide-react';
import { ALL_BUSINESSES, POPULAR_CATEGORIES } from '../data/businesses';

// Success Stories Static Data
const SUCCESS_STORIES = [
  {
    founder: 'Aravind K.',
    business: 'AI Med-Scribe',
    category: 'AI Startup',
    revenue: '₹2.4 Cr/Yr',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=650&q=80',
    story: 'Created a real-time medical transcription AI in Hyderabad. Reached break-even in 7 months and now powers 18 regional hospital networks.'
  },
  {
    founder: 'Neha Reddy',
    business: 'The Sourdough Craft',
    category: 'Bakery',
    revenue: '₹75 Lakhs/Yr',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=650&q=80',
    story: 'Launched an organic sourdough kitchen in Vijayawada. Scaled to 3 retail outlets and an active online monthly sub base with zero debt capital.'
  },
  {
    founder: 'Sriram Prasad',
    business: 'Agri-Vantage Drones',
    category: 'Drone Services',
    revenue: '₹1.1 Cr/Yr',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=650&q=80',
    story: 'Administers automated drone soil maps in Chennai and Andhra. Saved 140+ smallholders over 30% on fertiliser and irrigation overruns.'
  },
  {
    founder: 'Simran & Kabir',
    business: 'ZenFlow Space',
    category: 'Yoga & Fitness Studio',
    revenue: '₹95 Lakhs/Yr',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=650&q=80',
    story: 'Merged high-tech hybrid fitness and restorative yoga in Mumbai. They leveraged local Instagram influencers to hit 100% membership capacity.'
  }
];

// Rich Location Insights Static Data
const CITIES_DATA: Record<string, {
  demand: string;
  demandScore: number;
  competition: string;
  opportunities: string[];
  avgCost: string;
  narrative: string;
}> = {
  'Hyderabad': {
    demand: 'Very High',
    demandScore: 88,
    competition: 'Moderate',
    opportunities: ['Cloud Kitchen', 'IT Consulting', 'Coffee Shop', 'EV Charging Station'],
    avgCost: '₹8L - ₹45L',
    narrative: 'Hyderabad’s growing tech corridors combined with a prominent culinary culture make food and SaaS business frameworks exceptionally successful.'
  },
  'Bangalore': {
    demand: 'Exceptional',
    demandScore: 96,
    competition: 'High',
    opportunities: ['AI Startup', 'SaaS Company', 'Smart Home Installation', 'Coding Academy'],
    avgCost: '₹12L - ₹1.5Cr',
    narrative: 'The Silicon Valley of India remains the prime destination for high-tech startups. Early adopter density and strong seed networks foster rapid product scaling.'
  },
  'Vijayawada': {
    demand: 'High',
    demandScore: 78,
    competition: 'Low',
    opportunities: ['Tea Cafe', 'Robotics Training', 'Organic Farming', 'Jewelry Brand'],
    avgCost: '₹3L - ₹20L',
    narrative: 'Low realestate premiums coupled with growing disposable incomes make Vijayawada a goldmine for retail franchises and specialized services.'
  },
  'Chennai': {
    demand: 'Stable High',
    demandScore: 85,
    competition: 'Moderate',
    opportunities: ['Drone Services', 'Automobile Garage', 'Recruitment Agency', '3D Printing'],
    avgCost: '₹5L - ₹40L',
    narrative: 'A solid industrial base makes vehicle optimization businesses, automation training, and professional supply networks highly secure and scalable.'
  },
  'Mumbai': {
    demand: 'Extreme',
    demandScore: 92,
    competition: 'Very High',
    opportunities: ['YouTube Studio', 'Boutique Store', 'SaaS Company', 'Personal Training'],
    avgCost: '₹15L - ₹2Cr',
    narrative: 'Space-efficient businesses, digital-first content hubs, and high-margin luxury consumer brands thrive in this dense, energetic commercial hub.'
  }
};

// Map Risk Appetite to business difficulty/risks
const RISK_TAGS = {
  Low: { difficulty: ['Low', 'Medium'], maxCost: 1500000, riskText: 'Prefers stable, well-established local services with predictable margins.' },
  Medium: { difficulty: ['Medium', 'Hard'], maxCost: 8000000, riskText: 'Balanced risk-adjusted returns focusing on tech agencies or hybrid outlets.' },
  High: { difficulty: ['Hard', 'Very High'], maxCost: 99999999, riskText: 'High-growth digital assets, deep technologies, or capital-instense enterprises.' }
};

export const Home = () => {
  const navigate = useNavigate();

  // 1. Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Rotating Search Placeholders
  const placeholders = [
    'What business can I start with ₹5 Lakhs?',
    'Search Coffee Shop, AI Startup, Gym, Bakery...',
    'Suggested: Low-risk online setups...',
    'Try searching Cybersecurity, Drone Services...'
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 2. Interactive Budget Slider State (from ₹50,000 to ₹5,00,00,000)
  const [budgetSliderValue, setBudgetSliderValue] = useState<number>(3000000); // Default to 30 Lakhs

  // 3. Matchmaker States
  const [matchBudget, setMatchBudget] = useState<number>(500000); // 5 Lakhs
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Coding']);
  const [matchLocation, setMatchLocation] = useState<string>('Bangalore');
  const [matchTime, setMatchTime] = useState<string>('Full-time');
  const [matchRisk, setMatchRisk] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [matchmakerResult, setMatchmakerResult] = useState<any[] | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  // Available skills presets
  const availableSkills = ['Coding', 'Marketing', 'Teaching', 'Design', 'Culinary', 'Writing', 'Finance', 'Management', 'Automobiles', 'Electronics'];

  // 4. Location Insights Tab State
  const [selectedCity, setSelectedCity] = useState<string>('Bangalore');

  // Submit search query
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const targetQuery = searchQuery.trim().toLowerCase();
      // Look for a direct match in ALL_BUSINESSES
      const matched = ALL_BUSINESSES.find(b => b.name.toLowerCase().includes(targetQuery) || b.id.toLowerCase() === targetQuery);
      if (matched) {
        navigate(`/generate/${matched.id}`);
      } else {
        // Fallback to formatted input
        const idStr = targetQuery.replace(/\s+/g, '-');
        navigate(`/generate/${idStr}`);
      }
    }
  };

  // Helper chips clicks
  const handleChipClick = (chip: string) => {
    if (chip === 'Low Investment') {
      setBudgetSliderValue(300000);
      setSearchQuery('');
    } else if (chip === 'High Profit') {
      setSearchQuery('SaaS');
    } else if (chip === 'Online Business') {
      setSearchQuery('SaaS Company');
    } else if (chip === 'AI Startup') {
      navigate('/generate/ai-startup');
    } else if (chip === 'Student Friendly') {
      setBudgetSliderValue(100000);
      setSearchQuery('YouTube');
    }
  };

  // Live Slider filtering for "Recommended Businesses" below Hero
  const recommendedBusinessesBySlider = useMemo(() => {
    return ALL_BUSINESSES.filter(biz => {
      // Show businesses whose standard costValue is up to 1.3x the currently selected slider value
      return biz.costValue <= budgetSliderValue * 1.3;
    })
    .sort((a, b) => b.costValue - a.costValue)
    .slice(0, 8); // Top 8 recommended
  }, [budgetSliderValue]);

  // Skill toggling helper
  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Execute Matchmaker algorithm with fully custom AI Co-founder evaluations based on inputs
  const executeMatchmaker = () => {
    setIsMatching(true);
    setTimeout(() => {
      // Evaluate matching scores for all businesses based on inputs
      const matches = ALL_BUSINESSES.map(biz => {
        let score = 70; // Base score
        let justifications: string[] = [];

        // 1. Budget Match
        // Ideal range: standard cost is close to or below the matchBudget
        const budgetRatio = biz.costValue / matchBudget;
        if (budgetRatio <= 1.1) {
          score += 15;
          justifications.push(`Perfect financial entry. Your ₹${(matchBudget/100000).toFixed(1)}L budget safely covers the start requirements of this model.`);
        } else if (budgetRatio <= 2.0) {
          score += 5;
          justifications.push(`A bit tight to start standard operations, but fully viable as a bootstrap layout with custom basic procurement.`);
        } else {
          score -= 30;
          justifications.push(`High early financial friction. This typically demands ₹${(biz.costValue/100000).toFixed(0)}L standard investment.`);
        }

        // 2. Skill Match
        // Map categories to skill keywords
        const skillMappers: Record<string, string[]> = {
          'Technology': ['Coding', 'Design', 'Finance'],
          'Education': ['Teaching', 'Writing', 'Management'],
          'Content Creation': ['Design', 'Writing', 'Marketing'],
          'Food & Beverage': ['Culinary', 'Management', 'Marketing'],
          'Fitness & Health': ['Management', 'Marketing'],
          'Beauty & Fashion': ['Design', 'Marketing'],
          'Professional Services': ['Marketing', 'Finance', 'Management'],
          'Retail': ['Management', 'Finance'],
          'Automotive': ['Automobiles', 'Electronics'],
          'Emerging': ['Coding', 'Electronics', 'Management']
        };

        const essentialSkills = skillMappers[biz.category] || ['Management'];
        const userMatchedSkills = selectedSkills.filter(s => essentialSkills.includes(s));
        if (userMatchedSkills.length > 0) {
          score += 15;
          justifications.push(`Your expertise in [${userMatchedSkills.join(', ')}] matches ${biz.name}'s critical operations, saving high early outsourcing fees.`);
        } else {
          score -= 10;
          justifications.push(`This structure requires strong ${essentialSkills[0]} focus. Consider pairing with a skilled co-founder.`);
        }

        // 3. Risk Match
        const riskTier = RISK_TAGS[matchRisk];
        if (riskTier.difficulty.includes(biz.difficulty)) {
          score += 10;
          justifications.push(`Matches your ${matchRisk} Risk Appetite perfectly. Predictability levels align with your startup mindset.`);
        } else {
          score -= 5;
        }

        // 4. Time commitment match
        if (matchTime === 'Part-time' && ['SaaS Company', 'AI Startup', 'Restaurant', 'Gym'].includes(biz.name)) {
          score -= 15;
          justifications.push(`Typically demands 60+ hour/week active operations. Starting part-time might delay initial break-even.`);
        } else if (matchTime === 'Part-time') {
          score += 5;
          justifications.push(`Highly flexible. Easily manageable alongside existing professional obligations.`);
        } else {
          score += 10;
          justifications.push(`Full-time devotion will accelerate product/operational maturation within 3 months.`);
        }

        // 5. Location Match
        const cityData = CITIES_DATA[matchLocation];
        if (cityData?.opportunities.includes(biz.name)) {
          score += 10;
          justifications.push(`Hot market indicator! ${biz.name} is verified as a top high-demand opportunity in ${matchLocation} according to regional datasets.`);
        }

        // Clip score to 100 max, 30 min
        const finalScore = Math.max(35, Math.min(98, score));

        // Feasibility breakdown scores
        const riskVal = matchRisk === 'Low' ? 30 : matchRisk === 'Medium' ? 65 : 85;
        const profitVal = ['Technology', 'Emerging', 'Professional Services'].includes(biz.category) ? 92 : 78;
        const compVal = cityData ? cityData.demandScore - 15 : 75;
        const scalabilityVal = ['Technology', 'Content Creation'].includes(biz.category) ? 94 : 65;

        return {
          ...biz,
          matchScore: finalScore,
          feasibility: {
            overall: finalScore,
            risk: riskVal,
            profit: profitVal,
            competition: compVal,
            scalability: scalabilityVal,
            demand: cityData?.demandScore || 80,
            difficulty: biz.difficulty
          },
          justifications: justifications.slice(0, 3)
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3); // Top 3 recommendations

      setMatchmakerResult(matches);
      setIsMatching(false);
      // Scroll down to recommendations elegantly
      setTimeout(() => {
        document.getElementById('matchmaker-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1500);
  };

  return (
    <main className="bg-[#030712] min-h-screen text-slate-200">
      
      {/* 1. HERO SECTION WITH SEARCH AND CHIPS */}
      <section className="relative pt-36 pb-24 lg:pt-48 lg:pb-36 overflow-hidden border-b border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2070&auto=format&fit=crop')] mix-blend-overlay opacity-10 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Tagline */}
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-mono mb-8 backdrop-blur-md">
              <Sparkles size={14} className="text-indigo-400 animate-spin" />
              <span>MEET YOUR PERPETUAL AI CO-FOUNDER</span>
            </span>

            <h1 className="text-5xl md:text-8xl font-bold font-display tracking-tight text-white mb-6 leading-[1.1]">
              Shape Your Vision Into a <br/>
              <span className="gradient-text">Lucrative Enterprise</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-sans">
              Discover suitable markets, evaluate feasibility benchmarks, and generate hyper-detailed blueprints to launch your business with confidence.
            </p>

            {/* AI Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto mb-8">
              <div className="relative flex items-center p-2 rounded-3xl bg-slate-900/60 border border-white/10 shadow-2xl backdrop-blur-xl hover:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all">
                <Search className="ml-4 text-slate-400" size={24} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholders[placeholderIndex]}
                  className="w-full py-4 pl-4 pr-32 bg-transparent text-white text-lg focus:outline-none placeholder:text-slate-500"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/30 font-display flex items-center space-x-2 glow-btn"
                >
                  <Rocket size={18} />
                  <span>Plan Now</span>
                </button>
              </div>
            </form>

            {/* Premium Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 text-sm">
              <span className="text-slate-400 mr-2 font-medium">Quick Filters:</span>
              {[
                { label: 'Low Investment', color: 'hover:border-green-500/30 hover:text-green-400' },
                { label: 'High Profit', color: 'hover:border-purple-500/30 hover:text-purple-400' },
                { label: 'Online Business', color: 'hover:border-blue-500/30 hover:text-blue-400' },
                { label: 'AI Startup', color: 'hover:border-indigo-500/30 hover:text-indigo-400' },
                { label: 'Student Friendly', color: 'hover:border-yellow-500/30 hover:text-yellow-400' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleChipClick(chip.label)}
                  className={`px-4 py-2 rounded-xl bg-slate-900/40 border border-white/5 text-slate-300 transition-all duration-300 backdrop-blur-md ${chip.color} hover:bg-slate-900`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. INTERACTIVE BUDGET CALCULATOR SLIDER & INSTANT RECOMMENDATIONS */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-[#060b18] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest block mb-3">Live Scaling Analysis</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">Interactive Budget Modeler</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Slide the capital scale dynamically to instantly display recommended businesses matching your operational capability.
            </p>
          </div>

          {/* Budget Slider Box */}
          <div className="max-w-4xl mx-auto bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-8 md:p-12 backdrop-blur-lg mb-16 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <div>
                <span className="text-slate-400 font-medium block mb-1">Target Startup Capital</span>
                <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-mono">
                  ₹{budgetSliderValue >= 10000000 
                    ? `${(budgetSliderValue / 10000000).toFixed(2)} Crore` 
                    : `${(budgetSliderValue / 100000).toFixed(1)} Lakhs`}
                </span>
              </div>
              <div className="px-5 py-2.5 rounded-2xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-sm font-semibold flex items-center space-x-2">
                <SlidersHorizontal size={16} />
                <span>Showing {recommendedBusinessesBySlider.length} Eligible businesses</span>
              </div>
            </div>

            {/* The Range Input */}
            <div className="space-y-4 mb-4">
              <input
                type="range"
                min="50000"
                max="50000000"
                step="50000"
                value={budgetSliderValue}
                onChange={(e) => setBudgetSliderValue(Number(e.target.value))}
                className="w-full py-4 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>₹50,000 (Micro Business)</span>
                <span>₹50 Lakhs (SME)</span>
                <span>₹5 Crore (Enterprise Scale)</span>
              </div>
            </div>
          </div>

          {/* Live Updating Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {recommendedBusinessesBySlider.map((biz) => {
                // Score card calculation parameters to display on hover/preview
                const dummyScore = Math.floor(75 + (biz.costValue % 20));
                return (
                  <motion.div
                    layout
                    key={biz.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-slate-900/30 hover:bg-slate-900/50 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 flex flex-col overflow-hidden shadow-xl"
                  >
                    {/* Banner Card Image */}
                    <div className="h-44 w-full relative overflow-hidden">
                      <img 
                        src={biz.image} 
                        alt={biz.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      
                      <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-white/10 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300">
                        {biz.category}
                      </span>

                      {/* Feasibility Indicator */}
                      <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 text-xs text-indigo-300">
                        <Award size={14} />
                        <span className="font-bold">Score: {dummyScore}/100</span>
                      </div>
                    </div>

                    {/* Meta Body */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-3">
                        {biz.name}
                      </h4>

                      <div className="space-y-2 mb-6 flex-grow">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Capital Needed</span>
                          <span className="font-bold text-white font-mono">{biz.cost}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Risk Severity</span>
                          <span className="font-semibold text-slate-300">{biz.difficulty === 'Vary Hard' || biz.difficulty === 'Very High' ? 'High Risk' : biz.difficulty === 'Hard' ? 'Moderate High' : 'Low Risk'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Expected ROI</span>
                          <span className="font-bold text-emerald-400">{biz.profit === 'Very High' ? 'High Margins' : 'Steady Margins'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/generate/${biz.id}`)}
                        className="w-full py-2.5 bg-slate-800 text-slate-200 group-hover:bg-indigo-600 group-hover:text-white rounded-xl font-bold transition-all text-xs border border-white/5 group-hover:border-indigo-600 flex items-center justify-center space-x-2"
                      >
                        <span>Build AI Blueprint</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. AI BUSINESS MATCHMAKER */}
      <section id="matchmaker" className="py-24 bg-[#040816] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest block mb-3">Modular Match Engine</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">AI Business Matchmaker</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Find the perfect business suited to your capital, exact execution skills, geographic city parameters, and risk preferences.
            </p>
          </div>

          {/* Form and Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Matchmaker Form Block */}
            <div className="lg:col-span-5 bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-md flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2 text-white">
                  <SlidersHorizontal size={20} className="text-indigo-400" />
                  <span>Configure Your Profile</span>
                </h3>

                {/* 1. Budget input */}
                <div className="mb-6">
                  <label className="text-slate-400 text-sm font-bold block mb-2">Available Budget: ₹{(matchBudget/100000).toFixed(1)} Lakhs</label>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="50000"
                    value={matchBudget}
                    onChange={(e) => setMatchBudget(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                    <span>₹1 Lakh</span>
                    <span>₹1 Crore</span>
                  </div>
                </div>

                {/* 2. Skills Multiselect checkable items */}
                <div className="mb-6">
                  <label className="text-slate-400 text-sm font-bold block mb-2">Your Professional Core Skills</label>
                  <p className="text-xs text-slate-500 mb-2.5">Select one or more matching properties:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map((sk) => {
                      const isSelected = selectedSkills.includes(sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => handleSkillToggle(sk)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected 
                              ? 'bg-indigo-600 border-indigo-600 text-white' 
                              : 'bg-slate-800/40 border border-white/5 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {sk}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Location Picker */}
                <div className="mb-6">
                  <label className="text-slate-400 text-sm font-bold block mb-2">Target Launch City</label>
                  <select
                    value={matchLocation}
                    onChange={(e) => setMatchLocation(e.target.value)}
                    className="w-full p-3.5 bg-slate-800/60 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {Object.keys(CITIES_DATA).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Time commitment */}
                <div className="mb-6">
                  <label className="text-slate-400 text-sm font-bold block mb-2">Available Time Commitment</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Part-time', 'Full-time', 'Weekend Hustle'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setMatchTime(time)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                          matchTime === time 
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                            : 'bg-slate-800/20 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Risk appetite */}
                <div className="mb-8">
                  <label className="text-slate-400 text-sm font-bold block mb-2">Risk Tolerance level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map((risk) => (
                      <button
                        key={risk}
                        type="button"
                        onClick={() => setMatchRisk(risk as any)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                          matchRisk === risk 
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                            : 'bg-slate-800/20 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {risk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={executeMatchmaker}
                disabled={isMatching}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all glow-btn shadow-lg shadow-indigo-600/20"
              >
                {isMatching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Feasibility Matrix...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Run Co-Founder Evaluation</span>
                  </>
                )}
              </button>
            </div>

            {/* Results recommendations section */}
            <div className="lg:col-span-7 flex flex-col justify-center" id="matchmaker-results">
              {matchmakerResult ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Your Best AI Business Matches</h3>
                    <span className="text-xs text-slate-400">Match score evaluated by custom suitability criteria</span>
                  </div>

                  {matchmakerResult.map((match, index) => (
                    <div
                      key={match.id}
                      className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row gap-6 hover:shadow-xl"
                    >
                      <div className="w-full md:w-40 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={match.image} alt={match.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2 gap-4">
                          <div>
                            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{match.category}</span>
                            <h4 className="text-xl font-extrabold text-white">{match.name}</h4>
                          </div>
                          
                          {/* Matching bubble */}
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-3 py-1.5 text-center">
                            <span className="block text-[10px] text-slate-400 font-bold tracking-wider rounded">SUITABILITY</span>
                            <span className="text-lg font-mono font-bold text-emerald-400">{match.matchScore}%</span>
                          </div>
                        </div>

                        {/* Co-founder advisor bullets */}
                        <div className="space-y-2 mb-4 text-xs text-slate-400">
                          {match.justifications.map((just: string, ji: number) => (
                            <p key={ji} className="flex items-start">
                              <span className="text-indigo-400 font-bold mr-1.5">★</span>
                              <span>{just}</span>
                            </p>
                          ))}
                        </div>

                        {/* Feasibility score matrix */}
                        <div className="grid grid-cols-5 gap-2 border-t border-white/5 pt-3 mb-4 text-[10px]">
                          <div>
                            <span className="text-slate-500 block">Overall Score</span>
                            <span className="font-bold text-white text-xs">{match.feasibility.overall}/100</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Profit Potential</span>
                            <span className="font-bold text-emerald-400 text-xs">High</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Market Demand</span>
                            <span className="font-bold text-white text-xs">{match.feasibility.demand}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Risk Level</span>
                            <span className="font-bold text-red-400 text-xs">{matchRisk}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Difficulty</span>
                            <span className="font-bold text-yellow-500 text-xs">{match.difficulty}</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/generate/${match.id}`)}
                            className="flex-grow py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center space-x-2"
                          >
                            <span>Access Complete Blueprint</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-900/20 border border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center min-h-[350px]">
                  <HelpCircle size={48} className="text-slate-600 mb-4 animate-bounce" />
                  <p className="text-lg text-slate-300 font-bold mb-2">No Profiles Searched Yet</p>
                  <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                    Set your custom constraints in the co-founder panel and hit execution to evaluate top matching suggestions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. LOCATION BASED INSIGHTS */}
      <section className="py-24 bg-[#030611] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest block mb-3">Geo-Demographics</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">Location Based Insights</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Analyze macro competition levels and localized business demand vectors across major Indian cities.
            </p>
          </div>

          {/* City Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-3xl mx-auto">
            {Object.keys(CITIES_DATA).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-6 py-2.5 rounded-full border text-sm font-semibold transition-all ${
                  selectedCity === city 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'border-white/5 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* City Specific Details Box */}
          {selectedCity && CITIES_DATA[selectedCity] && (
            <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-8 md:p-12 backdrop-blur-lg max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* City description */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold mb-2">
                    <MapPin size={14} />
                    <span>REGIONAL SNAPSHOT</span>
                  </span>
                  <h3 className="text-3xl font-extrabold text-white">{selectedCity} Analysis</h3>
                </div>
                
                <p className="text-slate-400 leading-relaxed text-base font-sans">
                  {CITIES_DATA[selectedCity].narrative}
                </p>

                {/* Hot opportunities listing */}
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest mb-3.5">HOT BUSINESS OPPORTUNITIES</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {CITIES_DATA[selectedCity].opportunities.map((opp) => (
                      <button
                        key={opp}
                        onClick={() => {
                          const id = opp.toLowerCase().replace(/\s+/g, '-');
                          navigate(`/generate/${id}`);
                        }}
                        className="px-4 py-2 bg-slate-900/80 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/30 rounded-xl text-xs font-bold text-indigo-300 transition-colors flex items-center space-x-1"
                      >
                        <span>{opp}</span>
                        <ChevronRight size={12} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* City visual progress stats */}
              <div className="lg:col-span-4 bg-slate-950/60 rounded-[2rem] p-6 border border-white/10 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Market Demand Level</span>
                    <span className="font-mono text-indigo-400 font-bold">{CITIES_DATA[selectedCity].demand} ({CITIES_DATA[selectedCity].demandScore}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-500" 
                      style={{ width: `${CITIES_DATA[selectedCity].demandScore}%` }} 
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                  <span className="text-slate-400">Competition Index</span>
                  <span className="font-bold text-slate-300">{CITIES_DATA[selectedCity].competition}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Average Startup costs</span>
                  <span className="font-bold text-emerald-400 font-mono">{CITIES_DATA[selectedCity].avgCost}</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* 5. TRENDING BUSINESSES SECTOR */}
      <section className="py-24 bg-gradient-to-t from-slate-950 to-[#040816] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest block mb-3">Sought After Markets 2026</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">Trending Opportunities</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Tap into fields seeing monumental expansion and regional investments this year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { id: 'ai-startup', name: 'AI Startup', cost: '₹5L - ₹50L', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80', description: 'Agentic workflows, model tailoring.' },
              { id: 'saas-company', name: 'SaaS Company', cost: '₹2L - ₹20L', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=400&q=80', description: 'Micro-SaaS widgets, multi-tenant layers.' },
              { id: 'drone-services', name: 'Drone Services', cost: '₹5L - ₹15L', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80', description: 'Agricultural surveys, industrial mapping.' },
              { id: 'solar-energy', name: 'Solar Energy', cost: '₹10L - ₹50L', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80', description: 'Residential panels, custom distribution.' },
              { id: 'digital-marketing', name: 'Marketing Agency', cost: '₹1L - ₹5L', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80', description: 'SEO growth loops, active viral networks.' },
              { id: 'youtube-studio', name: 'Content Agency', cost: '₹1L - ₹10L', image: 'https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?auto=format&fit=crop&w=400&q=80', description: 'Podcast systems, cinematic production.' },
              { id: 'cybersecurity-firm', name: 'Cybersecurity', cost: '₹10L - ₹50L', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80', description: 'White-hat auditing, enterprise firewalls.' },
              { id: 'smart-home', name: 'Smart Home Installs', cost: '₹2L - ₹10L', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80', description: 'IoT automation, localized sensor fits.' },
              { id: '3d-printing', name: '3D Printing Lab', cost: '₹3L - ₹15L', image: 'https://images.unsplash.com/photo-1581092336336-6e27b615b1a3?auto=format&fit=crop&w=400&q=80', description: 'Custom medical/retail mock models.' },
              { id: 'data-analytics', name: 'Data Company', cost: '₹5L - ₹20L', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80', description: 'Market pipelines, custom business intelligence.' }
            ].map((opp, idx) => (
              <div 
                key={opp.id} 
                onClick={() => navigate(`/generate/${opp.id}`)}
                className="group bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl"
              >
                <div className="h-32 w-full relative">
                  <img src={opp.image} alt={opp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-950/40" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{opp.name}</h4>
                  <p className="text-[11px] text-slate-400 mb-2 font-semibold">Cost: {opp.cost}</p>
                  <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{opp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SUCCESS STORIES */}
      <section className="py-24 bg-[#030611] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest block mb-3">Platform Proof</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">Entrepreneur Success Stories</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Read how founders leverage specialized AI layouts to refine overhead budgets, source supplies, and maximize local yield.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUCCESS_STORIES.map((story, i) => (
              <div 
                key={i} 
                className="bg-slate-900/30 border border-white/5 rounded-[2rem] p-6 hover:border-indigo-500/20 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={story.image} 
                    alt={story.founder} 
                    className="w-12 h-12 rounded-full object-cover border border-indigo-500/20" 
                  />
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">{story.founder}</h4>
                    <span className="text-[11px] text-indigo-400 font-medium">{story.business}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                  "{story.story}"
                </p>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Verified Revenue</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded-md">{story.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE STARTSPHERE PLATFORM */}
      <section className="py-24 bg-[#01030a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">Why Launch with StartSphere?</h2>
            <p className="text-slate-400 max-w-md mx-auto">SaaS planning instruments configured for 100% startup validation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Rocket, title: 'AI Business Advisor', desc: 'Synthesizes targeted business systems, suppliers, and equipment data dynamically.' },
              { icon: SlidersHorizontal, title: 'Scalable Match Matrix', desc: 'Evaluates location density, cost ceilings, and risk appetites in real-time.' },
              { icon: Factory, title: 'Indian Supplier Directory', desc: 'Establishes instant alignment with custom regional supply lines.' },
              { icon: TrendingUp, title: 'Verified Revenue Forecasts', desc: 'Predictive modeling displays break-even month metrics and operational costs.' },
              { icon: ShieldCheck, title: 'Risk Diagnostics', desc: 'Pinpoint potential regional competition and high-friction operations.' },
              { icon: Award, title: 'Complete Checklist Guides', desc: 'Foolproof blueprints mapping step-by-step validation procedures.' },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-[2rem] bg-slate-900/30 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <feature.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};
