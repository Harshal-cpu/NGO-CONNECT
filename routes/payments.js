const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const NGO = require('../models/NGO');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, ngoId, donationRequestId, message, anonymous } = req.body;
    
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'inr', // Changed to INR
      metadata: {
        donorId: req.user._id.toString(),
        ngoId: ngoId,
        donationRequestId: donationRequestId || '',
        message: message || '',
        anonymous: anonymous || false
      }
    });

    // Create transaction record
    const transaction = new Transaction({
      donorId: req.user._id,
      ngoId,
      donationRequestId: donationRequestId || null,
      amount,
      paymentIntentId: paymentIntent.id,
      message,
      anonymous,
      status: 'pending'
    });

    await transaction.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment creation failed' });
  }
});

// Confirm payment
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      await Transaction.findOneAndUpdate(
        { paymentIntentId },
        { status: 'completed' }
      );
      
      res.json({ success: true, message: 'Payment confirmed' });
    } else {
      res.status(400).json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
});

// Get donor's transactions
router.get('/my-donations', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ donorId: req.user._id })
      .populate('ngoId', 'organizationName')
      .populate('donationRequestId', 'title category')
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get NGO's received donations
router.get('/received-donations', auth, async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }

    const transactions = await Transaction.find({ 
      ngoId: ngo._id,
      status: 'completed'
    })
    .populate('donorId', 'name email')
    .populate('donationRequestId', 'title category')
    .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics for logged-in user
router.get('/dashboard-stats', auth, async (req, res) => {
  try {
    if (req.user.role === 'Donor') {
      // Get donor statistics
      const transactions = await Transaction.find({ 
        donorId: req.user._id,
        status: 'completed'
      }).populate('ngoId', 'organizationName');
      
      const totalDonated = transactions.reduce((sum, t) => sum + t.amount, 0);
      const causesSupported = new Set(transactions.map(t => t.ngoId._id.toString())).size;
      
      res.json({
        totalDonated,
        causesSupported,
        totalDonations: transactions.length
      });
    } else if (req.user.role === 'NGO') {
      // Get NGO statistics
      const ngo = await NGO.findOne({ userId: req.user._id });
      if (!ngo) {
        return res.status(404).json({ message: 'NGO profile not found' });
      }

      const transactions = await Transaction.find({ 
        ngoId: ngo._id,
        status: 'completed'
      }).populate('donorId', 'name');
      
      const totalReceived = transactions.reduce((sum, t) => sum + t.amount, 0);
      const uniqueDonors = new Set(transactions.map(t => t.donorId._id.toString())).size;
      
      res.json({
        totalReceived,
        uniqueDonors,
        totalDonations: transactions.length,
        activeCampaigns: 1 // Default for now
      });
    } else {
      res.json({
        totalDonated: 0,
        causesSupported: 0,
        totalDonations: 0
      });
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete payment (simulate successful payment)
router.post('/complete-payment', auth, async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update transaction status to completed
    transaction.status = 'completed';
    await transaction.save();

    res.json({ 
      message: 'Payment completed successfully',
      transaction 
    });
  } catch (error) {
    console.error('Payment completion error:', error);
    res.status(500).json({ message: 'Payment completion failed' });
  }
});

module.exports = router;