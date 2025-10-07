const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check existing users
    const users = await User.find({});
    console.log('Existing users:', users.length);

    // Create test user if doesn't exist
    let user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Donor',
        phone: '1234567890'
      });
      await user.save();
      console.log('Test user created');
    } else {
      console.log('Test user exists');
    }

    // Test password comparison
    const isMatch = await user.comparePassword('password123');
    console.log('Password match test:', isMatch);

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.disconnect();
  }
}

testLogin();
