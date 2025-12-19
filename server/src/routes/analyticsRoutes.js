const express = require('express');
const router = express.Router();
const { getRestaurantAnalytics, getAdminStats } = require('../controllers/analyticsController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/restaurant/:restaurantId', protect, getRestaurantAnalytics);
router.get('/admin/stats', protect, admin, getAdminStats);

module.exports = router;
