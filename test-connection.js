const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ngo_donation', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connection successful');
    
    // Test basic operation
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: 'data' });
    console.log('✅ Database write successful');
    
    await mongoose.disconnect();
    console.log('✅ All tests passed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();