const axios = require('axios');

const testAdminRegistration = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test Admin',
      email: 'testadmin@test.com',
      password: 'admin123',
      role: 'Admin',
      phone: '+1234567890'
    });
    
    console.log('Admin registration successful:', response.data);
  } catch (error) {
    console.error('Admin registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Errors:', error.response?.data?.errors);
  }
};

testAdminRegistration();
