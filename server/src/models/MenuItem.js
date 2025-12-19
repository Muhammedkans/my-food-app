const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId, // Could link to internal category ID inside Restaurant
    required: false
  },
  categoryName: { type: String, required: true }, // Denormalized for easier filtering
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  image: { type: String, default: '' },
  isBestSeller: { type: Boolean, default: false },
  dietary: {
    type: String,
    enum: ['VEG', 'NON-VEG', 'EGG'],
    default: 'VEG'
  },
  spiceLevel: {
    type: String,
    enum: ['None', 'Mild', 'Medium', 'Hot'],
    default: 'None'
  },
  prepTime: { type: Number, default: 20 },
  attributes: {
    isVeg: { type: Boolean, default: true },
    isSpicy: { type: Boolean, default: false },
    calories: Number,
    servingSize: String
  },
  customization: [{
    title: String,
    minSelection: { type: Number, default: 0 },
    maxSelection: { type: Number, default: 1 },
    options: [{
      name: String,
      priceDelta: { type: Number, default: 0 }
    }]
  }],
  aiTags: [String],
  isAvailable: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
