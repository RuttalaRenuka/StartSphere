import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Rocket, Mail, User, Shield, Info, ArrowRight, Check, Sparkles, Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Determine redirection path (fallback to home)
  const from = (location.state as any)?.from?.pathname || '/';

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!displayName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (isSignUp && (!password || password.length < 6)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        // Mock successful sign up message
        setSuccess('Account created successfully! Logging you in...');
        setTimeout(async () => {
          try {
            await login(displayName, email);
            navigate(from, { replace: true });
          } catch (err) {
            setError('Auto-sign in after registration failed.');
          }
        }, 1200);
      } else {
        await login(displayName, email);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(isSignUp ? 'Registration failed. Please try again.' : 'Sign In failed. Please try again.');
    } finally {
      if (!isSignUp) setLoading(false);
    }
  };

  const handlePresetLogin = async (name: string, mail: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await login(name, mail);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Preset Sign In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center bg-[#030712] text-slate-200 px-4 relative overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-600/10">
            <Rocket size={30} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-display mb-2">
            {isSignUp ? 'Create Your Account' : 'Welcome to StartSphere'}
          </h2>
          <p className="text-sm text-slate-400 px-4">
            {isSignUp 
              ? 'Join StartSphere and begin building elite AI business plans' 
              : 'Launch and configure your AI-powered business blueprint'
            }
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative">
          
          {user && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
              <Check className="text-emerald-400 flex-shrink-0" size={18} />
              <div className="text-xs">
                <span className="text-white font-bold block">Currently Logged In</span>
                <span className="text-slate-300">{user.displayName} ({user.email})</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-300 animate-pulse">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3.5 bg-emerald-500/15 border border-emerald-500/25 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
              <Check size={16} className="mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleCustomLogin} className="space-y-5">
            <div>
              <label htmlFor="name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User size={18} />
                </div>
                <input
                  id="name-input"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Renuka Ruttala"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email-input" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="123@gmail.com"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="pwd-input" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Create Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    id="pwd-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={isSignUp}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                  />
                </div>
              </motion.div>
            )}

            <button
              id="submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Account Exist Toggle Footnote */}
          <div className="mt-6 text-center text-xs">
            <span className="text-slate-400">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button
              id="auth-toggle-btn"
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              className="text-indigo-400 hover:text-indigo-300 font-bold underline focus:outline-none cursor-pointer"
            >
              {isSignUp ? 'Sign In Instead' : 'Create an Account'}
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center justify-between gap-4">
            <div className="h-px bg-white/5 flex-grow" />
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Quick Access Preset</span>
            <div className="h-px bg-white/5 flex-grow" />
          </div>

          {/* Quick Login preset tailored for user's explicit specification */}
          <button
            id="preset-login-btn"
            onClick={() => handlePresetLogin('Renuka Ruttala', '123@gmail.com')}
            className="w-full p-4 rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop" 
                  alt="Renuka Ruttala" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <span>Renuka Ruttala</span>
                  <Sparkles size={11} className="text-amber-400" />
                </p>
                <p className="text-[11px] text-slate-500">123@gmail.com</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity">
              <Check size={14} />
            </div>
          </button>
        </div>

        {/* Interactive terms footnote */}
        <div className="text-center mt-6 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Shield size={13} className="text-slate-600" />
          <span>Secure sandbox session with mock databases</span>
        </div>
      </motion.div>
    </div>
  );
};
