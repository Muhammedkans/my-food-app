import { useEffect, useState } from 'react';
import {
  CheckCircle, Clock, MapPin,
  ChefHat, Truck, ArrowRight,
  Loader2, Phone, MessageSquare, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { socket } from '../../services/socket';
import api from '../../services/api';
import type { RootState } from '../../store/store';

const OrderTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const orderId = new URLSearchParams(location.search).get('id');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 'PLACED', label: 'Order Placed', icon: Clock },
    { id: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
    { id: 'PREPARING', label: 'Preparing', icon: ChefHat },
    { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle }
  ];

  const getStepFromStatus = (status: string) => {
    const index = steps.findIndex(s => s.id === status);
    return index !== -1 ? index + 1 : 1;
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const res = await api.get(`/orders/${orderId}`);
        if (res.data.success) {
          setOrder(res.data.data);
          setActiveStep(getStepFromStatus(res.data.data.status));
        }
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Socket logic
    if (user?._id) {
      socket.connect();
      socket.emit('join_room', user._id);

      socket.on('order_status_updated', (data) => {
        if (data.orderId === orderId) {
          setActiveStep(getStepFromStatus(data.status));
          setOrder((prev: any) => ({ ...prev, status: data.status }));
        }
      });
    }

    return () => {
      socket.off('order_status_updated');
      socket.disconnect();
    };
  }, [orderId, user?._id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen pt-24 text-center text-white">
      <h2 className="text-2xl font-bold">Order not found</h2>
      <button onClick={() => navigate('/restaurants')} className="mt-4 text-primary hover:underline">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="glass-panel p-8 mb-8 border-white/5 bg-dark-800/50">
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Order Activity</h1>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-sm uppercase">#{order._id.slice(-8)}</span>
            </div>
            <p className="text-gray-400">Current Status: <span className="text-primary font-bold">{order.status.replace(/_/g, ' ')}</span></p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Bill</p>
            <p className="text-3xl font-bold text-white tracking-tighter">₹{order.billing?.grandTotal}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-4 px-2">
          <div className="absolute left-6 right-6 top-[3.25rem] h-1 bg-dark-900 rounded-full" />
          <div
            className="absolute left-6 h-1 bg-primary transition-all duration-700 ease-out rounded-full shadow-[0_0_15px_rgba(0,243,255,0.4)]"
            style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 96}%`, top: '3.25rem' }}
          />

          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isActive = index + 1 <= activeStep;
              const isCurrent = index + 1 === activeStep;

              return (
                <div key={step.id} className="flex flex-col items-center group">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 z-10 ${isActive
                      ? 'bg-dark-900 border-primary text-primary shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                      : 'bg-dark-800 border-white/5 text-gray-600'
                      }`}
                  >
                    <step.icon size={24} className={isCurrent ? 'animate-pulse' : ''} />
                  </div>
                  <div className={`mt-5 text-center transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-gray-500'}`}>{step.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Premium Interactive Tracking Map */}
        <div className="md:col-span-2 glass-panel p-0 h-[450px] relative overflow-hidden group border-white/5 bg-dark-900/40">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1000 1000">
              {/* City Grid Lines */}
              {[...Array(20)].map((_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="1000" stroke="white" strokeWidth="0.5" opacity="0.2" />
              ))}
              {[...Array(20)].map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="white" strokeWidth="0.5" opacity="0.2" />
              ))}
              {/* Main Roads */}
              <path d="M0,500 L1000,500" stroke="rgba(0,243,255,0.1)" strokeWidth="4" />
              <path d="M500,0 L500,1000" stroke="rgba(0,243,255,0.1)" strokeWidth="4" />
            </svg>
          </div>

          {/* Interactive Elements */}
          <div className="absolute inset-0 z-10">
            {/* Driver Marker */}
            <motion.div
              animate={{
                x: activeStep < 3 ? 100 : activeStep === 3 ? 300 : 450,
                y: activeStep < 3 ? 100 : activeStep === 3 ? 200 : 400
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute w-12 h-12 flex flex-col items-center justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-dark-900 shadow-neon-blue relative z-10">
                  <Truck size={14} className="text-dark-900" />
                </div>
                {/* Direction Indicator */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-primary opacity-80" />
              </div>
              <div className="bg-dark-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 mt-2 text-[8px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                Express Pilot
              </div>
            </motion.div>

            {/* Destination Marker */}
            <div className="absolute right-1/4 bottom-1/4 w-12 h-12 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-secondary/20 blur-xl rounded-full" />
                <MapPin size={32} className="text-secondary drop-shadow-lg" />
              </div>
              <div className="bg-dark-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 mt-1 text-[8px] font-black text-white uppercase tracking-widest">
                Home
              </div>
            </div>

            {/* Connection Line (Path) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M100,100 Q300,200 750,750"
                fill="none"
                stroke="rgba(0,243,255,0.05)"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
            </svg>
          </div>

          <div className="absolute top-6 left-6 z-20">
            <div className="bg-dark-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Clock size={24} className="animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Arriving in</p>
                <p className="text-2xl font-display font-black text-white">{activeStep === 5 ? 'Arrived' : '12-15 Mins'}</p>
              </div>
            </div>
          </div>

          {activeStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-6 right-6 z-20"
            >
              <div className="bg-dark-900/90 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 shadow-2xl flex items-center justify-between group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-white/5 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-900" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Vikram Singh</h4>
                    <p className="text-gray-500 text-xs flex items-center gap-1 font-bold italic">
                      <Star size={10} className="text-primary fill-primary" /> 4.9 • Delivery Partner
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 relative z-10">
                  <button className="w-12 h-12 rounded-2xl bg-dark-800 border border-white/5 text-gray-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center">
                    <MessageSquare size={20} />
                  </button>
                  <a href="tel:+919876543210" className="w-12 h-12 rounded-2xl bg-primary text-dark-900 transition-all flex items-center justify-center shadow-neon-blue active:scale-95">
                    <Phone size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Items Summary */}
        <div className="glass-panel p-8 border-white/5 space-y-6">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/5 pb-4">Order Items</h3>
          <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-xl bg-dark-900 overflow-hidden shrink-0 border border-white/5">
                  <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-primary">{item.quantity} x ₹{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5">
            <button
              onClick={() => navigate('/restaurants')}
              className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 group shadow-lg"
            >
              <span className="font-bold text-xs uppercase tracking-widest text-dark-900">Order More</span>
              <ArrowRight size={16} className="text-dark-900 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        {/* Review Modal */}
        {order.status === 'DELIVERED' && (
          <div className="md:col-span-3">
            <div className="glass-panel p-8 border-white/5 bg-dark-800/50 text-center">
              <h3 className="text-xl font-bold text-white mb-2">How was your food?</h3>
              <p className="text-gray-400 text-sm mb-6">Rate your experience to help others.</p>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => {
                    const comment = prompt("Care to leave a comment?");
                    if (comment) {
                      api.post(`/restaurants/${order.restaurant._id || order.restaurant}/review`, { rating: star, comment })
                        .then(() => alert("Review Submitted!"))
                        .catch(() => alert("Failed to submit review"));
                    }
                  }}>
                    <Star size={32} className="text-gray-500 hover:text-amber-400 hover:fill-amber-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderTracking;

