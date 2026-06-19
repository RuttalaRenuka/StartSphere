import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Shirt, Cake, Video, Dumbbell, Sparkles, Truck, BookOpen, Monitor, Leaf, ArrowRight } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '../data/categories';
import { useNavigate } from 'react-router-dom';

const ICON_MAP: Record<string, any> = {
  Coffee, Shirt, Cake, Video, Dumbbell, Sparkles, Truck, BookOpen, Monitor, Leaf
};

const CATEGORY_IMAGES: Record<string, string> = {
  'coffee-shop': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2078&auto=format&fit=crop',
  'clothing-brand': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
  'bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop',
  'youtube-studio': 'https://images.unsplash.com/photo-1598550476439-6847785fce66?q=80&w=2070&auto=format&fit=crop',
  'gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
  'beauty-salon': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2074&auto=format&fit=crop',
  'food-truck': 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?q=80&w=2070&auto=format&fit=crop',
  'book-store': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2090&auto=format&fit=crop',
  'it-company': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
  'organic-farm': 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop',
};

export const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <section id="categories" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Path</h2>
          <p className="text-lg text-slate-600">Select a business category to start your AI-powered journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BUSINESS_CATEGORIES.map((category, index) => {
            const Icon = ICON_MAP[category.icon] || Coffee;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden bg-white rounded-3xl border border-slate-200 hover:border-primary-500 transition-all hover:shadow-2xl hover:shadow-primary-600/10"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={CATEGORY_IMAGES[category.id]} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-lg text-primary-600">
                    <Icon size={24} />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{category.name}</h3>
                  <p className="text-slate-600 mb-6">{category.description}</p>
                  <button 
                    onClick={() => navigate(`/generate/${category.id}`)}
                    className="w-full py-4 px-2 flex items-center justify-center space-x-2 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all group-hover:bg-primary-600 text-sm"
                  >
                    <span>Generate Complete Business Blueprint</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
