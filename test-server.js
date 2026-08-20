const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Sample NGO data
const ngos = [
  {
    _id: '1',
    name: 'Save Children',
    description: 'Helping children worldwide with education and healthcare.',
    cause: 'Child Welfare',
    contact: { email: 'contact@savechildren.org', phone: '+1-555-0123', address: 'New York, NY' },
    isVerified: true,
    totalReceived: 1250
  },
  {
    _id: '2', 
    name: 'Clean Water Initiative',
    description: 'Providing clean water access to rural communities.',
    cause: 'Water & Sanitation',
    contact: { email: 'info@cleanwater.org', phone: '+1-555-0124', address: 'San Francisco, CA' },
    isVerified: false,
    totalReceived: 550
  }
];

app.get('/api/browse/ngos', (req, res) => {
  res.json({ success: true, ngos });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', ngos: ngos.length });
});

app.listen(5000, () => {
  console.log('✅ Test server running on port 5000');
  console.log('📊 NGOs available:', ngos.length);
});
