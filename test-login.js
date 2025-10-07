const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: String,
  phone: String,
  organization: String,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test user exists
    let user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      // Create test user
      user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Donor',
        phone: '1234567890'
      });
      await user.save();
      console.log('Test user created');
    }

    // Test password comparison
    const isMatch = await user.comparePassword('password123');
    console.log('Password match test:', isMatch);

    // Test wrong password
    const wrongMatch = await user.comparePassword('wrongpassword');
    console.log('Wrong password test:', wrongMatch);

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.disconnect();
  }
}

testLogin();
