const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@connectngo.com',
      password: 'admin123',
      role: 'Admin',
      phone: '1234567890',
      isVerified: true
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@connectngo.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
