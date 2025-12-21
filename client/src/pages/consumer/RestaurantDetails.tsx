import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Star, Clock, ChevronLeft,
  Info, Sparkles, MapPin, Phone,
  Heart, Share2, AlertCircle, TrendingUp, Loader2, User, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { addToCart } from '../../store/slices/cartSlice';
import api, { getBaseURL } from '../../services/api';

const RestaurantDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [similarRestaurants, setSimilarRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [restRes, similarRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/restaurants/${id}/similar`)
        ]);
        setRestaurant(restRes.data.data);
        setSimilarRestaurants(similarRes.data.data || []);
      } catch (err) {
        console.error("Failed to load restaurant details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      restaurantId: restaurant._id,
      isVeg: item.dietary === 'VEG'
    }));
    // Cart will auto-open via cartSlice reducer
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Call API to save favorite
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (!restaurant) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-bold text-gray-400 uppercase tracking-widest">
      Restaurant not found
    </div>
  );

  const categories = ['All Items', ...(restaurant.menuConfig?.categories?.map((c: any) => c.name) || [])];
  const filteredMenuItems = restaurant.menuItems?.filter((item: any) =>
    activeCategory === 'All Items' || item.categoryName === activeCategory
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-16">
      {/* Hero Header */}
      <div className="h-[45vh] relative overflow-hidden">
        <img
          src={restaurant.assets?.coverImage?.startsWith('http') ? restaurant.assets?.coverImage : `${getBaseURL()}${restaurant.assets?.coverImage}`}
          className="w-full h-full object-cover"
          alt={restaurant.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

        <div className="absolute top-24 left-8">
          <Link to="/restaurants" className="p-3 bg-white/80 backdrop-blur-md rounded-full text-dark-900 hover:bg-primary hover:text-white transition-all block shadow-lg">
            <ChevronLeft size={24} />
          </Link>
        </div>

        <div className="absolute bottom-12 left-8 right-8 max-w-7xl mx-auto px-4 md:px-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {restaurant.info?.isPureVeg && (
                  <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Pure Veg</span>
                )}
                <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{restaurant.info?.averageCostRange || 'Value'} Dining</span>
                {restaurant.status?.isVerified && (
                  <span className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <Star size={12} className="fill-white" /> Verified
                  </span>
                )}
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight">
                {restaurant.name}
              </h1>
              <div className="flex flex-wrap items-center gap-5 text-gray-200">
                <div className="flex items-center gap-2">
                  <Star className="text-amber-400 fill-amber-400" size={18} />
                  <span className="font-bold text-white">{restaurant.stats?.rating || '4.5'}</span>
                  <span className="text-white/60">({restaurant.stats?.totalRatings || 0}+ Reviews)</span>
                </div>
                <span className="text-white/30">•</span>
                <div className="flex items-center gap-2 text-primary-light font-bold">
                  <Clock size={16} />
                  <span>{restaurant.stats?.deliveryTime || '35 mins'}</span>
                </div>
                <span className="text-white/30">•</span>
                <span className="font-medium">{restaurant.info?.cuisineTypes?.join(', ')}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={toggleFavorite}
                className={`p-4 backdrop-blur-md border rounded-2xl transition-all shadow-xl ${isFavorite
                  ? 'bg-red-500 border-red-400 text-white'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white hover:text-red-500'
                  }`}
              >
                <Heart size={20} className={isFavorite ? 'fill-white' : ''} />
              </button>
              <button className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white hover:text-dark-900 transition-all shadow-xl">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Sidebar: Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <Info className="text-primary" size={20} />
              <h3 className="text-xl font-bold text-dark-900">Restaurant Info</h3>
            </div>
            <p className="text-gray-500 leading-relaxed text-sm font-medium italic">
              "{restaurant.info?.description || 'A premium culinary destination specializing in authentic flavors and exquisite dining experiences.'}"
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Location</p>
                  <p className="text-dark-900 text-sm font-bold">{restaurant.location?.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Contact</p>
                  <p className="text-dark-900 text-sm font-bold">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Operating Hours</p>
                  <p className="text-dark-900 text-sm font-bold">10:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Offers */}
          {restaurant.info?.offers?.length > 0 && (
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-dark-900 pl-2">Active Offers</h3>
              <div className="grid grid-cols-1 gap-4">
                {restaurant.info.offers.map((offer: any, idx: number) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-gray-100 p-5 rounded-[24px] relative overflow-hidden shadow-sm"
                  >
                    <div className="relative z-10">
                      <p className="text-primary font-bold text-xl">{offer.discount}</p>
                      <p className="text-dark-900 text-sm font-bold mt-1">Code: {offer.code}</p>
                      <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-widest font-bold">{offer.description}</p>
                    </div>
                    <Sparkles className="absolute right-[-10px] bottom-[-10px] text-primary/5" size={80} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews Summary */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <MessageSquare className="text-primary" size={20} />
              <h3 className="text-xl font-bold text-dark-900">Customer Reviews</h3>
            </div>
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-dark-900 mb-2">{restaurant.stats?.rating || '4.5'}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-500 text-sm font-medium">{restaurant.stats?.totalRatings || 0} verified reviews</p>
            </div>
            {restaurant.reviews?.slice(0, 2).map((review: any, idx: number) => (
              <div key={idx} className="border-t border-gray-50 pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-dark-900 text-sm">Customer</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={10} className={star <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content: Menu */}
        <div className="lg:col-span-8 space-y-10">
          {/* Category Filter */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm ${activeCategory === cat
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-500 border-gray-100 hover:text-primary hover:border-primary/20'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="space-y-8">
            {filteredMenuItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredMenuItems.map((item: any) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[40px] p-6 border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-8 group"
                  >
                    <div className="w-full md:w-52 h-52 rounded-[32px] overflow-hidden shrink-0 relative">
                      <img
                        src={item.image?.startsWith('http') ? item.image : `${getBaseURL()}${item.image}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        alt={item.name}
                      />
                      {item.isBestSeller && (
                        <div className="absolute top-4 left-4 bg-amber-500 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
                          <TrendingUp size={10} /> Bestseller
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-4 h-4 border-2 border-current flex items-center justify-center p-0.5 ${item.dietary === 'VEG' ? 'text-green-600' : 'text-red-600'}`}>
                              <div className="w-full h-full rounded-full bg-current" />
                            </div>
                            {item.spiceLevel !== 'None' && (
                              <span className="text-[10px] text-orange-600 font-bold uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">{item.spiceLevel}</span>
                            )}
                          </div>
                          <h4 className="text-2xl font-bold text-dark-900 group-hover:text-primary transition-colors">{item.name}</h4>
                          <p className="text-gray-500 text-sm mt-2 line-clamp-2 font-medium">
                            {item.description || 'Specially crafted using the finest seasonal ingredients for a truly remarkable flavor profile.'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-dark-900">₹{item.price}</p>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="mt-6 px-10 py-3.5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-md uppercase tracking-widest text-[10px] active:scale-95"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <Clock size={14} className="text-primary" />
                          {item.prepTime || 20} min
                        </div>
                        {item.aiTags?.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[10px] text-gray-400 font-bold uppercase tracking-widest border border-gray-100 px-3 py-1 rounded-full bg-gray-50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                <AlertCircle className="mx-auto text-gray-200 mb-6" size={64} />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No items in this category</p>
              </div>
            )}
          </div>

          {/* Similar Restaurants */}
          {similarRestaurants.length > 0 && (
            <div className="mt-16 space-y-8">
              <h2 className="text-3xl font-display font-bold text-dark-900 tracking-tight">Similar Restaurants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {similarRestaurants.map((similar: any) => (
                  <Link
                    key={similar._id}
                    to={`/restaurant/${similar._id}`}
                    className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={similar.assets?.coverImage?.startsWith('http') ? similar.assets?.coverImage : `${getBaseURL()}${similar.assets?.coverImage}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={similar.name}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-dark-900 group-hover:text-primary transition-colors mb-2">{similar.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                          <span className="font-bold">{similar.stats?.rating || '4.5'}</span>
                        </div>
                        <span>•</span>
                        <span>{similar.stats?.deliveryTime || '30 min'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
