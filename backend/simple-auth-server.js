const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage
let users = [
  { id: 1, name: 'John Doe', email: 'john@test.com', password: 'test123', role: 'Donor', phone: '1234567890' },
  { id: 2, name: 'Jane Smith', email: 'jane@test.com', password: 'test123', role: 'Donor', phone: '1234567891' },
  { id: 3, name: 'Admin User', email: 'admin@test.com', password: 'admin123', role: 'Admin', phone: '1234567892' }
];

let ngos = [
  { id: 1, name: 'Save Children', email: 'contact@savechildren.org', cause: 'Child Welfare', verified: true, totalReceived: 1250 },
  { id: 2, name: 'Clean Water', email: 'info@cleanwater.org', cause: 'Water & Sanitation', verified: false, totalReceived: 550 }
];

let donations = [
  { id: 1, donorId: 1, ngoId: 1, amount: 500, date: '2024-01-15', status: 'completed', donorName: 'John Doe', donorEmail: 'john@test.com', ngoName: 'Save Children' },
  { id: 2, donorId: 2, ngoId: 1, amount: 750, date: '2024-01-14', status: 'completed', donorName: 'Jane Smith', donorEmail: 'jane@test.com', ngoName: 'Save Children' }
];

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, phone } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  const user = { id: Date.now(), name, email, password, role, phone };
  users.push(user);
  
  res.json({ 
    success: true, 
    token: 'fake-token', 
    user: { id: user.id, name, email, role } 
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid email or password' });
  }
  
  res.json({ 
    success: true, 
    token: 'fake-token', 
    user: { id: user.id, name: user.name, email: user.email, role: user.role } 
  });
});

// Admin endpoints
app.get('/api/admin/donations', (req, res) => {
  res.json({ donations });
});

app.get('/api/admin/ngos', (req, res) => {
  res.json({ ngos });
});

app.get('/api/admin/stats', (req, res) => {
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  res.json({
    totalUsers: users.length,
    totalNGOs: ngos.length,
    totalDonations,
    pendingVerifications: ngos.filter(n => !n.verified).length
  });
});

app.put('/api/admin/ngos/:id/verify', (req, res) => {
  const ngoId = parseInt(req.params.id);
  const ngo = ngos.find(n => n.id === ngoId);
  if (ngo) {
    ngo.verified = true;
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'NGO not found' });
  }
});

app.get('/api/database', (req, res) => {
  res.json({ users: users.map(u => ({...u, password: '[HIDDEN]'})), ngos, donations });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('📊 Database viewer: http://localhost:5000/api/database');
  console.log('🔐 Test login: admin@test.com / admin123');
});
