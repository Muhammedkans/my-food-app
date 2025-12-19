const express = require('express');
const router = express.Router();
const { addFunds, getWalletDetails } = require('../controllers/walletController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // All wallet routes are protected

router.get('/me', getWalletDetails);
router.post('/add', addFunds);

module.exports = router;
