import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LogOut, Heart, ArrowRight, RefreshCw, Home
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const SignOut = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Perform logout action instantly
    logout();

    // Setup countdown timer for automatic home redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [logout, navigate]);

  return (
    <div className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center bg-[#030712] text-slate-200 px-4 relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative text-center"
      >
        <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-400 mb-6 shadow-lg shadow-red-500/5">
          <LogOut size={32} />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white font-display mb-3">Signed Out Successfully</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">
          You have been logged out of your session. All your local business plans are securely preserved in local persistence databases.
        </p>

        {/* Heartful disclaimer */}
        <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5 flex items-center justify-center gap-2 mb-8 text-xs text-slate-400">
          <Heart size={14} className="text-pink-500 fill-pink-500 animate-pulse" />
          <span>Thank you for building with StartSphere!</span>
        </div>

        {/* Countdown indicator */}
        <p className="text-xs text-slate-500 mb-6 flex items-center justify-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span>Redirecting to Home in <strong className="text-indigo-400">{countdown}s</strong>...</span>
        </p>

        {/* Navigation Action options */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/"
            className="py-3 px-4 bg-slate-950/60 hover:bg-slate-800 border border-white/10 rounded-xl transition-all text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5"
          >
            <Home size={14} />
            <span>Go to Home</span>
          </Link>

          <Link
            to="/login"
            className="py-3 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all text-xs font-bold text-white flex items-center justify-center gap-1.5 group"
          >
            <RefreshCw size={14} />
            <span>Sign In Again</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
