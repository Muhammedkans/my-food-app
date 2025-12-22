import { useState, useEffect } from 'react';
import { Save, Store, MapPin, Bell, Loader2 } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from '../../components/common/ImageUpload';
import { toast } from 'react-hot-toast'; // Assuming toast is available or use alert

const RestaurantSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    isOpen: true,
    coverImage: ''
  });

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      const res = await api.get('/restaurants/my');
      const data = res.data.data;
      setRestaurantId(data._id);
      setFormData({
        name: data.name || '',
        description: data.info?.description || '',
        phone: data.contact?.phone || '',
        address: data.location?.address || '',
        isOpen: data.status?.isOpen ?? true,
        coverImage: data.assets?.coverImage || ''
      });
    } catch (error) {
      console.error('Failed to fetch restaurant settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!restaurantId) return;

    setSaving(true);
    try {
      await api.put(`/restaurants/${restaurantId}`, formData);
      toast.success('Restaurant settings updated successfully!');

      // Refresh data to be sure
      await fetchRestaurantData();
      // Optional: Add a visual success indicator
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-dark-900">Restaurant Settings</h1>
        <p className="text-gray-500 font-medium">Manage your restaurant profile, branding, and operations</p>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-12 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-12">

          {/* Section: Branding (Images) */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-gray-50 pb-4 text-dark-900">
              <Store size={20} className="text-primary" /> Branding & Visuals
            </h2>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Restaurant Cover Image</label>
              <div className="h-64 w-full">
                <ImageUpload
                  label=""
                  value={formData.coverImage}
                  onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                  className="h-full"
                />
              </div>
              <p className="text-xs text-gray-400">Wide high-quality header image. (e.g. 1920x600px)</p>
            </div>
          </div>

          {/* Section: General Info */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-gray-50 pb-4 text-dark-900">
              <Store size={20} className="text-primary" /> General Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Restaurant Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-dark-900 focus:border-primary outline-none transition-all focus:bg-white focus:shadow-md"
                  placeholder="e.g. The Gourmet Kitchen"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-dark-900 focus:border-primary outline-none transition-all focus:bg-white focus:shadow-md"
                  placeholder="Short tagline or bio..."
                />
              </div>
            </div>
          </div>

          {/* Section: Contact & Location */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-gray-50 pb-4 text-dark-900">
              <MapPin size={20} className="text-primary" /> Location & Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-medium text-dark-900 focus:border-primary outline-none transition-all focus:bg-white focus:shadow-md"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Food Street, Tech City"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-medium text-dark-900 focus:border-primary outline-none transition-all focus:bg-white focus:shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Section: Operations */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-gray-50 pb-4 text-dark-900">
              <Bell size={20} className="text-primary" /> Operations
            </h2>
            <div className="flex items-center gap-5 bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="isOpen"
                  id="toggle"
                  checked={formData.isOpen}
                  onChange={handleChange}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 checked:border-primary transition-all duration-300"
                />
                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-primary transition-colors duration-300"></label>
              </div>
              <div>
                <label htmlFor="toggle" className="block font-bold text-dark-900 cursor-pointer select-none">Accepting Orders</label>
                <p className="text-xs text-gray-500 font-medium">Toggle this off if you need to temporarily stop receiving new orders.</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex justify-end sticky bottom-0 bg-white/80 backdrop-blur-md p-4 rounded-b-[40px] -mx-4 -mb-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-dark-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-sm flex items-center gap-3 hover:bg-primary hover:text-dark-900 transition-all shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RestaurantSettings;
