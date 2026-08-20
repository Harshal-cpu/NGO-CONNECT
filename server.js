const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const ngoRoutes = require('./routes/ngo');
const browseRoutes = require('./routes/browse');
const donationRoutes = require('./routes/donations');
const paymentRoutes = require('./routes/payments');
const razorpayRoutes = require('./routes/razorpay-payments');
const adminRoutes = require('./routes/admin');

const User = require('./models/User');
const NGO = require('./models/NGO');
const Transaction = require('./models/Transaction');
const { auth } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Dashboard stats for donors
app.get('/api/dashboard/donor-stats', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ donorId: req.user._id, status: 'completed' });
    const totalDonated = transactions.reduce((sum, t) => sum + t.amount, 0);
    const causesSupported = new Set(transactions.map(t => t.ngoId.toString())).size;
    res.json({
      totalDonated,
      causesSupported,
      totalDonations: transactions.length,
      uniqueDonors: 1,
      activeCampaigns: await NGO.countDocuments({ isVerified: true })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard stats for NGOs
app.get('/api/dashboard/ngo-stats', auth, async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }
    const transactions = await Transaction.find({ ngoId: ngo._id, status: 'completed' });
    const totalReceived = transactions.reduce((sum, t) => sum + t.amount, 0);
    const uniqueDonors = new Set(transactions.map(t => t.donorId.toString())).size;
    res.json({
      totalReceived,
      totalDonations: transactions.length,
      uniqueDonors,
      isVerified: ngo.isVerified,
      organizationName: ngo.name
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/browse', browseRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payments/razorpay', razorpayRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});