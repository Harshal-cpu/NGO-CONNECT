const http = require('http');

const testEndpoint = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
};

async function testServer() {
  try {
    console.log('Testing server connection...');
    
    const testData = {
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: 'Donor',
      phone: '1234567890'
    };
    
    const result = await testEndpoint('/auth/register', 'POST', testData);
    console.log('Server response:', result);
    
  } catch (error) {
    console.error('Server test failed:', error.message);
  }
}

testServer();