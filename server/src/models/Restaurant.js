const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    index: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    isOpen: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    onboardingStage: {
      type: String,
      enum: ['DETAILS', 'DOCUMENTS', 'MENU', 'BANK', 'COMPLETED', 'REJECTED'],
      default: 'DETAILS'
    },
    isFeatured: { type: Boolean, default: false }
  },
  assets: {
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    gallery: [String],
    menuImages: [String]
  },
  info: {
    cuisineTypes: [{ type: String, index: true }],
    speciality: String,
    isPureVeg: { type: Boolean, default: false },
    description: String,
    averagePreparationTime: { type: Number, default: 30 },
    costForTwo: { type: Number, required: true },
    averageCostRange: {
      type: String,
      enum: ['Budget', 'Value', 'Premium', 'Luxury'],
      default: 'Value'
    },
    offers: [{
      code: String,
      discount: String,
      description: String
    }]
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, default: 'Gurgaon' },
    pincode: String,
    geo: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' }
    }
  },
  stats: {
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    sentimentScore: { type: Number, default: 0 },
    deliveryTime: { type: String, default: '30 min' },
    monthlyOrders: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String },
    sentiment: { type: String, enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'], default: 'NEUTRAL' },
    createdAt: { type: Date, default: Date.now }
  }],
  menuConfig: {
    categories: [{
      name: String,
      isActive: { type: Boolean, default: true }
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from name
restaurantSchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().split(' ').join('-') + '-' + Date.now().toString().slice(-4);
  }
});

restaurantSchema.virtual('menuItems', {
  ref: 'MenuItem',
  localField: '_id',
  foreignField: 'restaurantId',
  justOne: false
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
