const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create or Update Delivery Profile
// @route   POST /api/delivery/profile
// @access  Private (Delivery Partner)
const updateProfile = async (req, res, next) => {
  try {
    const { vehicleType, plateNumber, model } = req.body;

    let partner = await DeliveryPartner.findOne({ userId: req.user._id });

    if (partner) {
      partner.vehicle = {
        type: vehicleType || partner.vehicle.type,
        plateNumber: plateNumber || partner.vehicle.plateNumber,
        model: model || partner.vehicle.model
      };
      await partner.save();
    } else {
      partner = await DeliveryPartner.create({
        userId: req.user._id,
        vehicle: {
          type: vehicleType || 'Bike',
          plateNumber,
          model
        },
        status: { isVerified: true } // Auto-verify for demo
      });

      // Ensure user role is updated if not already
      if (req.user.auth.role !== 'delivery_partner') {
        await User.findByIdAndUpdate(req.user._id, { 'auth.role': 'delivery_partner' });
      }
    }

    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Partner Profile
// @route   GET /api/delivery/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const partner = await DeliveryPartner.findOne({ userId: req.user._id }).populate('userId', 'profile auth');

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Delivery profile not found. Please complete onboarding.'
      });
    }

    res.json({
      success: true,
      data: partner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Availability (Online/Offline)
// @route   POST /api/delivery/status
// @access  Private
const toggleAvailability = async (req, res, next) => {
  try {
    const partner = await DeliveryPartner.findOne({ userId: req.user._id });
    if (!partner) {
      res.status(404);
      throw new Error('Partner profile not found');
    }

    partner.status.isAvailable = !partner.status.isAvailable;
    await partner.save();

    res.json({
      success: true,
      data: { isAvailable: partner.status.isAvailable }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Current Location
// @route   POST /api/delivery/location
// @access  Private
const updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    // Validate coordinates
    if (!latitude || !longitude) {
      res.status(400);
      throw new Error('Latitude and Longitude required');
    }

    const partner = await DeliveryPartner.findOne({ userId: req.user._id });
    if (!partner) {
      res.status(404);
      throw new Error('Partner profile not found');
    }

    partner.location = {
      type: 'Point',
      coordinates: [longitude, latitude], // GeoJSON order: [lon, lat]
      lastUpdated: Date.now()
    };

    await partner.save();

    res.json({
      success: true,
      message: 'Location updated'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/delivery/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const partner = await DeliveryPartner.findOne({ userId: req.user._id });
    if (!partner) throw new Error('Profile not found');

    // Mock data for now, or fetch real orders
    const stats = {
      earnings: partner.earnings,
      todayOrders: 5, // Mock
      activeTime: '4h 30m',
      ratings: partner.ratings.average
    };

    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  updateProfile,
  getProfile,
  toggleAvailability,
  updateLocation,
  getDashboardStats
};
