const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  auth: {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      unique: true,
      sparse: true // Allows null/undefined to be unique (optional, but good for email-only init)
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false // Don't return by default
    },
    otpSecret: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'restaurant_owner', 'customer', 'delivery_partner'],
      default: 'customer'
    }
  },
  profile: {
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    avatar: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    preferences: {
      isVeg: { type: Boolean, default: false },
      spiceLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
      },
      favoriteCuisines: [String]
    }
  },
  addresses: [{
    label: { type: String, required: true }, // e.g. 'Home'
    addressLine: { type: String, required: true },
    city: String,
    pincode: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' } // [lon, lat]
    },
    isDefault: { type: Boolean, default: false }
  }],
  wallet: {
    balance: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    transactions: [{
      amount: Number,
      type: { type: String, enum: ['CREDIT', 'DEBIT'] },
      description: String,
      date: { type: Date, default: Date.now }
    }]
  },
  meta: {
    lastLogin: Date,
    deviceTokens: [String],
    resetPasswordToken: String,
    resetPasswordExpire: Date
  }
}, {
  timestamps: true
});

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.auth.passwordHash);
};

// Pre-save hook to hash password
userSchema.pre('save', async function () {
  if (!this.isModified('auth.passwordHash')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.auth.passwordHash = await bcrypt.hash(this.auth.passwordHash, salt);
});

module.exports = mongoose.model('User', userSchema);
