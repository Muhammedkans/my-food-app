import { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../../components/common/ImageUpload';

const Onboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    costForTwo: '',
    coverImage: '',
    cuisineTypes: [] as string[]
  });

  const cuisineOptions = ['Italian', 'Chinese', 'North Indian', 'South Indian', 'Fast Food', 'Beverages', 'Desserts', 'Mexican', 'Healthy'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCuisine = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter(c => c !== cuisine)
        : [...prev.cuisineTypes, cuisine]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.cuisineTypes.length === 0) {
        alert('Please select at least one cuisine type');
        return;
      }

      await api.post('/restaurants', {
        ...formData,
        costForTwo: Number(formData.costForTwo)
      });
      navigate('/partner/dashboard'); // Changed from /restaurant/dashboard to match router likely
    } catch (error) {
      console.error(error);
      alert('Failed to register restaurant');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-2xl mx-auto pb-12">
      <div className="glass-panel p-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2">Partner with FoodBey</h2>
        <p className="text-gray-400 mb-8">Let's set up your restaurant profile.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload
            label="Restaurant Cover Image"
            value={formData.coverImage}
            onChange={(url) => setFormData({ ...formData, coverImage: url })}
          />

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Restaurant Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="input-field"
              placeholder="e.g. The Gourmet Kitchen"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field min-h-[100px]"
              placeholder="Tell us about your food..."
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Cuisine Types</label>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map(cuisine => (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => toggleCuisine(cuisine)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${formData.cuisineTypes.includes(cuisine)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700'
                    }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Cost for Two (₹)</label>
              <input
                name="costForTwo"
                value={formData.costForTwo}
                onChange={handleChange}
                type="number"
                className="input-field"
                placeholder="500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                className="input-field"
                placeholder="Street Address, City"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-3 text-lg mt-4 font-bold">
            Create Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
