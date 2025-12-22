import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, User as UserIcon, Loader2, AlertCircle, ShoppingBag, Truck, ArrowRight } from 'lucide-react';
import { setCredentials } from '../../store/slices/authSlice';
import api from '../../services/api';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/register', formData);
      if (response.data.success) {
        dispatch(setCredentials(response.data.data));
        const redirectPath = formData.role === 'restaurant_owner' ? '/partner/onboarding'
          : formData.role === 'delivery_partner' ? '/delivery/dashboard'
            : '/restaurants';
        navigate(redirectPath);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please use a different email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-32 pb-20 px-6 relative overflow-hidden bg-white">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-secondary/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-primary/5 blur-[140px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-[18px] flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-black text-2xl">F</span>
              </div>
              <span className="text-3xl font-display font-bold text-dark-900 tracking-tight group-hover:text-primary transition-colors">
                Food<span className="text-primary">Bey</span>
              </span>
            </Link>
          </div>
          <h1 className="text-4xl font-display font-bold text-dark-900 mb-2 tracking-tight">Create an Account</h1>
          <p className="text-gray-500 font-medium">Join the FoodBey family today</p>
        </div>

        <div className="bg-white p-10 border border-gray-100 shadow-xl rounded-[32px]">
          {error && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl flex items-center gap-4 mb-8"
            >
              <AlertCircle size={24} />
              <span className="text-sm font-semibold">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Type Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">I want to join as a:</label>
              <div className="grid grid-cols-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'customer' })}
                  className={`py-3.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${formData.role === 'customer' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-dark-900'}`}
                >
                  <UserIcon size={14} /> Customer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'restaurant_owner' })}
                  className={`py-3.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${formData.role === 'restaurant_owner' ? 'bg-secondary text-white shadow-md' : 'text-gray-500 hover:text-dark-900'}`}
                >
                  <ShoppingBag size={14} /> Restaurant
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'delivery_partner' })}
                  className={`py-3.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${formData.role === 'delivery_partner' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-dark-900'}`}
                >
                  <Truck size={14} /> Delivery
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-dark-900 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-dark-900 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-dark-900 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 font-bold uppercase tracking-widest text-sm shadow-md active:scale-[0.98] ${formData.role === 'customer'
                ? 'bg-primary text-white hover:bg-primary/90'
                : formData.role === 'restaurant_owner'
                  ? 'bg-secondary text-white hover:bg-secondary/90'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm font-medium">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline ml-1">Sign in here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
