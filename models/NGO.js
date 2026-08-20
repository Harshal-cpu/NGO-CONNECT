const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  cause: {
    type: String,
    required: true,
    enum: ['Education', 'Healthcare', 'Environment', 'Poverty', 'Animal Welfare', 'Disaster Relief', 'Human Rights', 'Other']
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NGO', ngoSchema);