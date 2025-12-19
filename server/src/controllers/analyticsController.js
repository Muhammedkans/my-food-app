const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// @desc    Get restaurant analytics
// @route   GET /api/analytics/restaurant/:restaurantId
// @access  Private (Owner only)
const getRestaurantAnalytics = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    // 1. Total Revenue (Completed orders)
    const orders = await Order.find({
      restaurant: restaurantId,
      status: 'DELIVERED'
    });

    const totalRevenue = orders.reduce((sum, order) => sum + (order.billing?.grandTotal || 0), 0);

    // 2. Total Orders
    const totalOrdersCount = await Order.countDocuments({ restaurant: restaurantId });

    // 3. Active Orders
    const activeOrdersCount = await Order.countDocuments({
      restaurant: restaurantId,
      status: { $in: ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'] }
    });

    // 4. Last 7 days revenue (Simple aggregate)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueStats = await Order.aggregate([
      {
        $match: {
          restaurant: restaurantId, // Need to handle ObjectId conversion if strictly matching
          status: 'DELIVERED',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$billing.grandTotal" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrdersCount,
        activeOrdersCount,
        revenueStats
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get platform-wide admin stats
// @route   GET /api/analytics/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res, next) => {
  try {
    const usersCount = await require('../models/User').countDocuments({ 'auth.role': 'customer' });
    const restaurantsCount = await Restaurant.countDocuments();

    // Calculate total revenue from all delivered orders
    const allOrders = await Order.find({ status: 'DELIVERED' });
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.billing?.grandTotal || 0), 0);

    // Calculate monthly orders
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthlyOrdersCount = await Order.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.json({
      success: true,
      data: {
        users: usersCount,
        restaurants: restaurantsCount,
        revenue: totalRevenue,
        monthlyOrders: monthlyOrdersCount
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRestaurantAnalytics,
  getAdminStats
};
