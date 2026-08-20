const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const NGO = require('../models/NGO');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, ngoId, donationRequestId, message, anonymous } = req.body;
    
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        donorId: req.user._id.toString(),
        ngoId: ngoId,
        donationRequestId: donationRequestId || '',
        message: message || '',
        anonymous: anonymous || false
      }
    };

    const order = await razorpay.orders.create(options);

    // Create transaction record
    const transaction = new Transaction({
      donorId: req.user._id,
      ngoId,
      donationRequestId: donationRequestId || null,
      amount,
      razorpayOrderId: order.id,
      message,
      anonymous,
      status: 'pending'
    });

    await transaction.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      transactionId: transaction._id,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Payment order creation failed' });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is verified, update transaction
      const transaction = await Transaction.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { 
          status: 'completed',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        },
        { new: true }
      );

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      res.json({ 
        success: true, 
        message: 'Payment verified successfully',
        transaction 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed' 
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

// Get payment details
router.get('/payment/:paymentId', auth, async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);
    res.json(payment);
  } catch (error) {
    console.error('Payment fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch payment details' });
  }
});

module.exports = router;
