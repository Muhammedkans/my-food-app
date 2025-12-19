const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: String,
    price: Number,
    image: String,
    quantity: { type: Number, required: true },
    isVeg: Boolean
  }],
  billing: {
    itemTotal: Number,
    deliveryFee: Number,
    platformFee: Number,
    tax: Number,
    grandTotal: Number
  },
  payment: {
    method: { type: String, default: 'See Payment Gateway' },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED'],
      default: 'PENDING'
    },
    transactionId: String
  },
  status: {
    type: String,
    enum: ['PENDING', 'PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'PLACED'
  },
  deliveryAddress: {
    addressLine: String,
    city: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
