const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const users = [];

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role,
      phone
    };
    
    users.push(user);
    
    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

module.exports = router;
