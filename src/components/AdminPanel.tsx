import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, TrendingUp, Users, Database, Plus, MoreVertical, Edit, Search, ExternalLink, Package, ShoppingBasket } from 'lucide-react';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'products' | 'orders'>('suppliers');

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-slate-900 text-white rounded-3xl">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Admin Control</h1>
              <p className="text-slate-600">Overview of platform revenue and suppliers.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold flex items-center space-x-2 hover:bg-slate-50 transition-all">
              <Plus size={18} />
              <span>Add Product</span>
            </button>
            <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-primary-600/20 hover:scale-105 transition-all">
              <Plus size={18} />
              <span>Invite Supplier</span>
            </button>
          </div>
        </div>

        {/* Global Performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Revenue', value: '$842,000', change: '+12%', icon: TrendingUp },
            { label: 'Total Users', value: '14,204', change: '+5%', icon: Users },
            { label: 'Active Suppliers', value: '284', change: '+2', icon: Database },
            { label: 'Orders Placed', value: '4,102', change: '+18%', icon: ShieldCheck },
          ].map((item) => (
            <div key={item.label} className="bg-white p-8 rounded-[2rem] border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                  <item.icon size={20} />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">{item.change}</span>
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase mb-1">{item.label}</p>
              <p className="text-3xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-slate-200 px-4">
          {[
            { id: 'suppliers', label: 'Suppliers', icon: Database },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBasket },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 flex items-center space-x-2 font-bold transition-all relative ${
                activeTab === tab.id ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          {activeTab === 'suppliers' && (
            <>
              <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-slate-900">Platform Suppliers</h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search suppliers..." 
                    className="pl-12 pr-6 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-600 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-bold uppercase tracking-widest">
                      <th className="px-8 py-5">Supplier Name</th>
                      <th className="px-8 py-5">Rating</th>
                      <th className="px-8 py-5">Category</th>
                      <th className="px-8 py-5">Revenue Share</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: 'Gourmet Machine Pro', rating: '4.9', category: 'Coffee Equipment', share: '$12,400' },
                      { name: 'EcoLuxe Textiles', rating: '4.8', category: 'Clothing', share: '$8,200' },
                      { name: 'Nordic Woodworks', rating: '4.7', category: 'Furniture', share: '$15,900' },
                    ].map((sup) => (
                      <tr key={sup.name} className="hover:bg-slate-50/50 transition-all font-medium">
                        <td className="px-8 py-6 text-slate-900">{sup.name}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <span>★</span>
                            <span>{sup.rating}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                            {sup.category}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-slate-900">{sup.share}</td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-2 text-slate-400 hover:text-primary-600 transition-all"><Edit size={18} /></button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 transition-all"><MoreVertical size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'products' && (
            <div className="p-20 text-center text-slate-500">
              <Package className="mx-auto mb-4 opacity-20" size={48} />
              <p className="font-bold">Product Catalog Management</p>
              <p className="text-sm">Manage inventory and global pricing lists.</p>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="p-20 text-center text-slate-500">
              <ShoppingBasket className="mx-auto mb-4 opacity-20" size={48} />
              <p className="font-bold">Active Customer Orders</p>
              <p className="text-sm">Track shipments and payment processing statuses.</p>
            </div>
          )}

          <div className="p-6 bg-slate-50 text-center">
            <button className="text-primary-600 font-bold text-sm hover:underline flex items-center justify-center space-x-2 mx-auto">
              <span>View Full Analytics Report</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
