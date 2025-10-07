const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const NGO = require('../models/NGO');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    console.log('User found, checking password...');
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    console.log('Password match, generating token...');

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
});

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['NGO', 'Donor', 'Admin']).withMessage('Invalid role'),
  body('phone').isMobilePhone().withMessage('Please enter a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { name, email, password, role, phone, organization } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
      phone,
      organization
    });

    await user.save();

    // Auto-create NGO profile if role is NGO
    if (role === 'NGO' && organization) {
      const ngo = new NGO({
        userId: user._id,
        name: organization,
        cause: 'Other', // Default cause, can be updated later
        contact: {
          phone: phone,
          email: email.toLowerCase(),
          address: 'Address to be updated' // Default address
        },
        description: `${organization} - NGO profile created automatically. Please update your profile with complete information.`
      });
      
      try {
        await ngo.save();
        console.log('NGO profile created automatically for:', organization);
      } catch (ngoError) {
        console.error('Error creating NGO profile:', ngoError);
        // Don't fail registration if NGO profile creation fails
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      organization: req.user.organization
    }
  });
});

module.exports = router;
