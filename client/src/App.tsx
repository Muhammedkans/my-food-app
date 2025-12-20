import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Onboarding from './pages/partner/Onboarding';
import RestaurantLayout from './layouts/RestaurantLayout';
import DashboardOverview from './pages/partner/DashboardOverview';
import MenuManagement from './pages/partner/MenuManagement';
import RestaurantFeed from './pages/consumer/RestaurantFeed';
import RestaurantDetails from './pages/consumer/RestaurantDetails';
import CustomerDashboard from './pages/consumer/CustomerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AIChatSupport from './components/AIChatSupport';
import CartDrawer from './components/CartDrawer';
import Checkout from './pages/consumer/Checkout';
import OrderTracking from './pages/consumer/OrderTracking';
import LiveOrders from './pages/partner/LiveOrders';
import OrderSuccess from './pages/consumer/OrderSuccess';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Footer from './components/Footer';
import RestaurantSettings from './pages/partner/RestaurantSettings';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-dark-900 font-sans selection:bg-primary selection:text-white">
      <CartDrawer />
      <AIChatSupport />
      <Routes>
        {/* Public Routes with Navbar */}
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />
        <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
        <Route path="/restaurants" element={<><Navbar /><RestaurantFeed /><Footer /></>} />
        <Route path="/restaurant/:id" element={<><Navbar /><RestaurantDetails /><Footer /></>} />

        {/* Private Consumer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer', 'restaurant_owner', 'admin']} />}>
          <Route path="/dashboard" element={<><Navbar /><CustomerDashboard /><Footer /></>} />
          <Route path="/checkout" element={<><Navbar /><Checkout /><Footer /></>} />
          <Route path="/orders" element={<><Navbar /><OrderTracking /><Footer /></>} />
          <Route path="/order-success/:id" element={<><Navbar /><OrderSuccess /><Footer /></>} />
        </Route>

        {/* Partner Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={['restaurant_owner']} />}>
          <Route path="/partner" element={<RestaurantLayout />}>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="orders" element={<LiveOrders />} />
            <Route path="settings" element={<RestaurantSettings />} />
          </Route>
          <Route path="/partner/onboarding" element={<><Navbar /><Onboarding /><Footer /></>} />
        </Route>

        {/* Delivery Partner Routes */}
        <Route element={<ProtectedRoute allowedRoles={['delivery_partner']} />}>
          <Route path="/delivery/dashboard" element={<><Navbar /><DeliveryDashboard /><Footer /></>} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </div>
  )
}
// ... (Home component remains same)

const Home = () => (
  <div className="relative min-h-screen overflow-hidden bg-white">
    {/* Decorative Elements */}
    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Global Culinary standard</span>
          </div>

          <h1 className="text-6xl lg:text-8xl font-display font-bold text-dark-900 leading-[0.9] tracking-tight">
            Taste the <br />
            <span className="text-primary italic">Extraordinary</span> <br />
            Every Day.
          </h1>

          <p className="text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
            Join the elite club of gastronomes. We deliver not just food, but an experience curated by top chefs, powered by AI, and brought to you with white-glove precision.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/restaurants" className="group bg-primary text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 shadow-xl hover:bg-primary/90 transition-all active:scale-95">
              Explore Menu <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/partner/onboarding" className="bg-white text-dark-900 border border-gray-100 px-10 py-5 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm">
              Become a Partner
            </Link>
          </div>

          <div className="pt-10 flex gap-12 border-t border-gray-50">
            <div>
              <p className="text-3xl font-bold text-dark-900">500+</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Partners</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-dark-900">15m</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg. Delivery</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-dark-900">4.9/5</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Guest Rating</p>
            </div>
          </div>
        </div>

        <div className="relative order-first lg:order-last">
          <div className="relative z-10 rounded-[60px] overflow-hidden shadow-2xl border-[16px] border-white ring-1 ring-gray-100">
            <img
              src="https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=1000&auto=format&fit=crop"
              alt="Premium Gourmet Dish"
              className="w-full h-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Floating Cards */}
          <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-gray-100 animate-float">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Live Orders</p>
                <p className="text-xl font-bold text-dark-900">12,482</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default App;
