import { useState, useEffect } from 'react';
import { Save, Lock, MapPin, Store, Image as ImageIcon, Bell } from 'lucide-react';

const RestaurantSettings = () => {
  const [formData, setFormData] = useState({
    restaurantName: 'The Gourmet Kitchen',
    description: 'Authentic Italian cuisine with a modern twist.',
    phone: '',
    address: '',
    isOpen: true,
    notificationEmail: ''
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // In a real app, this would call an API
    alert('Settings updated successfully!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-dark-900">Settings</h1>
        <p className="text-gray-500 font-medium">Manage your restaurant profile and preferences</p>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section: General Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-gray-50 pb-4">
              <Store size={20} className="text-primary" /> General Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Restaurant Name</label>
                <input
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 font-bold text-dark-900 focus:border-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 font-bold text-dark-900 focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Contact & Location */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-gray-50 pb-4">
              <MapPin size={20} className="text-primary" /> Contact & Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 font-medium text-dark-900 focus:border-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Food Street, Tech City"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 font-medium text-dark-900 focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Notifications */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-gray-50 pb-4">
              <Bell size={20} className="text-primary" /> Notifications
            </h2>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                name="isOpen"
                checked={formData.isOpen}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <div>
                <label className="block font-bold text-dark-900">Receive Order Notifications</label>
                <p className="text-xs text-gray-500">Get notified immediately when a new order is placed.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" className="bg-dark-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-dark-900 transition-all shadow-lg">
              <Save size={18} /> Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RestaurantSettings;
