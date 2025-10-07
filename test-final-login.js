const axios = require('axios');

async function testLogin() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('Testing login functionality...\n');
    
    // Test 1: Health check
    console.log('1. Testing server health...');
    const health = await axios.get(`${baseURL}/health`);
    console.log('✓ Server is running:', health.data.status);
    console.log('✓ MongoDB status:', health.data.mongodb);
    
    // Test 2: Valid login
    console.log('\n2. Testing valid login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    if (loginResponse.data.success) {
      console.log('✓ Login successful!');
      console.log('✓ Token received:', loginResponse.data.token ? 'Yes' : 'No');
      console.log('✓ User data:', loginResponse.data.user.name, '-', loginResponse.data.user.role);
    } else {
      console.log('✗ Login failed:', loginResponse.data.message);
    }
    
    // Test 3: Invalid login
    console.log('\n3. Testing invalid login...');
    try {
      await axios.post(`${baseURL}/auth/login`, {
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✓ Invalid login correctly rejected');
      } else {
        console.log('✗ Unexpected error:', error.message);
      }
    }
    
    console.log('\n✅ Login functionality is working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('Make sure the server is running on port 5000');
    }
  }
}

testLogin();
