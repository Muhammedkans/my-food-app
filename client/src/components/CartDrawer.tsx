import { useRef, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2, TrendingUp } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { RootState } from '../store/store';
import { toggleCart, updateQuantity, removeFromCart } from '../store/slices/cartSlice';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const currentHour = new Date().getHours();
  const isPeakHour = (currentHour >= 12 && currentHour <= 14) || (currentHour >= 19 && currentHour <= 22);
  const surgeFee = isPeakHour ? 35 : 0;

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleCheckout = () => {
    dispatch(toggleCart());
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleCart())}
            className="fixed inset-0 z-[60] bg-dark-950/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 w-full max-w-md h-full z-[70] bg-dark-800 border-l border-white/5 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="text-primary" size={20} />
                </div>
                <h2 className="text-xl font-display font-bold text-white tracking-tight">Your Cart</h2>
              </div>
              <button
                onClick={() => dispatch(toggleCart())}
                className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence mode='popLayout'>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                      <ShoppingBag size={40} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Your basket is empty</h3>
                      <p className="text-gray-500 text-sm max-w-[200px] mt-1">Looks like you haven't added anything to your cart yet.</p>
                    </div>
                    <button
                      onClick={() => { dispatch(toggleCart()); navigate('/restaurants'); }}
                      className="text-primary hover:text-primary-hover font-bold text-sm uppercase tracking-widest"
                    >
                      Start Ordering
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex gap-4 p-4 rounded-xl bg-dark-900 border border-white/5 group hover:border-white/10 transition-all"
                    >
                      <div className="w-20 h-20 rounded-lg bg-dark-800 overflow-hidden shrink-0 border border-white/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white line-clamp-1 text-sm">{item.name}</h4>
                          <span className="text-sm font-bold text-primary">₹{item.price * item.quantity}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-dark-800 rounded-lg px-2 py-1 border border-white/5">
                            <button
                              onClick={() => dispatch(updateQuantity({ id: item._id, delta: -1 }))}
                              className="text-gray-500 hover:text-white transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center text-white">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(updateQuantity({ id: item._id, delta: 1 }))}
                              className="text-primary hover:text-primary-hover transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => dispatch(removeFromCart(item._id))}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-6 bg-dark-900 border-t border-white/5 space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Order Subtotal</span>
                    <span className="text-white font-medium">₹{total}</span>
                  </div>
                  {isPeakHour && (
                    <div className="flex justify-between text-sm text-amber-400 animate-pulse">
                      <span className="flex items-center gap-1"><TrendingUp size={12} /> Dynamic Surge Fee</span>
                      <span className="font-bold">₹{surgeFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Delivery & Platform Fees</span>
                    <span className="text-white font-medium">₹50</span>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Amount</p>
                      <p className="text-2xl font-bold text-white tracking-tight">₹{total + 50 + surgeFee}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded uppercase">Saved ₹20</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full btn-primary py-4 flex items-center justify-between px-6 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="font-bold text-dark-900 tracking-wider">PROCEED TO CHECKOUT</span>
                  <div className="flex items-center gap-2">
                    <span className="w-px h-4 bg-dark-900/20" />
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

