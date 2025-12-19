import { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Star
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../../services/api';

const DashboardOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const restRes = await api.get('/restaurants/my');
        const restaurantId = restRes.data.data._id;
        const analyticsRes = await api.get(`/analytics/restaurant/${restaurantId}`);
        setStats(analyticsRes.data.data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Gross Sales',
      value: `₹${stats?.totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      trend: '+12.5%',
      isPositive: true,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrdersCount || '0',
      icon: ShoppingBag,
      trend: '+5.2%',
      isPositive: true,
      color: 'text-primary',
      bg: 'bg-primary/5'
    },
    {
      label: 'Active Orders',
      value: stats?.activeOrdersCount || '0',
      icon: TrendingUp,
      trend: 'Live',
      isPositive: true,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Avg. Rating',
      value: '4.8',
      icon: Star,
      trend: '+0.2',
      isPositive: true,
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    },
  ];

  return (
    <div className="space-y-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${stat.isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                {stat.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-dark-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm relative">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-dark-900 tracking-tight">Revenue Insights</h3>
              <p className="text-sm text-gray-500">Sales performance over the selected period</p>
            </div>
            <select className="bg-gray-50 text-gray-600 text-xs font-bold border border-gray-100 rounded-xl px-4 py-2 focus:ring-1 focus:ring-primary outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenueStats || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff523d" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ff523d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f4" />
                <XAxis
                  dataKey="_id"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f1f4', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff523d"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {(!stats?.revenueStats || stats.revenueStats.length === 0) && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-[40px]">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No transaction history found</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-dark-900 mb-8 border-b border-gray-50 pb-4">Business Tools</h3>
          <div className="space-y-4">
            {[
              { label: 'Inventory Sync', sub: 'Manage item availability', color: 'bg-primary' },
              { label: 'Order History', sub: 'View completed transactions', color: 'bg-secondary' },
              { label: 'Staff Access', sub: 'Manage manager permissions', color: 'bg-dark-900' },
              { label: 'Download Reports', sub: 'Tax & GST summaries', color: 'bg-emerald-500' }
            ].map((action, i) => (
              <button key={i} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[24px] text-left hover:bg-white hover:border-primary/20 transition-all flex items-center justify-between group shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${action.color}`} />
                  <div>
                    <p className="text-dark-900 font-bold group-hover:text-primary transition-colors text-sm">{action.label}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{action.sub}</p>
                  </div>
                </div>
                <ArrowUpRight className="text-gray-300 group-hover:text-primary transition-colors" size={20} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
