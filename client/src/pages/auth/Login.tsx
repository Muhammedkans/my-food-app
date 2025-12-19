import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, Mail, Lock, Loader2, AlertCircle, User as UserIcon, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { setCredentials } from '../../store/slices/authSlice';
import api from '../../services/api';
import type { RootState } from '../../store/store';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'customer' | 'restaurant_owner' | 'delivery_partner'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.auth.role === 'admin') navigate('/admin');
      else if (user.auth.role === 'restaurant_owner') navigate('/partner/dashboard');
      else if (user.auth.role === 'delivery_partner') navigate('/delivery/dashboard');
      else navigate('/restaurants');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Pass role as well just in case backend filters, though usually email/pass is enough
      // But adding it makes the flow "separate" and "proper" as requested
      const response = await api.post('/auth/login', { email, password, role });
      if (response.data.success) {
        dispatch(setCredentials(response.data.data));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'restaurant_owner': return 'bg-secondary';
      case 'delivery_partner': return 'bg-blue-600';
      default: return 'bg-primary';
    }
  };

  const getRoleGlow = () => {
    switch (role) {
      case 'restaurant_owner': return 'shadow-secondary/20';
      case 'delivery_partner': return 'shadow-blue-600/20';
      default: return 'shadow-primary/20';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-white">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
          className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full ${role === 'customer' ? 'bg-primary' : role === 'restaurant_owner' ? 'bg-secondary' : 'bg-blue-600'}`}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 12, repeat: Infinity }}
          className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full ${role === 'customer' ? 'bg-blue-400' : 'bg-primary'}`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transition-colors duration-500 ${getRoleColor()} ${getRoleGlow()}`}
          >
            <LogIn className="text-white" size={32} />
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-dark-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 font-medium tracking-wide">Enter your credentials to continue</p>
        </div>

        <div className="bg-white p-1 pb-10 border border-gray-100 shadow-2xl rounded-[40px] relative overflow-hidden">

          {/* Role Selection Tabs */}
          <div className="p-1.5 flex bg-gray-50/50 rounded-t-[38px] border-b border-gray-50 mb-8">
            <button
              onClick={() => setRole('customer')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[32px] text-xs font-bold uppercase tracking-widest transition-all ${role === 'customer' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-dark-900'}`}
            >
              <UserIcon size={14} /> Customer
            </button>
            <button
              onClick={() => setRole('restaurant_owner')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[32px] text-xs font-bold uppercase tracking-widest transition-all ${role === 'restaurant_owner' ? 'bg-white text-secondary shadow-sm' : 'text-gray-400 hover:text-dark-900'}`}
            >
              <ShoppingBag size={14} /> Partner
            </button>
            <button
              onClick={() => setRole('delivery_partner')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[32px] text-xs font-bold uppercase tracking-widest transition-all ${role === 'delivery_partner' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-dark-900'}`}
            >
              <Truck size={14} /> Delivery
            </button>
          </div>

          <div className="px-10">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ x: 20, opacity: 0, scale: 0.95 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 mb-8"
                >
                  <AlertCircle size={20} />
                  <span className="text-sm font-semibold">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 w-12 h-full flex items-center justify-center pointer-events-none">
                    <Mail className="text-gray-300 group-focus-within:text-dark-900 transition-colors" size={20} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[22px] py-4.5 pl-12 pr-4 text-dark-900 focus:outline-none focus:border-dark-900 focus:bg-white transition-all font-bold placeholder:text-gray-300"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Password</label>
                  <a href="#" className="text-xs font-bold text-gray-400 hover:text-primary transition-colors">Forgot PWD?</a>
                </div>
                <div className="relative group">
                  <div className="absolute left-0 top-0 w-12 h-full flex items-center justify-center pointer-events-none">
                    <Lock className="text-gray-300 group-focus-within:text-dark-900 transition-colors" size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[22px] py-4.5 pl-12 pr-12 text-dark-900 focus:outline-none focus:border-dark-900 focus:bg-white transition-all font-bold placeholder:text-gray-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-dark-900 transition-colors"
                  >
                    <motion.div animate={{ rotate: showPassword ? 0 : 180 }}>
                      {showPassword ? "Hide" : "Show"}
                    </motion.div>
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-white py-5 rounded-[22px] flex items-center justify-center gap-3 shadow-xl transition-all duration-300 disabled:opacity-50 font-bold uppercase tracking-[0.2em] text-sm group ${getRoleColor()} ${getRoleGlow()}`}
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <span>Sign Into Account</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-500 text-sm font-medium">
                New to FoodBey? <Link to="/register" className="text-dark-900 font-bold hover:text-primary transition-colors ml-1 border-b-2 border-dark-900/10 hover:border-primary/20">Create account</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
