import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  ShoppingBag,
  MapPin,
  Clock,
  Receipt,
  ChevronRight,
  Utensils,
  Star,
  Smartphone,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api, { getFullImageUrl } from '../../services/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();

    // Fire confetti for celebration
    const duration = 4 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#00f3ff', '#7000ff', '#ff00c8']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#00f3ff', '#7000ff', '#ff00c8']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.data);
    } catch (err) {
      console.error("Failed to fetch order details", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Securing your feast...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Main Success Card */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden relative"
            >
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                  className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-green-200"
                >
                  <CheckCircle className="text-white" size={40} />
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-display font-black text-dark-900 tracking-tight leading-tight mb-4">
                  Payment Successful!
                </h1>
                <p className="text-gray-500 text-lg font-medium max-w-md leading-relaxed">
                  Chef at <span className="text-dark-900 font-bold">{order?.restaurant?.name || 'the kitchen'}</span> has received your order and started preparing.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  <div className="bg-gray-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-gray-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</span>
                    <span className="text-sm font-bold text-dark-900 font-mono">#{id?.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-gray-100">
                    <Clock className="text-primary" size={14} />
                    <span className="text-sm font-bold text-dark-900 uppercase tracking-tight">Est. 35-40 mins</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Items Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Receipt className="text-primary" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-dark-900">Order Summary</h3>
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{order?.items?.length} Items</span>
              </div>

              <div className="space-y-6">
                {order?.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={getFullImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 border ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center p-0.5`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                          </div>
                          <h4 className="font-bold text-dark-900">{item.name}</h4>
                        </div>
                        <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">{item.quantity} x ₹{item.price}</p>
                      </div>
                    </div>
                    <span className="font-bold text-dark-900 font-mono">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span>Item Total</span>
                  <span className="font-mono text-dark-900">₹{order?.billing?.itemTotal}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span>Delivery & Taxes</span>
                  <span className="font-mono text-dark-900">₹{order?.billing?.deliveryFee + order?.billing?.tax + order?.billing?.platformFee}</span>
                </div>
                {order?.billing?.surgeFee > 0 && (
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-primary">
                    <span>Peak Hour Surge</span>
                    <span className="font-mono">₹{order?.billing?.surgeFee}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                  <span className="text-sm font-black text-dark-900 uppercase tracking-[0.2em]">Grand Total</span>
                  <span className="text-2xl font-black text-dark-900 font-mono tracking-tighter">₹{order?.billing?.grandTotal}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Tracking / Action Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-dark-900 rounded-[32px] p-8 text-white shadow-2xl shadow-dark-900/40 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />

              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <Smartphone className="text-primary" size={24} />
                  Live Tracking
                </h3>

                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                  <div className="flex gap-4 relative">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                      <div className="w-2 h-2 bg-dark-900 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Payment Verified</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Order #88392 confirmed</p>
                    </div>
                  </div>
                  <div className="flex gap-4 relative">
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-white/40 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white/60">Heading to Kitchen</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Chef is preparing your meal</p>
                    </div>
                  </div>
                  <div className="flex gap-4 relative">
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-white/20 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white/30">Assigning Pilot</p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Delivery partner nearby</p>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/orders?id=${id}`}
                  className="w-full mt-12 bg-white text-dark-900 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-95 group shadow-lg"
                >
                  Track in Real-time <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-center text-[10px] font-bold text-gray-500 mt-6 uppercase tracking-widest flex items-center justify-center gap-2">
                  <ShieldCheck size={12} className="text-green-500" /> Insured by FoodBey
                </p>
              </div>
            </motion.div>

            {/* Delivery Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100"
            >
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                    <MapPin className="text-secondary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivering To</h4>
                    <p className="font-bold text-dark-900 leading-tight">{order?.deliveryAddress?.addressLine}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">{order?.deliveryAddress?.city}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                    <Utensils className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">From Restaurant</h4>
                    <p className="font-bold text-dark-900 leading-tight">{order?.restaurant?.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={10} className="fill-orange-400 text-orange-400" />
                      <span className="text-[10px] font-black uppercase text-orange-400">4.8 • Top Rated</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <Link
              to="/dashboard"
              className="w-full text-center block text-[10px] font-black text-gray-400 hover:text-dark-900 uppercase tracking-[0.3em] transition-colors"
            >
              Return to Feed
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
