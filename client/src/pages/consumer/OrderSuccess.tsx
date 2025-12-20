import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ShoppingBag, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
  const { id } = useParams();

  useEffect(() => {
    // Fire confetti for celebration
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00f3ff', '#7000ff']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00f3ff', '#7000ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-32">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-green-100 shadow-xl shadow-green-100/50"
        >
          <CheckCircle className="text-green-500" size={48} />
        </motion.div>

        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-black text-dark-900 tracking-tight"
          >
            Order Successful!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium"
          >
            Your order <span className="text-dark-900 font-bold font-mono">#{id?.slice(-8).toUpperCase()}</span> has been placed successfully and is being transmitted to the kitchen.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 space-y-4"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <ShoppingBag className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Next Step</p>
              <p className="text-dark-900 font-bold">Chef is reviewing your order</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <MapPin className="text-secondary" size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Real-time tracking</p>
              <p className="text-dark-900 font-bold">Watch your pilot move live</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3"
        >
          <Link
            to={`/orders?id=${id}`}
            className="w-full bg-dark-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl hover:bg-dark-800 transition-all hover:scale-[1.02] active:scale-95"
          >
            Track Order Live <ArrowRight size={18} />
          </Link>
          <Link
            to="/dashboard"
            className="w-full bg-white text-gray-500 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-gray-100 hover:bg-gray-50 transition-all"
          >
            Go to My Account
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
