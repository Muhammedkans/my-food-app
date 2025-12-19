const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  status: {
    isAvailable: { type: Boolean, default: false }, // Online/Offline
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    isVerified: { type: Boolean, default: false }
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere', default: [0, 0] }, // [lon, lat]
    lastUpdated: { type: Date, default: Date.now }
  },
  vehicle: {
    type: { type: String, enum: ['Bike', 'Cycle', 'Scooter', 'Car'], default: 'Bike' },
    plateNumber: String,
    model: String
  },
  earnings: {
    total: { type: Number, default: 0 },
    today: { type: Number, default: 0 },
    pendingPayout: { type: Number, default: 0 }
  },
  ratings: {
    average: { type: Number, default: 4.5 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
