import Razorpay from 'razorpay';
import crypto from 'crypto';
import Fund from '../models/fundsModel.js';
import User from '../models/userModel.js';


// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Order
export const createOrder = async (req, res) => {
  const { amount, currency, receipt } = req.body;
  const userId = req.user.id;

  try {
    const options = {
      amount: amount * 100, 
      currency,
      receipt,
      payment_capture: 1,
    };

    const response = await razorpay.orders.create(options);

    await Fund.create({
      user: userId,
      amount,
      currency,
      transactionId: response.id,
      orderId: response.id,
      receipt,
      status: 'created',
    });

    res.json({
      success: true,
      amount: response.amount,
      currency: response.currency,
      orderId: response.id,
      receipt: response.receipt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Capture Payment
export const capturePayment = async (req, res) => {
  const { paymentId, orderId, signature, amount } = req.body;
  const userId = req.user.id;

  try {
    // Verify the signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== signature) {
      await Fund.findOneAndUpdate(
        { orderId, user: userId },
        { status: 'failed', transactionId: paymentId, signature },
        { new: true }
      );
      return res.status(400).json({ success: false, message: 'Signature verification failed' });
    }

    // Update the fund record as successful
    const fund = await Fund.findOneAndUpdate(
      { orderId, user: userId },
      { status: 'successful', transactionId: paymentId, signature },
      { new: true }
    );

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.totalBalance = user.totalBalance + fund.amount;
    user.totalDeposits = (user.totalDeposits || 0) + fund.amount;
    await user.save();

    res.json({
      success: true,
      fund,
      totalBalance: user.totalBalance,
      totalDeposits: user.totalDeposits,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Total Balance
export const getTotalBalance = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: "User Total Balance",
      totalBalance: user.totalBalance,
      totalDeposits: user.totalDeposits || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get all the funds of logged in user
export const getAllUserBalances = async (req, res) => {
  const userId = req.user.id;

  try {
    const funds = await Fund.find({ user: userId });

    res.json({ success: true, funds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//////////////////// Admin //////////////////////

// Get All Funds
export const getAllFunds = async (req, res) => {
  try {
    const funds = await Fund.find();

    res.json({ success: true, funds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Fund and User Details using Fund ID
export const getFundDetails = async (req, res) => {
  const fundId = req.params.id;

  try {
    const fund = await Fund.findById(fundId);
    const user = await User.findById(fund.user);

    if (!fund || !user) {
      return res.status(404).json({ success: false, message: 'Fund or User not found' });
    }

    res.json({ success: true, message : "Funds and User details fetched sucessfully" , fund, user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get complete funds analytics
export const getCompleteFundsAnalytics = async (req, res) => {
  try {
    const totalFunds = await Fund.aggregate([
      {
        $group: {
          _id: null,
          totalFunds: { $sum: '$amount' },
        },
      },
    ]);

    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      totalFunds: totalFunds[0].totalFunds,
      totalUsers,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
    