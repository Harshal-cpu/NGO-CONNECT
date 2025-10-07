const axios = require('axios');

const viewDatabase = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/database');
    const { users, ngos, donations } = response.data;
    
    console.log('\n=== DATABASE CONTENTS ===\n');
    
    console.log('USERS:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log('\nNGOs:');
    ngos.forEach(ngo => {
      console.log(`- ${ngo.name} - ${ngo.cause} - Verified: ${ngo.verified} - Total: $${ngo.totalReceived}`);
    });
    
    console.log('\nDONATIONS:');
    donations.forEach(donation => {
      console.log(`- $${donation.amount} on ${donation.date} - Status: ${donation.status}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Make sure the server is running on port 5000');
  }
};

viewDatabase();
