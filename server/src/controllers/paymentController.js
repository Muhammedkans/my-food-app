const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('⚠️ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing from .env');
}

// @desc    Create Razorpay Order
// @route   POST /api/payments/create
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Payment Signature
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      foodBeyOrderId
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment successful
      const order = await Order.findById(foodBeyOrderId);
      if (order) {
        order.payment.status = 'COMPLETED';
        order.payment.transactionId = razorpay_payment_id;
        order.status = 'PLACED'; // Officially placed now
        await order.save();

        // Real-time update for Restaurant and Customer
        try {
          const io = require('../socket').getIO();

          // 1. Notify Customer
          io.to(order.user.toString()).emit('order_status_updated', {
            orderId: order._id,
            status: 'PLACED'
          });

          // 2. Notify Restaurant (The piece you were missing!)
          const restaurantRoom = order.restaurant.toString();
          io.to(restaurantRoom).emit('order_status_updated', {
            orderId: order._id,
            status: 'PLACED'
          });

          console.log(`Payment success: notified restaurant ${restaurantRoom} about order ${order._id}`);
        } catch (err) {
          console.error("Socket emit failed after payment verify", err);
        }

        return res.json({
          success: true,
          message: "Payment verified successfully"
        });
      }
    }

    res.status(400).json({
      success: false,
      message: "Invalid signature"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment
};
