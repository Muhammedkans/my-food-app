const User = require('../models/User');

// @desc    Add funds to wallet
// @route   POST /api/wallet/add
// @access  Private
const addFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      res.status(400);
      throw new Error('Please provide a valid amount');
    }

    const user = await User.findById(req.user._id);

    user.wallet.balance += Number(amount);
    user.wallet.transactions.push({
      amount: Number(amount),
      type: 'CREDIT',
      description: 'Funds added to wallet'
    });

    await user.save();

    res.json({
      success: true,
      data: {
        balance: user.wallet.balance,
        transactions: user.wallet.transactions
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get wallet details
// @route   GET /api/wallet/me
// @access  Private
const getWalletDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('wallet');
    res.json({
      success: true,
      data: user.wallet
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFunds,
  getWalletDetails
};
