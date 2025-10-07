const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true
  },
  donationRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DonationRequest',
    required: false // Optional for general donations
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  // Stripe fields
  paymentIntentId: {
    type: String,
    required: false
  },
  // Razorpay fields
  razorpayOrderId: {
    type: String,
    required: false
  },
  razorpayPaymentId: {
    type: String,
    required: false
  },
  razorpaySignature: {
    type: String,
    required: false
  },
  // Payment gateway type
  paymentGateway: {
    type: String,
    enum: ['stripe', 'razorpay'],
    default: 'razorpay'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  donationType: {
    type: String,
    enum: ['monetary', 'in-kind'],
    default: 'monetary'
  },
  message: String,
  anonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);