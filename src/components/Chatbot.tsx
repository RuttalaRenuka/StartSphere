import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { chatWithAI } from '../lib/gemini';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggestions chips
  const suggestionChips = [
    "What business can I start with ₹5 Lakhs?",
    "Suggest high-profit student-friendly models",
    "Best high scalability online ideas?",
    "Low risk brick & mortar options"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const rawMessage = (textToSend || message).trim();
    if (!rawMessage || loading) return;

    setMessage('');
    setErrorText(null);
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: rawMessage }] }]);
    setLoading(true);

    try {
      // Create user context payload for Gemini
      const response = await chatWithAI(rawMessage, messages);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response.text }] }]);
    } catch (error: any) {
      console.error(error);
      // Premium user-friendly custom error recovery message
      setErrorText("I am experiencing transient high traffic volume at the moment, but you can still search any business in the analyzer box above to instantly generate complete, highly customized business blueprints!");
      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: "Hold tight! My co-founder servers are facing high demand right now. While I troubleshoot, why not explore our pre-configured categories and interactive sliders on the homepage? They are fully loaded with exact equipment, suppliers, and profit projections!" }] 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chipText: string) => {
    handleSend(chipText);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 shadow-indigo-600/30 group border border-indigo-400/20"
      >
        <MessageSquare size={26} className="text-white group-hover:rotate-6 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-400 rounded-full border border-slate-950" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-[420px] max-w-[90vw] h-[640px] bg-slate-950/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl z-50 flex flex-col border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 border-b border-white/5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 shadow-md">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">StartSphere Co-Founder</h3>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Business Advisor Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/10 p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              
              {messages.length === 0 && (
                <div className="py-8 space-y-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5 text-indigo-400">
                      <HelpCircle size={24} />
                    </div>
                    <p className="text-slate-300 text-sm font-semibold mb-1">Your Virtual AI Advisory Partner</p>
                    <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
                      Ask me anything regarding licensing, taxation, machinery, marketing funnels, or profit forecasts!
                    </p>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block text-center">POPULAR DISCOVERIES</span>
                    <div className="flex flex-col gap-2">
                      {suggestionChips.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleChipClick(chip)}
                          className="w-full text-left p-3.5 rounded-xl bg-slate-900 hover:bg-indigo-950/40 border border-white/5 hover:border-indigo-500/30 transition-all text-xs font-semibold text-slate-300 hover:text-indigo-300"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Message dialogue bubble loops */}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[1.5rem] leading-relaxed text-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/15' 
                      : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-white/5 p-4 rounded-[1.5rem] rounded-tl-none flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">ADVISOR FORMULATING...</span>
                  </div>
                </div>
              )}

              {errorText && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-2.5 text-xs text-red-400 leading-normal">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-400" />
                  <span>{errorText}</span>
                </div>
              )}
            </div>

            {/* Footer Form field */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
              className="p-6 border-t border-white/5 bg-slate-900/60"
            >
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything about starting a business..."
                  className="w-full pl-4 pr-12 py-4 bg-slate-950 border border-white/10 rounded-2xl text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="absolute right-2 top-2 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:bg-slate-800"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
