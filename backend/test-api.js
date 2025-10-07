const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test registration
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Donor',
      phone: '+1234567890'
    };
    
    console.log('1. Testing registration...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
    console.log('Registration successful:', registerResponse.data.user);
    
    // Test login
    console.log('2. Testing login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login successful:', loginResponse.data.user);
    
    // Test protected route
    console.log('3. Testing protected route...');
    const token = loginResponse.data.token;
    const meResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Protected route successful:', meResponse.data.user);
    
    console.log('All tests passed!');
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testAPI();