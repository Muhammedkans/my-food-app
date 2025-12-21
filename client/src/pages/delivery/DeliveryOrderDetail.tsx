import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Phone, CheckCircle, Clock,
  ShoppingBag, Navigation, ChevronRight, Loader2,
  Package, ExternalLink, ShieldCheck, Mail
} from 'lucide-react';
import api, { getFullImageUrl } from '../../services/api';

const DeliveryOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.data);
    } catch (err) {
      console.error("Failed to fetch order", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    setIsUpdating(true);
    try {
      await api.patch(`/orders/${id}/status`, { status });
      await fetchOrderDetails();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen pt-24 text-center">
      <h2 className="text-2xl font-bold">Order not found</h2>
      <button onClick={() => navigate('/delivery/dashboard')} className="mt-4 text-primary font-bold">Back to Dashboard</button>
    </div>
  );

  const earnings = Math.round((order.billing?.deliveryFee || 0) * 0.8);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
              <ArrowLeft size={20} className="text-dark-900" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-dark-900 leading-none">Order Details</h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                #{order._id.slice(-8).toUpperCase()} • <span className={order.status === 'DELIVERED' ? 'text-green-600' : 'text-primary'}>{order.status.replace(/_/g, ' ')}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Your Earnings</p>
            <p className="text-2xl font-black text-green-600 tracking-tighter">₹{earnings}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left Side: Route & Status */}
          <div className="lg:col-span-3 space-y-6">

            {/* Action Card */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Clock className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Est. Delivery Time</p>
                    <p className="text-xl font-bold text-dark-900">35-40 Minutes</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
                    disabled={order.status !== 'READY_FOR_PICKUP' || isUpdating}
                    className={`py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${order.status === 'OUT_FOR_DELIVERY' || order.status === 'DELIVERED'
                      ? 'bg-gray-50 text-gray-400 border border-gray-100'
                      : order.status === 'READY_FOR_PICKUP'
                        ? 'bg-dark-900 text-white shadow-xl hover:bg-dark-800'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {order.status === 'OUT_FOR_DELIVERY' || order.status === 'DELIVERED' ? (
                      <>Picked Up <CheckCircle size={16} /></>
                    ) : (
                      <>Verify & Pick Up <ChevronRight size={16} /></>
                    )}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('DELIVERED')}
                    disabled={order.status !== 'OUT_FOR_DELIVERY' || isUpdating}
                    className={`py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${order.status === 'DELIVERED'
                      ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                      : order.status === 'OUT_FOR_DELIVERY'
                        ? 'bg-green-600 text-white shadow-xl hover:bg-green-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {order.status === 'DELIVERED' ? 'Delivered successfully' : 'Mark as Delivered'}
                  </button>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 space-y-12">
                <div className="relative flex gap-6">
                  <div className="absolute left-6 top-10 bottom-[-2.5rem] w-0.5 bg-gray-100 border-dashed border-l border-gray-300" />
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-sm">
                    <ShoppingBag className="text-primary" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Pick Up From</p>
                        <h3 className="text-xl font-bold text-dark-900">{order.restaurant?.name}</h3>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed">{order.restaurant?.info?.location || order.restaurant?.location?.address || "Address not provided"}</p>
                      </div>
                      <a href={`tel:${order.restaurant?.phone || '9876543210'}`} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-all">
                        <Phone size={20} />
                      </a>
                    </div>
                    <button className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mt-4 group">
                      <Navigation size={12} /> Live Navigation <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-6 relative z-10 bg-white">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="text-secondary" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Deliver To</p>
                        <h3 className="text-xl font-bold text-dark-900">{order.user?.profile?.name || 'Customer'}</h3>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed">{order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city}</p>
                      </div>
                      <div className="flex gap-2">
                        <a href={`mailto:${order.user?.email || 'customer@foodbey.com'}`} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-500 transition-all text-xs">
                          <Mail size={18} />
                        </a>
                        <a href={`tel:${order.user?.profile?.phone || '9876543210'}`} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-green-500 transition-all text-xs">
                          <Phone size={18} />
                        </a>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-secondary font-bold text-[10px] uppercase tracking-widest mt-4">
                      <ExternalLink size={12} /> Open in Google Maps
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Order Items */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <Package className="text-gray-400" size={20} />
                <h3 className="text-sm font-black text-dark-900 uppercase tracking-widest">Order Checklist</h3>
              </div>

              <div className="space-y-6">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                      <img src={getFullImageUrl(item.image)} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 border ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center p-0.5 shrink-0`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                        </div>
                        <h4 className="font-bold text-dark-900 text-sm leading-tight">{item.name}</h4>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 bg-gray-50 rounded-3xl p-6 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Customer Paid</p>
                  <p className="text-2xl font-black text-dark-900 font-mono tracking-tighter">₹{order.billing?.grandTotal}</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl text-[10px] font-black uppercase text-green-600 border border-green-100">
                  Online Paid
                </div>
              </div>
            </div>

            <div className="bg-dark-900 rounded-[40px] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-30" />
              <h4 className="font-bold flex items-center gap-2 mb-4">
                <ShieldCheck size={20} className="text-primary" /> Delivery Policy
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed italic">
                "Ensure food items are handled with care. Always wear your mask and maintain professional hygiene standards while in contact with the guest."
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DeliveryOrderDetail;
