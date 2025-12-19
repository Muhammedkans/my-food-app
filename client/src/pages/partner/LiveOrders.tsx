import { useEffect, useState } from 'react';
import {
  Clock,
  CheckCircle,
  ChefHat,
  Truck,
  AlertCircle,
  MoreVertical,
  ArrowRight,
  Loader2,
  Phone,
  MapPin
} from 'lucide-react';
import api from '../../services/api';

const LiveOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnedRestaurant = async () => {
      try {
        const res = await api.get('/restaurants/my');
        setRestaurantId(res.data.data._id);
      } catch (err) {
        console.error("Failed to fetch restaurant", err);
      }
    };
    fetchOwnedRestaurant();
  }, []);

  const fetchOrders = async () => {
    if (!restaurantId) return;
    try {
      const res = await api.get(`/orders/restaurant/${restaurantId}`);
      setOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [restaurantId]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PLACED': return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Incoming Order' };
      case 'CONFIRMED': return { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Accepted' };
      case 'PREPARING': return { icon: ChefHat, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', label: 'Preparing' };
      case 'OUT_FOR_DELIVERY': return { icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', label: 'On its way' };
      case 'DELIVERED': return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', label: 'Delivered' };
      case 'CANCELLED': return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', label: 'Cancelled' };
      default: return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100', label: status };
    }
  };

  const nextStatusMap: Record<string, string> = {
    'PLACED': 'CONFIRMED',
    'CONFIRMED': 'PREPARING',
    'PREPARING': 'OUT_FOR_DELIVERY',
    'OUT_FOR_DELIVERY': 'DELIVERED'
  };

  if (loading && orders.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-900 tracking-tight">Real-time Orders</h1>
          <p className="text-gray-500 font-medium">Monitoring active incoming and outgoing deliveries.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-2xl border border-green-100">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Active Connection</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-24 rounded-[40px] border border-gray-100 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Clock className="text-gray-200" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-dark-900">Waiting for New Orders</h3>
          <p className="text-gray-400 mt-2 max-w-sm mx-auto">Your restaurant is currently online. Incoming orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => {
            const config = getStatusConfig(order.status);
            const nextStatus = nextStatusMap[order.status];

            return (
              <div key={order._id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden hover:border-primary/20 transition-all group">
                <div className="p-8 flex flex-col lg:flex-row gap-10">
                  {/* Order Details */}
                  <div className="flex-1 space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Order #{order._id.slice(-6).toUpperCase()}</span>
                          <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.color} border ${config.border}`}>
                            {config.label}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-dark-900">{order.user?.profile?.name || 'Customer'}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-sm text-gray-500 font-medium">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <span className="text-gray-200">•</span>
                          <p className="text-sm text-gray-500 font-medium">{order.items.length} Culinary Items</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₹{order.billing?.grandTotal}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Settled thru Gateway</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center font-bold text-xs text-primary">
                              {item.quantity}
                            </div>
                            <span className="text-sm font-bold text-dark-900">{item.name}</span>
                          </div>
                          <span className="text-xs font-bold text-gray-400">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer & Actions */}
                  <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-10 flex flex-col justify-between gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <MapPin size={12} /> Delivery Address
                        </label>
                        <p className="text-sm font-medium text-dark-900 leading-relaxed truncate">{order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Phone size={12} /> Special Request
                        </label>
                        <p className="text-xs font-italic text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">"Please ensure the packaging is airtight."</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {nextStatus && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, nextStatus)}
                          disabled={updatingId === order._id}
                          className="w-full bg-primary text-white py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold text-xs uppercase tracking-widest shadow-md hover:bg-primary/90 active:scale-[0.98]"
                        >
                          {updatingId === order._id ? <Loader2 className="animate-spin" size={18} /> : (
                            <>
                              Mark as {getStatusConfig(nextStatus).label}
                              <ArrowRight size={18} />
                            </>
                          )}
                        </button>
                      )}

                      <div className="flex gap-3">
                        <button className="flex-1 bg-white text-gray-500 hover:text-dark-900 hover:bg-gray-50 py-3 rounded-2xl border border-gray-100 transition-all font-bold text-[10px] uppercase tracking-widest">
                          Contact
                        </button>
                        {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'CANCELLED')}
                            className="px-4 text-red-400 hover:text-red-500 bg-red-50 border border-red-100 rounded-2xl transition-all"
                            title="Cancel Request"
                          >
                            <AlertCircle size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LiveOrders;
