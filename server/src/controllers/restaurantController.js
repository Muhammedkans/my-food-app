const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// @desc    Register a new restaurant
// @route   POST /api/restaurants
// @access  Private (User becomes Restaurant Owner)
const registerRestaurant = async (req, res, next) => {
  try {
    const { name, address, cuisineTypes, costForTwo, coverImage, description } = req.body;
    const restaurant = await Restaurant.create({
      name,
      ownerId: req.user._id,
      location: {
        address,
      },
      status: {
        isOpen: true,
        isVerified: false,
        onboardingStage: 'COMPLETED'
      },
      assets: {
        coverImage: coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000',
        menuImages: []
      },
      info: {
        cuisineTypes: cuisineTypes || [],
        costForTwo,
        description: description || `Experience the best of ${cuisineTypes?.join(', ')} at ${name}.`
      }
    });

    await User.findByIdAndUpdate(req.user._id, { 'auth.role': 'restaurant_owner' });

    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all restaurants (Feed)
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, all } = req.query;
    let query = {};

    // For search/feed, we show verified restaurants or ALL if requested
    if (all !== 'true') {
      query['status.isOpen'] = true;
      // query['status.isVerified'] = true; // Relaxed for demo purposes, or we can filter in frontend
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (cuisine) {
      query['info.cuisineTypes'] = { $in: [cuisine] };
    }

    const restaurants = await Restaurant.find(query).populate('menuItems').sort('-stats.rating').limit(20);

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant & menu
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('menuItems');

    if (!restaurant) {
      res.status(404);
      throw new Error('Restaurant not found');
    }

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add menu item
// @route   POST /api/restaurants/:id/menu
// @access  Private (Owner only)
const addMenuItem = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      res.status(404);
      throw new Error('Restaurant not found');
    }

    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.auth.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this restaurant');
    }

    const menuItem = await MenuItem.create({
      restaurantId: req.params.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's restaurant
// @route   GET /api/restaurants/my
// @access  Private
const getMyRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      res.status(404);
      throw new Error('Restaurant not found');
    }
    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI Recommendations
// @route   GET /api/restaurants/recommendations
// @access  Public
const getRecommendations = async (req, res, next) => {
  try {
    // Simple Recommendation Logic: 
    // 1. Highly rated (stats.rating > 4.5)
    // 2. Trending (randomly pick some from highly rated)
    let recommendations = await Restaurant.find({
      'status.isOpen': true,
      'stats.rating': { $gte: 4 }
    }).limit(4);

    if (recommendations.length === 0) {
      recommendations = await Restaurant.find({ 'status.isOpen': true }).limit(4);
    }

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search restaurants and dishes
// @route   GET /api/restaurants/search
// @access  Public
const searchRestaurants = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const regex = new RegExp(q, 'i');

    // 1. Search in MenuItems
    const foundMenuItems = await MenuItem.find({
      $or: [
        { name: regex },
        { description: regex },
        { aiTags: { $in: [regex] } }
      ]
    }).distinct('restaurantId');

    // 2. Search in Restaurants
    const restaurants = await Restaurant.find({
      $or: [
        { name: regex },
        { 'info.cuisineTypes': regex },
        { 'info.speciality': regex },
        { _id: { $in: foundMenuItems } }
      ],
      'status.isOpen': true
    }).populate('menuItems').limit(15);

    res.json({
      success: true,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add restaurant review with AI sentiment
// @route   POST /api/restaurants/:id/review
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      res.status(404);
      throw new Error('Restaurant not found');
    }

    // AI Mock: Basic Sentiment Analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'delicious', 'perfect', 'love'];
    const negativeWords = ['bad', 'poor', 'worst', 'late', 'cold', 'horrible', 'never'];

    const words = comment.toLowerCase().split(' ');
    let score = 0;
    words.forEach(word => {
      if (positiveWords.includes(word)) score++;
      if (negativeWords.includes(word)) score--;
    });

    let sentiment = 'NEUTRAL';
    if (score > 0) sentiment = 'POSITIVE';
    if (score < 0) sentiment = 'NEGATIVE';

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
      sentiment
    };

    restaurant.reviews.push(review);

    // Update Stats
    restaurant.stats.totalRatings += 1;
    restaurant.stats.rating = (
      (restaurant.stats.rating * (restaurant.stats.totalRatings - 1) + Number(rating)) /
      restaurant.stats.totalRatings
    ).toFixed(1);

    // Update AI Sentiment Score (0-100)
    const positiveReviews = restaurant.reviews.filter(r => r.sentiment === 'POSITIVE').length;
    restaurant.stats.sentimentScore = Math.round((positiveReviews / restaurant.reviews.length) * 100);

    await restaurant.save();

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Similar Restaurants
// @route   GET /api/restaurants/:id/similar
// @access  Public
const getSimilarRestaurants = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404);
      throw new Error('Restaurant not found');
    }

    const similar = await Restaurant.find({
      _id: { $ne: restaurant._id },
      'info.cuisineTypes': { $in: restaurant.info.cuisineTypes }
    }).limit(4);

    res.json({
      success: true,
      data: similar
    });
  } catch (error) {
    next(error);
  }
};

const approveRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { 'status.isVerified': true },
      { new: true }
    );

    if (!restaurant) {
      res.status(404);
      throw new Error('Restaurant not found');
    }

    res.json({
      success: true,
      message: 'Restaurant approved successfully',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerRestaurant,
  getRestaurants,
  getRestaurantById,
  getMyRestaurant,
  getRecommendations,
  getSimilarRestaurants,
  searchRestaurants,
  addReview,
  addMenuItem,
  approveRestaurant
};
