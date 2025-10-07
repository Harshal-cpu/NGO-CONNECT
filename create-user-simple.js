const http = require('http');

const userData = {
  name: 'Test User',
  email: 'test@test.com',
  password: 'password123',
  role: 'Donor',
  phone: '1234567890'
};

const postData = JSON.stringify(userData);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Response:', res.statusCode);
    console.log('Data:', data);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(postData);
req.end();