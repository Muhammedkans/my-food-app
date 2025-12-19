const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ 'auth.email': email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      auth: {
        email,
        passwordHash: password, // will be hashed in pre-save
        phone,
        role: role || 'customer'
      },
      profile: {
        name
      }
    });

    if (user) {
      const token = generateToken(user._id);

      // Set cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      const userData = user.toObject();
      delete userData.auth.passwordHash;

      res.status(201).json({
        success: true,
        data: userData
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user by email and include password field
    const user = await User.findOne({ 'auth.email': email }).select('+auth.passwordHash');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Role validation - if role is provided by frontend selection
    // ensure the user actually has that role
    if (role && user.auth.role !== role) {
      const roleNames = {
        'customer': 'Customer',
        'restaurant_owner': 'Restaurant Partner',
        'delivery_partner': 'Delivery Partner'
      };
      return res.status(403).json({
        success: false,
        message: `Account found, but it is not registered as a ${roleNames[role] || role}.`
      });
    }

    const token = generateToken(user._id);

    // Set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    // Update last login
    user.meta.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const userData = user.toObject();
    delete userData.auth.passwordHash;
    userData.token = token;

    return res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: 'A professional server error occurred during login. Please contact support if this persists.'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & address
// @route   PATCH /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (req.body.name) user.profile.name = req.body.name;

      if (req.body.address) {
        if (!user.addresses) {
          user.addresses = [];
        }
        // Force push, ensuring fields are strings
        const { label, addressLine, city } = req.body.address;

        const newAddress = {
          label: String(label || 'Home'),
          addressLine: String(addressLine || ''),
          city: String(city || '')
        };

        // Basic validation
        if (newAddress.addressLine.trim().length > 0) {
          user.addresses.push(newAddress);
        }
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: updatedUser
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    // For profile update, we can keep next(error) or switch to direct response
    // Let's safe guard it too
    console.error("Profile Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
};
