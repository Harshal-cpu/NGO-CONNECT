const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema({
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Food', 'Clothing', 'Medical', 'Education', 'Technology', 'Other'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  location: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Fulfilled', 'Expired'],
    default: 'Active'
  },
  pledges: [{
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    message: String,
    pledgedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Delivered'],
      default: 'Pending'
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('DonationRequest', donationRequestSchema);