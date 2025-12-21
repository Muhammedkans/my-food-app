const mongoose = require('mongoose');
const Restaurant = require('./src/models/Restaurant');
const MenuItem = require('./src/models/MenuItem');
const User = require('./src/models/User');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 Connected to DB');

    // Clear existing
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    // Find or Create an owner
    let owner = await User.findOne({ 'auth.role': 'restaurant_owner' });
    if (!owner) {
      owner = await User.create({
        auth: { email: 'owner@foodbey.com', passwordHash: '123456', role: 'restaurant_owner' },
        profile: { name: 'Vikram Singh' }
      });
    }

    // 1. The Neon Hearth (Luxury Italian)
    const rest1 = await Restaurant.create({
      name: 'The Neon Hearth',
      ownerId: owner._id,
      status: { isOpen: true, isVerified: true, onboardingStage: 'COMPLETED' },
      assets: {
        coverImage: 'https://res.cloudinary.com/ddnubmuty/image/upload/v1766330076/neon_hearth_grgxhg.jpg',
        logo: 'https://res.cloudinary.com/ddnubmuty/image/upload/v1766330158/restaurent1_o8235t.jpg',
        gallery: [
          'https://res.cloudinary.com/ddnubmuty/image/upload/v1766330300/restaurent2_slbgqn.jpg',
          'https://res.cloudinary.com/ddnubmuty/image/upload/v1766330610/restaurent3_xi8dls.jpg'
        ]
      },
      info: {
        cuisineTypes: ['Italian', 'Wood-Fired', 'Salads'],
        speciality: 'Hand-stretched Truffle Pizzas',
        description: 'Experience authentic Italian flavours with a futuristic neon twist. Our wood-fired ovens bring you the charred perfection of Naples.',
        averagePreparationTime: 25,
        costForTwo: 1200,
        averageCostRange: 'Premium',
        offers: [
          { code: 'NEON30', discount: '30%', description: 'Flat 30% off on first order' },
          { code: 'LUXE50', discount: '₹50', description: 'Extra 50 off on orders above 500' }
        ]
      },
      location: {
        address: 'Unit 4, Cyber City Phase 2',
        city: 'Gurgaon',
        geo: { coordinates: [77.0878, 28.4948] }
      },
      stats: { rating: 4.8, totalRatings: 1250, deliveryTime: '20-25 min', sentimentScore: 94 }
    });

    await MenuItem.create([
      {
        restaurantId: rest1._id,
        name: 'Truffle Mushroom Pizza',
        price: 599,
        dietary: 'VEG',
        image: 'https://res.cloudinary.com/ddnubmuty/image/upload/v1766330690/trufflemashroom_pizza_erjzpv.jpg',
        categoryName: 'Pizzas',
        isBestSeller: true,
        spiceLevel: 'None',
        description: 'A luxurious blend of wild mushrooms, fontina cheese, and truffle oil.'
      },
      {
        restaurantId: rest1._id,
        name: 'Pesto Fettuccine',
        price: 449,
        dietary: 'VEG',
        image: 'https://res.cloudinary.com/ddnubmuty/image/upload/v1766330779/pestofutusine_bdhj6v.jpg',
        categoryName: 'Pastas',
        isBestSeller: false,
        spiceLevel: 'Mild'
      }
    ]);

    // 2. Sakura Cyber (Japanese Fusion)
    const rest2 = await Restaurant.create({
      name: 'Sakura Ramen House',
      ownerId: owner._id,
      status: { isOpen: true, isVerified: true, onboardingStage: 'COMPLETED' },
      assets: {
        coverImage: 'https://res.cloudinary.com/ddnubmuty/image/upload/v1766331410/ramen_shushi_v0acck.avif'
      },
      info: {
        cuisineTypes: ['Japanese', 'Sushi', 'Ramen'],
        speciality: 'AI-Crafted Ramen Bowls',
        description: 'Where traditional Japanese precision meets high-speed delivery. Freshness guaranteed in every bite.',
        averagePreparationTime: 35,
        costForTwo: 1800,
        averageCostRange: 'Luxury'
      },
      location: {
        address: 'Sky Avenue 120, MG Road',
        city: 'Gurgaon',
        geo: { coordinates: [77.0890, 28.4800] }
      },
      stats: { rating: 4.9, totalRatings: 800, deliveryTime: '40-45 min', sentimentScore: 98 }
    });

    await MenuItem.create([
      {
        restaurantId: rest2._id,
        name: 'Tonkotsu Ramen',
        price: 750,
        dietary: 'NON-VEG',
        image: 'https://res.cloudinary.com/ddnubmuty/image/upload/v1766331095/tonkostu_ramen_b5ww2j.jpg',
        categoryName: 'Ramen',
        isBestSeller: true,
        spiceLevel: 'Medium'
      },
      {
        restaurantId: rest2._id,
        name: 'Neon Sushi Platter',
        price: 1250,
        dietary: 'NON-VEG',
        image: 'https://res.cloudinary.com/ddnubmuty/image/upload/v1766331131/sushi_fr14dj.avif',
        categoryName: 'Sushi',
        isBestSeller: true
      }
    ]);

    // 3. Street Byte (Quick Bites)
    const rest3 = await Restaurant.create({
      name: 'Street Byte',
      ownerId: owner._id,
      status: { isOpen: true, isVerified: true, onboardingStage: 'COMPLETED' },
      assets: {
        coverImage: 'https://res.cloudinary.com/ddnubmuty/image/upload/v1766333591/chicken_burger_dbib9b.jpg',
        logo: 'https://res.cloudinary.com/ddnubmuty/image/upload/v1766333749/fish_burger_bjixau.avif'
      },
      info: {
        cuisineTypes: ['Fast Food', 'Burgers', 'Shakes'],
        speciality: 'Ultra-Crispy Chicken Burgers',
        description: 'Fast, bold, and affordable. The perfect fuel for your digital lifestyle.',
        averagePreparationTime: 15,
        costForTwo: 400,
        averageCostRange: 'Budget'
      },
      location: {
        address: 'Food Court, Sector 14',
        city: 'Gurgaon',
        geo: { coordinates: [77.0400, 28.4700] }
      },
      stats: { rating: 4.2, totalRatings: 5000, deliveryTime: '15-20 min', sentimentScore: 82 }
    });

    await MenuItem.create([
      {
        restaurantId: rest3._id,
        name: 'Cyber Burger',
        price: 149,
        dietary: 'NON-VEG',
        image: 'https://res.cloudinary.com/ddnubmuty/image/upload/v1766333871/cyber_burger_dki25o.avif',
        categoryName: 'Burgers',
        isBestSeller: true,
        spiceLevel: 'Hot'
      },
      {
        restaurantId: rest3._id,
        name: 'Electric Oreo Shake',
        price: 199,
        dietary: 'VEG',
        image: 'https://res.cloudinary.com/ddnubmuty/image/upload/v1766333979/electric_oreo_shake_fmpabo.jpg',
        categoryName: 'Shakes',
        isBestSeller: false
      }
    ]);

    console.log('✅ Professional Seed Data Injected');
    process.exit();
  } catch (error) {
    console.error('❌ SEED ERROR:', error);
    process.exit(1);
  }
};

seedData();
