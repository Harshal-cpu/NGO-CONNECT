const mongoose = require('mongoose');
const Transaction = require('./backend/models/Transaction');
const DonationRequest = require('./backend/models/DonationRequest');
const User = require('./backend/models/User');
const NGO = require('./backend/models/NGO');

async function testAPIs() {
  try {
    await mongoose.connect('mongodb://localhost:27017/connect-ngo');
    console.log('Connected to MongoDB');

    // Check if we have any users
    const users = await User.find();
    console.log('Total users:', users.length);

    // Check if we have any transactions
    const transactions = await Transaction.find().populate('ngoId donorId');
    console.log('Total transactions:', transactions.length);
    console.log('Transactions:', transactions);

    // Check if we have any donation requests
    const requests = await DonationRequest.find().populate('ngoId');
    console.log('Total donation requests:', requests.length);
    console.log('Requests:', requests);

    // Check pledges
    const requestsWithPledges = await DonationRequest.find({ 'pledges.0': { $exists: true } });
    console.log('Requests with pledges:', requestsWithPledges.length);

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPIs();
