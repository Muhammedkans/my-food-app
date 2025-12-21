import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Package, LogOut, ExternalLink } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { socket } from '../../services/socket';
import { motion, AnimatePresence } from 'framer-motion';

const DeliveryDashboard = () => {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'history'>('available');
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, completedOrders: 0, totalEarnings: 0 });

  useEffect(() => {
    fetchDashboardData();
    fetchHistoryAndStats();

    // Connect socket and listen for live orders
    const joinRooms = () => {
      console.log("Delivery Socket Connected - Joining Rooms");
      socket.emit('join_room', 'delivery_partners');
      if (user?._id) socket.emit('join_room', user._id);
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      joinRooms();
    }

    const handleNewDelivery = (newOrder: any) => {
      setAvailableOrders(prev => [newOrder, ...prev]);
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));

      if (Notification.permission === 'granted') {
        new Notification('New Order!', {
          body: `Pickup from ${newOrder.restaurant?.name}`,
          icon: newOrder.restaurant?.assets?.logo
        });
      }
    };

    const handleStatusUpdate = (data: { orderId: string, status: string }) => {
      setActiveOrder((prev: any) => {
        if (prev && prev._id === data.orderId) {
          return { ...prev, status: data.status };
        }
        return prev;
      });
      setAvailableOrders(prev => prev.filter(o => o._id !== data.orderId));

      // Refresh stats if an order was delivered
      if (data.status === 'DELIVERED') {
        fetchHistoryAndStats();
      }
    };

    socket.on('connect', joinRooms);
    socket.on('new_delivery_available', handleNewDelivery);
    socket.on('order_status_updated', handleStatusUpdate);

    return () => {
      socket.off('connect', joinRooms);
      socket.off('new_delivery_available', handleNewDelivery);
      socket.off('order_status_updated', handleStatusUpdate);
    };
  }, [user?._id]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'history') {
      setActiveTab('history');
    }
  }, [location.search]);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const ordersRes = await api.get('/orders/delivery/available');
      setAvailableOrders(ordersRes.data.data || []);

      const currentRes = await api.get('/orders/delivery/active');
      if (currentRes.data.data) {
        setActiveOrder(currentRes.data.data);
        if (activeTab === 'available') setActiveTab('active');
      }
    } catch (err) {
      console.error("Delivery dashboard error", err);
    }
  };

  const fetchHistoryAndStats = async () => {
    try {
      const statsRes = await api.get('/orders/delivery/stats');
      setStats(statsRes.data.data);
      const historyRes = await api.get('/orders/delivery/history');
      setHistory(historyRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await api.patch(`/orders/${orderId}/accept`);
      fetchDashboardData();
      setActiveTab('active');
    } catch (err) {
      alert('Could not accept order. It might have been taken by another partner.');
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!activeOrder) return;
    try {
      await api.patch(`/orders/${activeOrder._id}/status`, { status });
      fetchDashboardData();
      if (status === 'DELIVERED') {
        fetchHistoryAndStats();
        setActiveOrder(null);
        setActiveTab('history');
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 p-1 border-2 border-white shadow-md">
              <img src={user?.profile?.avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200"} className="w-full h-full object-cover rounded-full" alt="Profile" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-dark-900">Hello, {user?.profile?.name?.split(' ')[0]}!</h1>
              <p className="text-green-600 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online • Ready to Deliver
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-dark-900">₹{stats.totalEarnings}</p>
            </div>
            <button
              onClick={() => { dispatch(logout()); navigate('/login'); }}
              className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-white rounded-2xl border border-gray-100 shadow-sm w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'available' ? 'bg-dark-900 text-white shadow-md' : 'text-gray-400 hover:text-dark-900'}`}
          >
            Opportunities ({availableOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'active' ? 'bg-green-600 text-white shadow-md' : 'text-gray-400 hover:text-green-600'}`}
          >
            Active {activeOrder && <span className="w-2 h-2 bg-white rounded-full inline-block ml-2 animate-pulse" />}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-blue-600'}`}
          >
            My Orders
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'available' ? (
            <motion.div
              key="available"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {availableOrders.length === 0 ? (
                <div className="col-span-2 bg-white p-16 rounded-[40px] text-center border border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <Package size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">No Orders Nearby</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">New delivery requests will appear here automatically.</p>
                </div>
              ) : (
                availableOrders.map(order => (
                  <div key={order._id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:border-primary/50 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                          {order.restaurant?.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-dark-900 text-lg">{order.restaurant?.name}</h3>
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Restaurant</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        ₹{Math.round(order.billing?.deliveryFee * 0.8 || 0)}
                      </span>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-4 text-xs font-medium text-gray-600">
                        <MapPin size={14} className="mt-0.5 text-primary" />
                        <p>{order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      className="w-full py-4 bg-dark-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-primary transition-all flex items-center justify-center gap-2"
                    >
                      Accept Delivery
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          ) : activeTab === 'active' ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {activeOrder ? (
                <div
                  onClick={() => navigate(`/delivery/order/${activeOrder._id}`)}
                  className="bg-white p-10 rounded-[40px] shadow-lg border border-primary/20 relative overflow-hidden cursor-pointer group hover:shadow-xl transition-all"
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-600" />
                  <div className="absolute top-0 right-0 p-6 text-primary opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                    <ExternalLink size={24} />
                  </div>
                  <div className="flex flex-col md:flex-row gap-10">
                    <div className="flex-1 space-y-8">
                      <div>
                        <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Current Status</span>
                        <h2 className="text-4xl font-display font-bold text-dark-900">{activeOrder.status.replace(/_/g, ' ')}</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
                          disabled={activeOrder.status !== 'READY_FOR_PICKUP'}
                          className={`py-4 rounded-xl font-bold uppercase tracking-widest text-xs border-2 transition-all ${activeOrder.status === 'OUT_FOR_DELIVERY' || activeOrder.status === 'DELIVERED'
                            ? 'bg-orange-600 text-white border-orange-600 shadow-lg'
                            : activeOrder.status === 'READY_FOR_PICKUP'
                              ? 'bg-white border-primary text-primary hover:bg-primary/5'
                              : 'bg-gray-100 text-gray-400 border-gray-200'
                            }`}
                        >
                          {activeOrder.status === 'OUT_FOR_DELIVERY' ? '✓ Picked Up' : 'Pick Up Food'}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('DELIVERED')}
                          disabled={activeOrder.status !== 'OUT_FOR_DELIVERY'}
                          className={`py-4 rounded-xl font-bold uppercase tracking-widest text-xs border-2 transition-all ${activeOrder.status === 'DELIVERED'
                            ? 'bg-green-600 text-white border-green-600'
                            : activeOrder.status === 'OUT_FOR_DELIVERY'
                              ? 'bg-white border-green-600 text-green-600 hover:bg-green-50'
                              : 'bg-gray-100 text-gray-400 border-gray-200'
                            }`}
                        >
                          Mark as Delivered
                        </button>
                      </div>

                      <div className="bg-dark-900 rounded-[30px] p-8 text-white relative overflow-hidden">
                        <h4 className="font-bold text-lg mb-6 flex items-center gap-2"><MapPin size={20} className="text-primary" /> Route Details</h4>
                        <div className="space-y-6 border-l-2 border-white/10 ml-2.5 pl-6">
                          <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Restaurant</p>
                            <p className="font-bold">{activeOrder.restaurant?.name}</p>
                            <p className="text-gray-500 text-sm mt-1">{activeOrder.restaurant?.location?.address || "Location details unavailable"}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Customer</p>
                            <p className="font-bold">{activeOrder.user?.profile?.name || "Customer"}</p>
                            <p className="text-gray-500 text-sm mt-1">{activeOrder.deliveryAddress?.addressLine}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-400">No Active Delivery</h3>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Deliveries', value: stats.completedOrders, color: 'text-primary' },
                  { label: 'Total Earnings', value: `₹${stats.totalEarnings}`, color: 'text-green-600' },
                  { label: 'Experience', value: 'Pro Pilot', color: 'text-purple-600' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* History List */}
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                  <h3 className="text-xl font-bold text-dark-900">Delivery History</h3>
                </div>
                {history.length === 0 ? (
                  <div className="p-20 text-center text-gray-400 font-bold">No completed orders yet.</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {history.map(order => (
                      <div
                        key={order._id}
                        onClick={() => navigate(`/delivery/order/${order._id}`)}
                        className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            <Package size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-dark-900">{order.restaurant?.name || 'Restaurant'}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-green-600">+₹{Math.round((order.billing?.deliveryFee || 0) * 0.8)}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
