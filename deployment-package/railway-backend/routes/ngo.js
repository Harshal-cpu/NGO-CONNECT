const express = require('express');
const { body, validationResult } = require('express-validator');
const NGO = require('../models/NGO');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Create NGO profile
router.post('/register', auth, authorize('NGO'), [
  body('name').trim().isLength({ min: 2 }).withMessage('NGO name must be at least 2 characters'),
  body('cause').isIn(['Education', 'Healthcare', 'Environment', 'Poverty', 'Animal Welfare', 'Disaster Relief', 'Human Rights', 'Other']).withMessage('Invalid cause'),
  body('contact.phone').isMobilePhone().withMessage('Invalid phone number'),
  body('contact.email').isEmail().withMessage('Invalid email'),
  body('contact.address').trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
  body('description').trim().isLength({ min: 50, max: 1000 }).withMessage('Description must be 50-1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingNGO = await NGO.findOne({ userId: req.user._id });
    if (existingNGO) {
      return res.status(400).json({ message: 'NGO profile already exists' });
    }

    const ngo = new NGO({
      userId: req.user._id,
      ...req.body
    });

    await ngo.save();
    res.status(201).json({ message: 'NGO registered successfully', ngo });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get NGO profile
router.get('/profile', auth, authorize('NGO'), async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id }).populate('userId', 'name email');
    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get logged-in user's NGO profile (without role restriction)
router.get('/my-profile', auth, async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id }).populate('userId', 'name email');
    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update NGO profile
router.put('/profile', auth, authorize('NGO'), [
  body('name').optional().trim().isLength({ min: 2 }),
  body('cause').optional().isIn(['Education', 'Healthcare', 'Environment', 'Poverty', 'Animal Welfare', 'Disaster Relief', 'Human Rights', 'Other']),
  body('contact.phone').optional().isMobilePhone(),
  body('contact.email').optional().isEmail(),
  body('contact.address').optional().trim().isLength({ min: 10 }),
  body('description').optional().trim().isLength({ min: 50, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ngo = await NGO.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }

    res.json({ message: 'Profile updated successfully', ngo });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;