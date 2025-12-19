const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  getAvailableDeliveryOrders,
  acceptDeliveryOrder,
  getActiveDeliveryOrder
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createOrder);

router.route('/my')
  .get(protect, getMyOrders);

router.route('/delivery/available')
  .get(protect, getAvailableDeliveryOrders);

router.route('/delivery/active')
  .get(protect, getActiveDeliveryOrder);

router.route('/:id/accept')
  .patch(protect, acceptDeliveryOrder);

router.route('/restaurant/:restaurantId')
  .get(protect, getRestaurantOrders);

router.route('/:id/status')
  .patch(protect, updateOrderStatus);

router.route('/:id')
  .get(protect, getOrderById);

module.exports = router;
