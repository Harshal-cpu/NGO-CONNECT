const express = require('express');
const User = require('../models/User');
const NGO = require('../models/NGO');
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/admin');

const router = express.Router();

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all NGOs
router.get('/ngos', auth, adminAuth, async (req, res) => {
  try {
    const ngos = await NGO.find().populate('userId', 'name email');
    res.json({ success: true, ngos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify NGO
router.put('/ngos/:id/verify', auth, adminAuth, async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    res.json({ success: true, ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
