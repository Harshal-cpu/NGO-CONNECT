const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const donations = [];
const ngos = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', users: users.length });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Registration request:', req.body);
  const { name, email, password, role, phone, organization } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'User exists' });
  }
  
  const user = { id: Date.now(), name, email, password, role, phone, organization };
  users.push(user);
  
  // Auto-create NGO if role is NGO
  if (role === 'NGO' && organization) {
    const ngo = {
      id: Date.now() + 1,
      name: organization,
      email: email,
      cause: 'General',
      verified: false,
      totalReceived: 0,
      userId: user.id
    };
    ngos.push(ngo);
  }
  
  console.log('User registered:', user);
  
  res.json({ 
    success: true, 
    token: 'fake-token', 
    user: { id: user.id, name, email, role } 
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.log('Login failed for:', email);
    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  }
  
  console.log('Login successful for:', email);
  res.json({ 
    success: true, 
    token: 'fake-token', 
    user: { id: user.id, name: user.name, email, role: user.role } 
  });
});

// Admin endpoints
app.get('/api/admin/donations', (req, res) => {
  const donationsWithDetails = donations.map(donation => {
    const donor = users.find(u => u.id === donation.donorId);
    const ngo = ngos.find(n => n.id === donation.ngoId);
    return {
      ...donation,
      donorName: donor?.name || 'Unknown',
      donorEmail: donor?.email || 'Unknown',
      ngoName: ngo?.name || 'Unknown'
    };
  });
  res.json({ donations: donationsWithDetails });
});

app.get('/api/admin/ngos', (req, res) => {
  res.json({ ngos });
});

app.get('/api/admin/stats', (req, res) => {
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const pendingVerifications = ngos.filter(n => !n.verified).length;
  
  res.json({
    totalUsers: users.length,
    totalNGOs: ngos.length,
    totalDonations,
    pendingVerifications
  });
});

app.put('/api/admin/ngos/:id/verify', (req, res) => {
  const ngoId = parseInt(req.params.id);
  const ngoIndex = ngos.findIndex(n => n.id === ngoId);
  
  if (ngoIndex !== -1) {
    ngos[ngoIndex].verified = true;
    res.json({ success: true, message: 'NGO verified' });
  } else {
    res.status(404).json({ success: false, message: 'NGO not found' });
  }
});

// Mock donation endpoint for testing
app.post('/api/donations/create', (req, res) => {
  const { donorId, ngoId, amount } = req.body;
  
  const donation = {
    id: Date.now(),
    donorId,
    ngoId,
    amount,
    date: new Date().toISOString().split('T')[0],
    status: 'completed'
  };
  
  donations.push(donation);
  
  // Update NGO total
  const ngoIndex = ngos.findIndex(n => n.id === ngoId);
  if (ngoIndex !== -1) {
    ngos[ngoIndex].totalReceived += amount;
  }
  
  res.json({ success: true, donation });
});

// Seed some test data
setTimeout(() => {
  // Add test users
  users.push(
    { id: 1, name: 'John Doe', email: 'john@test.com', password: 'test123', role: 'Donor', phone: '1234567890' },
    { id: 2, name: 'Jane Smith', email: 'jane@test.com', password: 'test123', role: 'Donor', phone: '1234567891' },
    { id: 3, name: 'Save Children Org', email: 'contact@savechildren.org', password: 'test123', role: 'NGO', phone: '1234567892', organization: 'Save Children' }
  );
  
  // Add test NGOs
  ngos.push(
    { id: 1, name: 'Save Children', email: 'contact@savechildren.org', cause: 'Child Welfare', verified: true, totalReceived: 1250, userId: 3 },
    { id: 2, name: 'Clean Water Initiative', email: 'info@cleanwater.org', cause: 'Water & Sanitation', verified: false, totalReceived: 550, userId: null }
  );
  
  // Add test donations
  donations.push(
    { id: 1, donorId: 1, ngoId: 1, amount: 500, date: '2024-01-15', status: 'completed' },
    { id: 2, donorId: 2, ngoId: 1, amount: 750, date: '2024-01-14', status: 'completed' },
    { id: 3, donorId: 1, ngoId: 2, amount: 250, date: '2024-01-13', status: 'pending' },
    { id: 4, donorId: 2, ngoId: 2, amount: 300, date: '2024-01-12', status: 'completed' }
  );
}, 1000);

// Database viewer endpoint
app.get('/api/database', (req, res) => {
  res.json({
    users: users.map(u => ({ ...u, password: '[HIDDEN]' })), // Hide passwords
    ngos,
    donations
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
