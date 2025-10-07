const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ngo_donation');
    console.log('✅ Connected to MongoDB');

    // Create test user
    const existingUser = await User.findOne({ email: 'test@test.com' });
    if (existingUser) {
      console.log('✅ Test user already exists');
      return;
    }

    const user = new User({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: 'Donor',
      phone: '1234567890'
    });

    await user.save();
    console.log('✅ Test user created: test@test.com / password123');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestUser();