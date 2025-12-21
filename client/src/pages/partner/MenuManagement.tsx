import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X, Search, Clock, ChevronRight, Upload, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { getBaseURL, getFullImageUrl } from '../../services/api';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/common/ImageUpload';

const MenuManagement = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    categoryName: 'Main Course',
    description: '',
    dietary: 'VEG',
    image: '',
    prepTime: '20',
    spiceLevel: 'None'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const restRes = await api.get('/restaurants/my');
      setRestaurant(restRes.data.data);

      const menuRes = await api.get(`/restaurants/${restRes.data.data._id}`);
      setMenuItems(menuRes.data.data.menuItems || []);
    } catch (err) {
      console.error("Menu fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/restaurants/${restaurant._id}/menu`, newItem);
      setIsModalOpen(false);
      fetchData();
      setNewItem({
        name: '',
        price: '',
        categoryName: 'Main Course',
        description: '',
        dietary: 'VEG',
        image: '',
        prepTime: '20',
        spiceLevel: 'None'
      });
    } catch (err) {
      alert("Failed to add menu item");
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-dark-900 tracking-tight">Menu Inventory</h2>
          <p className="text-gray-500 mt-1">Manage dishes, prices, and availability in real-time.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-md transition-all hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus size={18} /> Add New Dish
        </button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {['All Dishes', ...(restaurant?.menuConfig?.categories?.map((c: any) => c.name) || ['Starters', 'Main Course', 'Desserts'])].map((cat) => (
          <button
            key={cat}
            className="px-6 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap bg-white text-gray-500 border border-gray-100 hover:border-primary hover:text-primary transition-all shadow-sm"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <div key={item._id} className="bg-white rounded-[32px] border border-gray-100 overflow-hidden group hover:border-primary/20 transition-all flex flex-col h-full shadow-sm hover:shadow-md">
            <div className="h-56 relative overflow-hidden shrink-0">
              <img
                src={getFullImageUrl(item.image)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt={item.name}
              />
              <div className="absolute top-4 left-4">
                <div className={`w-4 h-4 border-2 ${item.dietary === 'VEG' ? 'border-green-600' : 'border-red-600'} flex items-center justify-center bg-white p-0.5`}>
                  <div className={`w-2 h-2 rounded-full ${item.dietary === 'VEG' ? 'bg-green-600' : 'bg-red-600'}`} />
                </div>
              </div>
            </div>

            <div className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-dark-900 group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{item.categoryName}</p>
                </div>
                <p className="text-xl font-bold text-dark-900">₹{item.price}</p>
              </div>

              <p className="text-gray-500 text-sm line-clamp-2 mb-8 italic">
                {item.description || 'No description provided.'}
              </p>

              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <Clock size={14} className="text-primary" />
                    {item.prepTime || 20}m
                  </div>
                  {item.spiceLevel !== 'None' && (
                    <div className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">
                      {item.spiceLevel} Spice
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-all border border-gray-100">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 transition-all border border-gray-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Card */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="bg-white border-2 border-dashed border-gray-200 rounded-[32px] min-h-[400px] flex flex-col items-center justify-center group cursor-pointer hover:border-primary hover:bg-primary/5 transition-all p-10 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all mb-6">
            <Plus size={32} />
          </div>
          <h4 className="text-dark-900 font-bold text-xl tracking-tight">Add Menu Item</h4>
          <p className="text-gray-500 text-sm mt-2 font-medium">Capture more orders by adding new and exciting dishes to your menu.</p>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Dish"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="mb-6">
            <ImageUpload
              label="Dish Image"
              value={newItem.image}
              onChange={(url) => setNewItem({ ...newItem, image: url })}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Dish Name</label>
              <input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-dark-900 focus:border-primary outline-none transition-all font-medium mt-1"
                placeholder="Ex. Margherita Pizza"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Price (₹)</label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-dark-900 focus:border-primary outline-none transition-all font-medium mt-1"
                  placeholder="249"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
                <select
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-dark-900 focus:border-primary outline-none appearance-none transition-all font-medium mt-1"
                  value={newItem.categoryName}
                  onChange={(e) => setNewItem({ ...newItem, categoryName: e.target.value })}
                >
                  <option value="" disabled>Select Category</option>
                  {(restaurant?.menuConfig?.categories?.length > 0 ? restaurant.menuConfig.categories : [{ name: 'Main Course' }, { name: 'Starters' }, { name: 'Desserts' }, { name: 'Beverages' }]).map((c: any) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Dietary Type</label>
                <div className="flex gap-2 mt-1">
                  {['VEG', 'NON-VEG'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setNewItem({ ...newItem, dietary: d })}
                      className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${newItem.dietary === d ? 'bg-primary text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-100'
                        }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Spice Preference</label>
                <select
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-dark-900 focus:border-primary outline-none mt-1 transition-all font-medium"
                  value={newItem.spiceLevel}
                  onChange={(e) => setNewItem({ ...newItem, spiceLevel: e.target.value })}
                >
                  <option>None</option>
                  <option>Mild</option>
                  <option>Medium</option>
                  <option>Hot</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Item Description</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-dark-900 focus:border-primary outline-none min-h-[100px] transition-all font-medium mt-1"
                placeholder="Describe the ingredients and taste..."
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]">
            Complete & Publish
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MenuManagement;
