const mongoose = require('mongoose');
const User = require('./models/User');
const NGO = require('./models/NGO');
require('dotenv').config();

async function testNGOFix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a test NGO user
    const testNGO = new User({
      name: 'Test NGO Organization',
      email: 'testngo@example.com',
      password: 'password123',
      role: 'NGO',
      phone: '1234567890',
      organization: 'Help Children Foundation'
    });

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'testngo@example.com' });
    if (existingUser) {
      console.log('Test NGO user already exists');
    } else {
      await testNGO.save();
      console.log('Test NGO user created');

      // Create NGO profile
      const ngoProfile = new NGO({
        userId: testNGO._id,
        name: 'Help Children Foundation',
        cause: 'Education',
        contact: {
          phone: '1234567890',
          email: 'testngo@example.com',
          address: '123 NGO Street, City, State'
        },
        description: 'We help children get access to quality education and learning resources.'
      });

      await ngoProfile.save();
      console.log('NGO profile created');
    }

    // Test browse functionality
    console.log('\nTesting NGO browse functionality:');
    const allNGOs = await NGO.find({}).populate('userId', 'name email');
    console.log(`Found ${allNGOs.length} NGOs in database:`);
    
    allNGOs.forEach((ngo, index) => {
      console.log(`${index + 1}. ${ngo.name} - ${ngo.cause} (${ngo.isVerified ? 'Verified' : 'Not Verified'})`);
    });

    mongoose.disconnect();
    console.log('\n✅ NGO registration fix test completed!');
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.disconnect();
  }
}

testNGOFix();
