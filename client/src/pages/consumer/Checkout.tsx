import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Clock, Plus, Check } from 'lucide-react';
import type { RootState } from '../../store/store';
import { clearCart } from '../../store/slices/cartSlice';
import { setCredentials } from '../../store/slices/authSlice';
import api from '../../services/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items, restaurantId } = useSelector((state: RootState) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [newAddress, setNewAddress] = useState({ label: 'Home', addressLine: '', city: '' });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  // Only redirect if cart is empty and NOT currently processing/initiating a payment
  useEffect(() => {
    if (items.length === 0 && !isProcessing && !paymentInitiated) {
      navigate('/restaurants');
    }
  }, [items.length, isProcessing, paymentInitiated, navigate]);

  if (items.length === 0 && !isProcessing && !paymentInitiated) {
    return null;
  }

  const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const fees = { delivery: 40, platform: 10, tax: Math.round(total * 0.05) };
  const grandTotal = total + fees.delivery + fees.platform + fees.tax;

  const handleSaveAddress = async () => {
    if (!newAddress.addressLine || !newAddress.city) {
      alert("Please fill in address line and city");
      return;
    }

    try {
      // Backend expects: { address: { label, addressLine, city } }
      // AND we need to use 'address' key as per updateUserProfile controller logic
      // "if (req.body.address) ..."

      const payload = {
        address: {
          label: newAddress.label || 'Home',
          addressLine: newAddress.addressLine,
          city: newAddress.city
        }
      };

      const res = await api.patch('/auth/profile', payload);

      if (res.data.success) {
        // Update Redux state with new user data
        dispatch(setCredentials({ ...res.data.data, token: user?.token })); // keep token
        setShowAddressModal(false);
        setNewAddress({ label: 'Home', addressLine: '', city: '' });
        // Auto select the new address (last one)
        if (res.data.data.addresses?.length) {
          setSelectedAddressIndex(res.data.data.addresses.length - 1);
        }
      }
    } catch (err) {
      console.error("Failed to add address", err);
      alert('Failed to add address. Please try again.');
    }
  };

  const currentAddress = user?.addresses?.[selectedAddressIndex] || {
    label: 'No Address Set',
    addressLine: 'Please add a delivery address.',
    city: ''
  };

  const handlePayment = async () => {
    if (isProcessing) return;

    if (!user?.addresses?.length) {
      alert("Please add a delivery address first.");
      setShowAddressModal(true);
      return;
    }

    setIsProcessing(true);

    try {
      setPaymentInitiated(true);
      // 1. Create a "Pending" order in our system
      const orderRes = await api.post('/orders', {
        restaurantId,
        items,
        billing: {
          itemTotal: total,
          deliveryFee: fees.delivery,
          platformFee: fees.platform,
          tax: fees.tax,
          grandTotal
        },
        paymentMethod: 'ONLINE',
        deliveryAddress: {
          addressLine: currentAddress.addressLine,
          city: currentAddress.city
        }
      });

      const nativeOrderId = orderRes.data.data._id;
      const finalAmountFromServer = orderRes.data.data.billing.grandTotal;

      // 2. Create Razorpay Order with the final total from server (includes surge, etc)
      const rzpOrderRes = await api.post('/payments/create', { amount: finalAmountFromServer });
      const rzpOrderData = rzpOrderRes.data.data;

      // 3. Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: rzpOrderData.amount,
        currency: rzpOrderData.currency,
        name: "FoodBey Premium",
        description: "Payment for your delicious order",
        image: "https://your-logo-url.png",
        order_id: rzpOrderData.id,
        handler: async (response: any) => {
          try {
            // 4. Verify Payment on Server
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              foodBeyOrderId: nativeOrderId
            });

            if (verifyRes.data.success) {
              dispatch(clearCart());
              navigate(`/order-success/${nativeOrderId}`);
            }
          } catch (err: any) {
            alert("Verification failed: " + (err.response?.data?.message || "Please contact support"));
          }
        },
        prefill: {
          name: user?.profile.name,
          email: user?.auth.email
        },
        theme: { color: "#00f3ff" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error("Payment initiation failed", error);
      alert(error.response?.data?.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-dark-800 rounded-full hover:bg-dark-700 text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="glass-panel p-6 border-white/5 bg-dark-800/30">
            <div className="flex items-center gap-3 mb-6 text-primary">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin size={20} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Delivery Address</h3>
            </div>
            <div className="bg-dark-900/50 p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all group cursor-pointer" onClick={() => setShowAddressModal(true)}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="bg-primary/20 text-primary-hover px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                    {currentAddress.label}
                  </span>
                  <p className="text-white font-bold text-lg">{currentAddress.addressLine}</p>
                  <p className="text-gray-500 font-medium">{currentAddress.city}</p>
                </div>
                <button className="text-primary hover:text-primary-hover text-sm font-bold uppercase tracking-widest transition-colors">Change</button>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-panel p-6 border-white/5 bg-dark-800/30">
            <div className="flex items-center gap-3 mb-6 text-secondary">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <CreditCard size={20} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Payment Method</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-4 p-5 bg-dark-900/50 rounded-xl border-2 border-primary/50 cursor-pointer shadow-[0_0_20px_rgba(0,243,255,0.05)] transition-all">
                <div className="relative flex items-center justify-center">
                  <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-primary bg-dark-900 border-white/10" />
                </div>
                <div>
                  <span className="text-white font-bold block">Razorpay Security Payment</span>
                  <span className="text-gray-500 text-xs font-medium uppercase tracking-tighter">UPI / Cards / Netbanking (Secured by RSA)</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="glass-panel p-8 h-fit sticky top-24 border-white/5 bg-dark-800/30">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Order Summary</h3>

          <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
            {items.map((item: any) => (
              <div key={item._id} className="flex justify-between items-center group">
                <div className="flex gap-4">
                  <div className={`w-1 h-10 rounded-full shrink-0 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'} opacity-40`} />
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-tight line-clamp-1">{item.name}</h4>
                    <p className="text-gray-500 text-xs font-bold font-mono">{item.quantity} x ₹{item.price}</p>
                  </div>
                </div>
                <span className="text-white font-bold text-sm font-mono">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            <div className="flex justify-between items-center group">
              <span className="group-hover:text-gray-300 transition-colors">Subtotal</span>
              <span className="text-white font-mono">₹{total}</span>
            </div>
            <div className="flex justify-between items-center group text-primary/80">
              <span className="group-hover:text-primary transition-colors">Surge Premium</span>
              <span className="text-primary font-mono">₹0</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="group-hover:text-gray-300 transition-colors">Admin & Service</span>
              <span className="text-white font-mono">₹{fees.delivery + fees.platform}</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="group-hover:text-gray-300 transition-colors">Tax (IGST 18%)</span>
              <span className="text-white font-mono">₹{fees.tax}</span>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Final Amount</p>
                <p className="text-4xl font-bold text-white tracking-tighter">₹{grandTotal}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded uppercase mb-2">Saved ₹30</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full btn-primary py-5 text-sm font-black uppercase tracking-[0.2em] shadow-2xl hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <Clock className="animate-spin" size={18} />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Authorize Payment</span>
                  <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={18} />
                </div>
              )}
            </button>
            <p className="text-center text-[10px] font-bold text-gray-600 mt-6 flex items-center justify-center gap-2 uppercase tracking-widest">
              <CreditCard size={12} className="text-primary" /> Encrypted by SSL/TLS foodBey
            </p>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-dark-900 w-full max-w-lg rounded-3xl border border-white/10 p-8 relative">
            <h2 className="text-2xl font-bold text-white mb-6">Select Address</h2>

            {!isAddingAddress ? (
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3 custom-scrollbar">
                  {user?.addresses?.map((addr, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center ${selectedAddressIndex === idx ? 'border-primary bg-primary/10' : 'border-white/10 hover:bg-white/5'}`}
                    >
                      <div>
                        <p className="font-bold text-white text-sm uppercase tracking-wider mb-1">{addr.label}</p>
                        <p className="text-gray-400 text-sm">{addr.addressLine}, {addr.city}</p>
                      </div>
                      {selectedAddressIndex === idx && <Check size={20} className="text-primary" />}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="w-full py-3 border border-dashed border-gray-600 hover:border-primary text-gray-400 hover:text-primary rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
                >
                  <Plus size={20} /> Add New Address
                </button>

                <button
                  onClick={() => setShowAddressModal(false)}
                  className="w-full py-4 bg-primary text-dark-900 font-bold rounded-xl mt-4"
                >
                  Confirm Selection
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Label (e.g. Home, Office)</label>
                  <input
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    className="w-full bg-dark-800 border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Address Line</label>
                  <input
                    value={newAddress.addressLine}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                    className="w-full bg-dark-800 border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">City</label>
                  <input
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full bg-dark-800 border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsAddingAddress(false)} className="flex-1 py-3 text-gray-400 font-bold">Cancel</button>
                  <button onClick={handleSaveAddress} className="flex-1 py-3 bg-white text-dark-900 rounded-xl font-bold hover:bg-gray-200">Save Address</button>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white"
            >
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
