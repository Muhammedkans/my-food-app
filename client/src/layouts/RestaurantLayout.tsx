import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, ShoppingBag, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const RestaurantLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/partner/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/partner/menu', icon: Menu, label: 'Menu Management' },
    { path: '/partner/orders', icon: ShoppingBag, label: 'Live Orders' },
    { path: '/partner/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 fixed h-full hidden md:flex flex-col z-30 pt-16">
        <div className="p-8">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 mb-8">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Partner Portal</p>
            <h2 className="text-dark-900 font-bold">Restaurant Dashboard</h2>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-200 ${isActive(item.path)
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-500 hover:text-dark-900 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                <ChevronRight size={14} className={isActive(item.path) ? 'opacity-100' : 'opacity-0'} />
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-gray-100">
          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl w-full transition-all font-bold text-sm"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 min-h-screen">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20 px-10 flex items-center justify-between">
          <h1 className="text-xl font-bold text-dark-900">
            {navItems.find(i => isActive(i.path))?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live & Accepting Orders</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200" />
          </div>
        </header>

        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RestaurantLayout;
