const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/create', createRazorpayOrder);
router.post('/verify', verifyPayment);

module.exports = router;
