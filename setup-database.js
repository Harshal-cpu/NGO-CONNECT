const mongoose = require('mongoose');
require('dotenv').config();

// Import models to ensure they're registered
const User = require('./backend/models/User');
const NGO = require('./backend/models/NGO');
const DonationRequest = require('./backend/models/DonationRequest');

async function setupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ngo_donation');
    console.log('✅ Connected to MongoDB');

    // Create sample users
    const users = [
      {
        name: 'John Doe',
        email: 'ngo@test.com',
        password: 'password123',
        role: 'NGO',
        phone: '+1234567890',
        organization: 'Education for All'
      },
      {
        name: 'Jane Smith',
        email: 'donor@test.com',
        password: 'password123',
        role: 'Donor',
        phone: '+1234567891'
      }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.email}`);
      }
    }

    // Create sample NGO
    const ngoUser = await User.findOne({ email: 'ngo@test.com' });
    if (ngoUser) {
      const existingNGO = await NGO.findOne({ userId: ngoUser._id });
      if (!existingNGO) {
        const ngo = new NGO({
          userId: ngoUser._id,
          organizationName: 'Education for All',
          description: 'Providing quality education to underprivileged children',
          causes: ['Education'],
          location: 'New York, NY',
          website: 'https://educationforall.org',
          isVerified: true
        });
        await ngo.save();
        console.log('✅ Created NGO profile');

        // Create sample donation request
        const donationRequest = new DonationRequest({
          ngoId: ngo._id,
          title: 'School Books and Supplies',
          description: 'We need educational materials for 200 students in our program.',
          category: 'Education',
          quantity: 200,
          urgency: 'Medium',
          location: 'New York, NY',
          deadline: new Date('2024-12-31')
        });
        await donationRequest.save();
        console.log('✅ Created donation request');
      }
    }

    console.log('🎉 Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();