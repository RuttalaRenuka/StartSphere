import React from 'react';
import { motion } from 'motion/react';
import { History, LayoutDashboard, Bookmark, FileText, Settings, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const savedPlans = JSON.parse(localStorage.getItem('startsphere_plans') || '[]');

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 mb-12">
          <div className="p-4 bg-primary-600 text-white rounded-3xl shadow-lg shadow-primary-600/20">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">User Dashboard</h1>
            <p className="text-slate-600">Track your business launches and saved reports.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Menu */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { icon: Bookmark, label: 'Saved Plans', active: true, to: '#' },
              { icon: FileText, label: 'Downloaded Reports', active: false, to: '#' },
              { icon: History, label: 'Comparison History', active: false, to: '/compare' },
              { icon: Settings, label: 'Account Settings', active: false, to: '#' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                  item.active ? 'bg-white text-primary-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Main Dashboard Panel */}
          <div className="lg:col-span-9 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Active Plans', value: savedPlans.length, color: 'bg-blue-50 text-blue-600' },
                { label: 'Recent Searches', value: '12', color: 'bg-green-50 text-green-600' },
                { label: 'Platform Ranking', value: 'Top 5%', color: 'bg-purple-50 text-purple-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-8 rounded-3xl border border-slate-200">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-4xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Saved Plans List */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 px-2">Recent Business Blueprints</h3>
              {savedPlans.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <Bookmark className="mx-auto text-slate-300 mb-4" size={48} />
                  <p className="text-slate-500 max-w-xs mx-auto">You haven't generated any business plans yet.</p>
                  <Link to="/" className="mt-6 inline-block text-primary-600 font-bold hover:underline">Explore Business Ideas →</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedPlans.map((plan: any, idx: number) => (
                    <div key={idx} className="group p-6 rounded-3xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl md:flex hidden items-center justify-center text-2xl">
                          {plan.category[0]}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-900">{plan.category}</h4>
                          <p className="text-slate-500">Generated on {new Date(plan.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right hidden md:block">
                          <p className="font-bold text-slate-900">₹{plan.budget.standard.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-slate-500">Standard Budget</p>
                        </div>
                        <Link 
                          to={`/generate/${plan.category.toLowerCase().replace(/ /g, '-')}`}
                          className="p-4 bg-slate-100 group-hover:bg-primary-600 group-hover:text-white rounded-2xl transition-all"
                        >
                          <ArrowRight size={20} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
