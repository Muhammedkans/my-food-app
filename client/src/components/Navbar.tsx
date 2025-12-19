import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { toggleCart, selectCartCount } from '../store/slices/cartSlice';
import { ShoppingBag, Wallet, Coins, User, LogOut, LayoutDashboard, Menu, X, ChevronDown } from 'lucide-react';
import api from '../services/api';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
      dispatch(logout()); // Logout locally anyway
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-black text-xl">F</span>
              </div>
              <span className="text-2xl font-display font-bold text-dark-900 tracking-tight group-hover:text-primary transition-colors">
                Food<span className="text-primary">Bey</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/restaurants" className="text-gray-600 hover:text-dark-900 font-medium transition-colors text-sm uppercase tracking-wide">
              Restaurants
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                {/* Wallet & Points Pill */}
                <div className="hidden lg:flex items-center gap-4 bg-gray-50 px-5 py-2 rounded-full border border-gray-200/50 shadow-inner">
                  <div className="flex items-center gap-2" title="Wallet">
                    <Wallet size={16} className="text-primary" />
                    <span className="font-bold text-dark-900 text-sm">₹{user?.wallet?.balance || 0}</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center gap-2" title="Loyalty Points">
                    <Coins size={16} className="text-amber-500" />
                    <span className="font-bold text-dark-900 text-sm">{user?.wallet?.loyaltyPoints || 0}</span>
                  </div>
                </div>

                {/* Cart Button */}
                <button
                  onClick={() => dispatch(toggleCart())}
                  className="relative p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <ShoppingBag size={20} className="text-gray-700 group-hover:text-primary transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-in zoom-in">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown Trigger */}
                <div className="relative group">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white hover:bg-gray-50 rounded-full border border-gray-100 shadow-sm transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-blue-100 p-0.5">
                      <img
                        src={user?.profile?.avatar || `https://ui-avatars.com/api/?name=${user?.profile?.name}&background=random`}
                        alt="User"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">Hello</p>
                      <p className="text-sm font-bold text-dark-900 leading-none">{user?.profile?.name.split(' ')[0]}</p>
                    </div>
                    <ChevronDown size={14} className="text-gray-400 group-hover:text-dark-900 transition-colors" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-4 w-60 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="mb-4 pb-4 border-b border-gray-50">
                      <p className="font-bold text-dark-900">{user?.profile.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.auth.email}</p>
                    </div>
                    <div className="space-y-1">
                      {(user?.auth.role === 'restaurant_owner' || user?.auth.role === 'admin' || user?.auth.role === 'delivery_partner') && (
                        <Link
                          to={user?.auth.role === 'admin' ? '/admin' : user?.auth.role === 'delivery_partner' ? '/delivery/dashboard' : '/partner/dashboard'}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                      )}
                      {(user?.auth.role === 'customer') && (
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                          <User size={16} /> My Account
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                      >
                        <ShoppingBag size={16} /> My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-dark-900 font-bold hover:text-primary transition-colors text-sm">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-dark-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-dark-900/20 hover:bg-primary hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => dispatch(toggleCart())} className="relative p-2 text-dark-900">
              <ShoppingBag size={24} />
              {cartCount > 0 && <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-gray-50 p-2 rounded-xl text-dark-900"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-5">
          <Link to="/restaurants" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl bg-gray-50 font-bold text-dark-900">Restaurants</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-600">My Profile</Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-600">Orders</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 font-medium text-red-500">Sign Out</button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-3 rounded-xl bg-gray-100 font-bold text-dark-900">Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center py-3 rounded-xl bg-primary text-white font-bold">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
