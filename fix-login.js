const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

async function fixLoginIssues() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users with potential login issues
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (let user of users) {
      console.log(`\nChecking user: ${user.email}`);
      
      // Test if password comparison works
      try {
        const testPassword = 'password123'; // Common test password
        const isMatch = await user.comparePassword(testPassword);
        console.log(`Password test result: ${isMatch}`);
        
        // If password doesn't work, let's check if it's properly hashed
        if (user.password && !user.password.startsWith('$2a$')) {
          console.log('Password not properly hashed, fixing...');
          user.password = await bcrypt.hash(user.password, 12);
          await user.save();
          console.log('Password fixed');
        }
      } catch (error) {
        console.log('Error testing password:', error.message);
      }
    }

    // Create a working test user if none exist
    if (users.length === 0) {
      const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Donor',
        phone: '1234567890'
      });
      await testUser.save();
      console.log('Created test user: test@example.com / password123');
    }

    mongoose.disconnect();
    console.log('\nLogin fix completed!');
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.disconnect();
  }
}

fixLoginIssues();
