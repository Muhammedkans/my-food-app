const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  updateProfile,
  getProfile,
  toggleAvailability,
  updateLocation,
  getDashboardStats
} = require('../controllers/deliveryController');

router.use(protect); // All routes require login

router.get('/profile', getProfile);
router.post('/profile', updateProfile);
router.post('/status', toggleAvailability);
router.post('/location', updateLocation);
router.get('/dashboard', getDashboardStats);

module.exports = router;
