import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Star, Clock, Search, Loader2, Sparkles, TrendingUp, Bot, ChevronRight, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addToCart } from '../../store/slices/cartSlice';
import api, { getBaseURL, getFullImageUrl } from '../../services/api';

const RestaurantFeed = () => {
  const dispatch = useDispatch();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [defaultRestaurants, setDefaultRestaurants] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, recRes] = await Promise.all([
          api.get('/restaurants'),
          api.get('/restaurants/recommendations')
        ]);
        setRestaurants(restRes.data.data);
        setDefaultRestaurants(restRes.data.data);
        setRecommendations(recRes.data.data);
      } catch (err: any) {
        setError(err.message || "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setLoading(true);
        try {
          const res = await api.get(`/restaurants/search?q=${searchQuery}`);
          setRestaurants(res.data.data);
        } catch (err) {
          console.error("Search failed", err);
          setRestaurants([]);
        } finally {
          setLoading(false);
        }
      } else if (searchQuery.trim().length === 0) {
        setRestaurants(defaultRestaurants);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, defaultRestaurants]);

  const handleAddToCart = (item: any, restaurantId: string) => {
    dispatch(addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      restaurantId: restaurantId,
      isVeg: item.isVeg
    }));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Finding best restaurants...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500 font-bold bg-gray-50">
      <div className="text-center">
        <X size={64} className="mx-auto mb-4 text-red-100" />
        <p className="text-xl font-bold">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-32 pt-24 space-y-12 bg-gray-50">
      {/* Featured Offers Marquee */}
      <div className="bg-white border-y border-gray-100 py-3 overflow-hidden shadow-sm">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Sparkles className="text-primary" size={14} />
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Flat 50% OFF on your first 3 orders • Use Code: WELCOME50</span>
              <span className="text-gray-200 mx-4">|</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-20">
        {/* Recommended for You Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Sparkles className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-dark-900 tracking-tight">Top Picks for You</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Handpicked favorites based on your taste</p>
              </div>
            </div>
            <button className="text-[11px] font-bold text-primary border border-primary/20 px-6 py-2 rounded-full uppercase tracking-widest hover:bg-primary hover:text-white transition-all">See All</button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {recommendations.map((rec, idx) => (
              <motion.div
                key={rec._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[300px] bg-white rounded-3xl border border-gray-100 overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              >
                <Link to={`/restaurant/${rec._id}`}>
                  <div className="h-44 relative overflow-hidden">
                    <img
                      src={getFullImageUrl(rec.assets?.coverImage)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={rec.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent " />
                    {rec.info?.offers?.[0] && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-bold text-sm">{rec.info.offers[0].discount} OFF <span className="text-primary-light ml-1">UPTO ₹100</span></p>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-dark-900 group-hover:text-primary transition-colors">{rec.name}</h3>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-lg">
                        <Star size={12} className="text-green-600 fill-green-600" />
                        <span className="text-xs text-green-700 font-bold">{rec.stats?.rating}</span>
                      </div>
                      <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">{rec.stats?.deliveryTime || '25-30 min'}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Search & All Restaurants */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <TrendingUp className="text-secondary" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-dark-900 tracking-tight">Popular Restaurants</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">The most ordered in your city</p>
              </div>
            </div>

            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food or restaurants..."
                className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 pl-12 text-dark-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {restaurants.map((restaurant, idx) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:border-primary/20 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <Link to={`/restaurant/${restaurant._id}`} className="h-56 relative overflow-hidden block">
                    <img
                      src={getFullImageUrl(restaurant.assets?.coverImage)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={restaurant.name}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-white/20">
                      <Clock size={12} className="text-primary" /> {restaurant.stats?.deliveryTime || '35 min'}
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <Link to={`/restaurant/${restaurant._id}`}>
                        <h3 className="text-xl font-bold text-dark-900 group-hover:text-primary transition-colors">{restaurant.name}</h3>
                      </Link>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded-lg">
                        <Star size={14} className="text-green-600 fill-green-600" />
                        <span className="font-bold text-green-700 text-sm">{restaurant.stats?.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-4">{restaurant.info?.cuisineTypes?.join(', ')}</p>

                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500 border-t border-gray-50 pt-4">
                      <span>₹{restaurant.info?.costForTwo} for two</span>
                      <span className="text-gray-200">•</span>
                      <span className="text-primary">{restaurant.stats?.sentimentScore || 90}% satisfied</span>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button className="flex-1 bg-primary text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all">Order Now</button>
                      <button className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                        <Heart size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RestaurantFeed;
