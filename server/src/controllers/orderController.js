const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      restaurantId,
      items,
      billing,
      paymentMethod,
      deliveryAddress
    } = req.body;

    // AI Logic: Dynamic Surge Pricing
    const currentHour = new Date().getHours();
    let surgeFee = 0;
    // Surge during peak lunch (12-14) or dinner (19-22) hours
    if ((currentHour >= 12 && currentHour <= 14) || (currentHour >= 19 && currentHour <= 22)) {
      surgeFee = 35; // Flat surge fee for demo
    }

    const finalBilling = {
      ...billing,
      surgeFee: surgeFee,
      grandTotal: billing.grandTotal + surgeFee
    };

    const isOnline = paymentMethod === 'ONLINE';

    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurantId,
      items: items.map(item => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        isVeg: item.isVeg
      })),
      billing: finalBilling,
      payment: {
        method: paymentMethod || 'ONLINE',
        status: isOnline ? 'PENDING' : 'COMPLETED',
        transactionId: isOnline ? '' : 'TXN_' + Date.now()
      },
      status: isOnline ? 'PENDING' : 'PLACED',
      deliveryAddress
    });

    // Award AI Loyalty Points (1 point for every 10 INR)
    const pointsAwarded = Math.floor(finalBilling.grandTotal / 10);
    await req.user.updateOne({ $inc: { 'wallet.loyaltyPoints': pointsAwarded } });

    // In a real app: Emit Socket event to Restaurant Owner
    // const io = require('../socket').getIO();
    // io.to(restaurantId).emit('new_order', order);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'profile.name email')
      .populate('restaurant', 'name info.location')
      .populate('items.menuItem');

    if (order) {
      res.json({
        success: true,
        data: order
      });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders for a specific restaurant
// @route   GET /api/orders/restaurant/:restaurantId
// @access  Private (Owner only)
const getRestaurantOrders = async (req, res, next) => {
  try {
    // Basic authorization check could be added here or via middleware
    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate('user', 'profile.name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Owner only)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Status validation
    const validStatuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    order.status = status;
    const updatedOrder = await order.save();

    // Real-time update via Socket.IO
    try {
      const io = require('../socket').getIO();
      io.to(order.user.toString()).emit('order_status_updated', {
        orderId: order._id,
        status: updatedOrder.status
      });
    } catch (err) {
      console.error("Socket emit failed", err);
    }

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Available Orders for Delivery Partner
// @route   GET /api/orders/delivery/available
// @access  Private (Delivery Partner)
const getAvailableDeliveryOrders = async (req, res, next) => {
  try {
    // Orders that are ready (CONFIRMED or PREPARING) but not yet out for delivery, 
    // and have no partner assigned.
    const orders = await Order.find({
      status: { $in: ['CONFIRMED', 'PREPARING'] },
      deliveryPartner: { $exists: false }
    }).populate('restaurant', 'name location assets').populate('user', 'profile.name').sort({ createdAt: 1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept Order for Delivery
// @route   PATCH /api/orders/:id/accept
// @access  Private (Delivery Partner)
const acceptDeliveryOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.deliveryPartner) {
      res.status(400);
      throw new Error('Order already accepted by another partner');
    }

    order.deliveryPartner = req.user._id;
    order.status = 'OUT_FOR_DELIVERY';
    await order.save();

    // Update Partner Status
    const DeliveryPartner = require('../models/DeliveryPartner');
    await DeliveryPartner.updateOne(
      { userId: req.user._id },
      { 'status.currentOrder': order._id, 'status.isAvailable': false }
    );

    // Socket Emit
    try {
      const io = require('../socket').getIO();
      io.to(order.user.toString()).emit('order_status_updated', {
        orderId: order._id,
        status: order.status
      });
    } catch (err) { console.error(err); }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active order for delivery partner
// @route   GET /api/orders/delivery/active
// @access  Private
const getActiveDeliveryOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      deliveryPartner: req.user._id,
      status: { $in: ['OUT_FOR_DELIVERY'] }
    }).populate('restaurant').populate('user', 'profile address');

    res.json({
      success: true,
      data: order
    });
  } catch (err) { next(err); }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  getAvailableDeliveryOrders,
  acceptDeliveryOrder,
  getActiveDeliveryOrder
};
