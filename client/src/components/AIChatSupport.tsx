import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, TrendingUp, ShoppingBag, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import api from '../services/api';

const AIChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { items } = useSelector((state: any) => state.cart);

  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: `Hello ${user?.profile.name || 'there'}! I'm your FoodBey Assistant. How can I help you today? I can track orders, check your balance, or assist with refunds.`, time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/ai/chat', {
        messages: messages.concat(userMsg).map(m => ({ role: m.role, content: m.content })),
        context: {
          userName: user?.profile.name,
          walletBalance: user?.wallet?.balance,
          loyaltyPoints: user?.wallet?.loyaltyPoints,
          cartItemsCount: items.length,
          cartTotal: items.reduce((a: any, b: any) => a + (b.price * b.quantity), 0)
        }
      });

      const aiMsg = response.data.data;
      setMessages(prev => [...prev, { ...aiMsg, time: new Date() }]);
    } catch (err) {
      console.error("AI Chat failed", err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting to the service. Please try again in a moment.",
        time: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-[400px] h-[640px] bg-white border border-gray-100 rounded-[32px] shadow-2xl overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="bg-primary p-8 flex items-center justify-between relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">FoodBey Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Support Agent Online</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="relative z-10 p-2 text-white/80 hover:text-white transition-colors bg-white/10 rounded-xl">
                <X size={20} />
              </button>
            </div>

            {/* AI Assistant Quick Stats */}
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex gap-4 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm shrink-0">
                <Wallet size={14} className="text-amber-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">₹{user?.wallet?.balance || 0}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm shrink-0">
                <ShoppingBag size={14} className="text-primary" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{items.length} Items</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm shrink-0">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Updates</span>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-white">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-primary text-white font-semibold rounded-tr-none'
                    : 'bg-gray-50 text-gray-700 rounded-tl-none border border-gray-100'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1 items-center">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-8 border-t border-gray-100 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask any question..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-6 pr-14 text-dark-900 placeholder:text-gray-400 focus:border-primary transition-all outline-none font-medium"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-xl hover:scale-110 transition-all shadow-md"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide">
                {['Track Order', 'Check Balance', 'Recommend Food'].map(choice => (
                  <button
                    key={choice}
                    onClick={() => setInput(choice)}
                    className="text-[9px] font-bold text-gray-400 hover:text-primary uppercase tracking-widest transition-colors py-2 px-3 border border-gray-100 rounded-lg whitespace-nowrap"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-[22px] bg-primary text-white shadow-xl flex items-center justify-center relative group"
      >
        {isOpen ? <X size={28} /> : (
          <>
            <MessageSquare size={28} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
          </>
        )}
      </motion.button>
    </div>
  );
};

export default AIChatSupport;
