import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, User, Menu, X, LogOut, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { user, login, logout } = useAuth();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Rocket size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold font-display tracking-tighter text-white">StartSphere</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`font-medium transition-colors ${
                  location.pathname === link.path 
                    ? 'text-indigo-400' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
                <Link to="/dashboard" className="flex items-center space-x-2 p-1 pr-3 hover:bg-white/5 rounded-full transition-all">
                  <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-white/10 shadow-md" />
                  <span className="text-sm font-bold text-slate-200">{user.displayName?.split(' ')[0]}</span>
                </Link>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-red-400 transition-all">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={login} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20">
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 text-base font-medium ${
                    location.pathname === link.path ? 'text-indigo-400 bg-white/5' : 'text-slate-300 hover:text-white'
                  } rounded-xl`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex space-x-4 pt-4 px-3 border-t border-white/5">
                {user ? (
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-2">
                      <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-white/10" />
                      <span className="text-sm font-bold text-slate-200">{user.displayName}</span>
                    </div>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="text-slate-400 hover:text-red-400">
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { login(); setIsOpen(false); }} className="flex items-center justify-center space-x-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm">
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
