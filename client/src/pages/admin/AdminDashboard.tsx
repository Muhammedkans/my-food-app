import { useEffect, useState } from 'react';
import {
  Users, ShoppingBag, DollarSign, Activity,
  CheckCircle, Clock, Loader2,
  TrendingUp, ArrowUpRight, Search,
  Image as ImageIcon, Upload, Trash2,
  Settings, Shield, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);
  const [media, setMedia] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, restRes] = await Promise.all([
        api.get('/analytics/admin/stats'),
        api.get('/restaurants?all=true')
      ]);
      setStats(statsRes.data.data);
      setRestaurants(restRes.data.data);
    } catch (err) {
      console.error("Admin data load failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/restaurants/${id}/approve`);
      setRestaurants(restaurants.map(r => r._id === id ? { ...r, status: { ...r.status, isVerified: true } } : r));
    } catch (err) {
      alert("Verification failed");
    }
  };

  const handleGlobalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/restaurants/upload', formData);
      setMedia([res.data.data, ...media]);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-gray-100 p-8 flex flex-col pt-32 shrink-0">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Shield className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-dark-900 font-bold text-lg">Admin Panel</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Master Control</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: Activity },
            { id: 'restaurants', label: 'Restaurants', icon: ShoppingBag },
            { id: 'media', label: 'Media Assets', icon: ImageIcon },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-dark-900 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} />
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              <ChevronRight size={16} className={`${activeTab === item.id ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto pt-32">
        <div className="max-w-6xl mx-auto">

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Users', value: stats?.users || '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Restaurants', value: stats?.restaurants || '0', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/5' },
                    { label: 'Revenue', value: `₹${(stats?.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'System Health', value: 'Active', icon: Activity, color: 'text-secondary', bg: 'bg-secondary/5' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                      <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} mb-6`}>
                        <s.icon size={24} />
                      </div>
                      <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{s.label}</h3>
                      <p className="text-3xl font-bold text-dark-900 mt-1">{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-dark-900 mb-8 border-b border-gray-50 pb-4">Recent Activity</h3>
                    <div className="space-y-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm font-semibold text-gray-700">Server Node {i} Operating Normally</span>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400">STATUS: OK</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-primary/5 rounded-[32px] p-8 border border-primary/10 relative overflow-hidden">
                    <h3 className="text-xl font-bold text-dark-900 mb-2">Monthly Revenue Target</h3>
                    <p className="text-gray-500 text-sm mb-6">Current Progress: 65%</p>
                    <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-gray-100">
                      <div className="h-full bg-primary" style={{ width: '65%' }} />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">Target: ₹2,50,000</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'restaurants' && (
              <motion.div
                key="restaurants"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-dark-900 tracking-tight">Restaurant Approvals</h2>
                    <p className="text-gray-500 mt-1">Review and verify new restaurant partners</p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                    {restaurants.filter(r => !r.status?.isVerified).length} Pending
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {restaurants.filter(r => !r.status?.isVerified).map(rest => (
                    <div
                      key={rest._id}
                      className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group"
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                          <img src={rest.assets?.coverImage} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-dark-900">{rest.name}</h3>
                          </div>
                          <p className="text-gray-500 text-sm max-w-md">New partner application from {rest.location?.address || 'Location Hidden'}.</p>
                          <div className="flex items-center gap-6 mt-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                              <Clock size={12} /> Applied {new Date(rest.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase">
                              <ShoppingBag size={12} /> {rest.info?.cuisineTypes?.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button
                          onClick={() => handleApprove(rest._id)}
                          className="flex-1 md:flex-none px-8 py-3 bg-primary text-white text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm"
                        >
                          Verify Partner
                        </button>
                        <button className="flex-1 md:flex-none px-8 py-3 bg-white text-red-500 border border-red-100 text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-red-50 transition-all">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}

                  {restaurants.filter(r => !r.status?.isVerified).length === 0 && (
                    <div className="py-24 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
                      <CheckCircle className="mx-auto text-green-200 mb-6" size={64} />
                      <h4 className="text-dark-900 font-bold text-xl">All Clear!</h4>
                      <p className="text-gray-500 mt-2">No pending restaurant verifications found.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'media' && (
              <motion.div
                key="media"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-dark-900 tracking-tight">Media Library</h2>
                    <p className="text-gray-500 mt-1">Manage global assets and promotional images</p>
                  </div>
                  <label className="bg-primary text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-sm cursor-pointer hover:bg-primary/90 transition-all">
                    <div className="flex items-center gap-2">
                      {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                      {uploading ? 'Uploading...' : 'Upload New Asset'}
                    </div>
                    <input type="file" onChange={handleGlobalUpload} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {media.map((url, i) => (
                    <div key={i} className="group relative bg-white aspect-square rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                      <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="p-3 bg-white/20 rounded-xl text-white hover:bg-white hover:text-dark-900 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {media.length === 0 && [1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white aspect-square rounded-3xl border border-dashed border-gray-200 flex items-center justify-center text-gray-200">
                      <ImageIcon size={48} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
