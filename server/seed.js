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
        coverImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200',
        logo: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=200',
        gallery: [
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600',
          'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600'
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
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
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
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800',
        categoryName: 'Pastas',
        isBestSeller: false,
        spiceLevel: 'Mild'
      }
    ]);

    // 2. Sakura Cyber (Japanese Fusion)
    const rest2 = await Restaurant.create({
      name: 'Sakura Cyber',
      ownerId: owner._id,
      status: { isOpen: true, isVerified: true, onboardingStage: 'COMPLETED' },
      assets: {
        coverImage: 'https://images.unsplash.com/photo-1581335443273-0414923eec3b?w=1200',
        logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'
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
        image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800',
        categoryName: 'Ramen',
        isBestSeller: true,
        spiceLevel: 'Medium'
      },
      {
        restaurantId: rest2._id,
        name: 'Neon Sushi Platter',
        price: 1250,
        dietary: 'NON-VEG',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
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
        coverImage: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1200',
        logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200'
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
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
        categoryName: 'Burgers',
        isBestSeller: true,
        spiceLevel: 'Hot'
      },
      {
        restaurantId: rest3._id,
        name: 'Electric Oreo Shake',
        price: 199,
        dietary: 'VEG',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800',
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
