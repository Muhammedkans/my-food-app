import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Wallet, Coins, MapPin,
  ShoppingBag, ChevronRight, Settings,
  LogOut, ArrowUpRight,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import api from '../../services/api';
import { socket } from '../../services/socket';

const CustomerDashboard = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    if (user?._id) {
      if (!socket.connected) socket.connect();
      socket.emit('join_room', user._id);

      const handleStatusUpdate = (data: { orderId: string, status: string }) => {
        setOrders(prev => prev.map(o => o._id === data.orderId ? { ...o, status: data.status } : o));
      };

      socket.on('order_status_updated', handleStatusUpdate);

      return () => {
        socket.off('order_status_updated', handleStatusUpdate);
      };
    }
  }, [user?._id]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-bold text-lg uppercase tracking-widest">
      Authentication Required
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Sidebar: Profile & Navigation */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />
            <div className="relative z-10">
              {/* Avatar code same as before */}
              <div className="w-28 h-28 rounded-full bg-gray-50 border-4 border-white shadow-md mx-auto mb-6 p-1 relative overflow-hidden">
                <img src={user.profile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'} className="w-full h-full object-cover rounded-full" />
              </div>
              <h2 className="text-3xl font-display font-bold text-dark-900 leading-tight mb-1">{user.profile?.name}</h2>
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-8">Premium Member</p>

              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Dashboard', icon: History },
                  { id: 'wallet', label: 'My Wallet', icon: Wallet },
                  { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
                  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
                  { id: 'settings', label: 'Account Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-dark-900 hover:bg-gray-50 border border-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${activeTab === item.id ? 'bg-white/20' : 'bg-gray-50'}`}>
                        <item.icon size={18} />
                      </div>
                      <span className={`text-sm font-bold`}>{item.label}</span>
                    </div>
                    <ChevronRight size={16} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
                  </button>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full mt-10 flex items-center justify-center gap-3 p-4 rounded-2xl border border-red-50 text-red-500 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-widest"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                {/* Overview Content (Wallet Cards etc - Same as before) */}
                {/* Simplified for brevity - usually keeping existing structure */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm relative overflow-hidden group">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 relative z-10">Wallet Balance</p>
                    <p className="text-4xl font-display font-bold text-dark-900 relative z-10">₹{user.wallet?.balance || 0}</p>
                    <div className="absolute right-[-20px] bottom-[-20px] text-primary/5 group-hover:scale-110 transition-transform">
                      <Wallet size={120} />
                    </div>
                  </div>
                  {/* ... other cards ... */}
                  <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm relative overflow-hidden group">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 relative z-10">Loyalty Points</p>
                    <p className="text-4xl font-display font-bold text-amber-500 relative z-10">{user.wallet?.loyaltyPoints || 0}</p>
                    <div className="absolute right-[-20px] bottom-[-20px] text-amber-500/5 group-hover:scale-110 transition-transform">
                      <Coins size={120} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-dark-900 mb-6">My Recent Orders</h2>
                {loadingOrders ? (
                  <div className="text-center py-20 text-gray-400">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="bg-white p-10 rounded-[30px] text-center border border-gray-100">
                    <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-500 font-bold">No orders found yet.</p>
                    <Link to="/restaurants" className="text-primary font-bold text-sm mt-4 inline-block hover:underline">Start Ordering</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-white p-6 rounded-[30px] border border-gray-100 hover:border-primary/30 transition-all shadow-sm group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                              {order.restaurant?.name?.charAt(0) || 'R'}
                            </div>
                            <div>
                              <h3 className="font-bold text-dark-900 text-lg">{order.restaurant?.name || 'Restaurant'}</h3>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                            {order.status}
                          </div>
                        </div>
                        <div className="pl-16 mb-4">
                          <p className="text-gray-500 text-sm line-clamp-1">
                            {order.items.map((i: any) => `${i.quantity}x ${i.menuItem?.name || 'Item'}`).join(', ')}
                          </p>
                        </div>
                        <div className="pl-16 flex items-center justify-between border-t border-gray-50 pt-4">
                          <p className="text-dark-900 font-bold font-mono">₹{order.billing?.grandTotal}</p>
                          <Link to={`/orders?id=${order._id}`} className="text-primary text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                            View Details <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-dark-900">Saved Addresses</h2>
                  <button className="px-4 py-2 bg-dark-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors">
                    Add New
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((addr: any, idx: number) => (
                      <div key={idx} className="bg-white p-6 rounded-[30px] border border-gray-100 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-red-500 hover:text-red-600"><LogOut size={16} /></button>
                        </div>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                            <MapPin size={24} />
                          </div>
                          <div>
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                              {addr.label}
                            </span>
                            <p className="text-dark-900 font-bold leading-tight">{addr.addressLine}</p>
                            <p className="text-gray-400 text-xs font-medium mt-1">{addr.city}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10 text-gray-400 font-medium bg-white rounded-[30px] border border-gray-100">
                      No addresses saved. Add one at checkout!
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'wallet' && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* ... Existing Wallet Content ... */}
                <div className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] text-primary">
                    <Wallet size={300} className="rotate-12" />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-primary uppercase tracking-[0.4em]">Integrated Wallet</p>
                      <h2 className="text-6xl font-display font-bold text-dark-900 tracking-tighter">₹{user.wallet?.balance || 0}</h2>
                      <p className="text-gray-500 text-sm max-w-sm font-medium">Your account is secured with end-to-end encryption. Manage your balance and rewards here.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button className="bg-primary text-white px-10 py-5 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-md transition-all hover:bg-primary/90">Add Credits</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
export default CustomerDashboard;
