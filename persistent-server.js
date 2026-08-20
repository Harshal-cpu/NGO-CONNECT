const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, 'database.json');

// Load data from file or create default
let data = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@test.com', password: 'test123', role: 'Donor', phone: '1234567890' },
    { id: 2, name: 'Admin User', email: 'admin@test.com', password: 'admin123', role: 'Admin', phone: '1234567892' }
  ],
  ngos: [
    { id: 1, name: 'Save Children', email: 'contact@savechildren.org', cause: 'Child Welfare', verified: true, totalReceived: 1250 }
  ],
  donations: [
    { id: 1, donorId: 1, ngoId: 1, amount: 500, date: '2024-01-15', status: 'completed', donorName: 'John Doe', donorEmail: 'john@test.com', ngoName: 'Save Children' }
  ]
};

// Load existing data if file exists
if (fs.existsSync(dataFile)) {
  try {
    data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    console.log('📂 Loaded existing database');
  } catch (error) {
    console.log('⚠️ Error loading database, using defaults');
  }
} else {
  console.log('🆕 Creating new database');
}

// Save data to file
const saveData = () => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, phone } = req.body;
  
  if (data.users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  const user = { id: Date.now(), name, email, password, role, phone };
  data.users.push(user);
  saveData();
  
  console.log('✅ New user registered:', email);
  
  res.json({ 
    success: true, 
    token: 'fake-token', 
    user: { id: user.id, name, email, role } 
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = data.users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.log('❌ Login failed for:', email);
    return res.status(400).json({ success: false, message: 'Invalid email or password' });
  }
  
  console.log('✅ Login successful for:', email);
  res.json({ 
    success: true, 
    token: 'fake-token', 
    user: { id: user.id, name: user.name, email: user.email, role: user.role } 
  });
});

app.get('/api/admin/donations', (req, res) => {
  res.json({ donations: data.donations });
});

app.get('/api/admin/ngos', (req, res) => {
  res.json({ ngos: data.ngos });
});

app.get('/api/admin/stats', (req, res) => {
  const totalDonations = data.donations.reduce((sum, d) => sum + d.amount, 0);
  res.json({
    totalUsers: data.users.length,
    totalNGOs: data.ngos.length,
    totalDonations,
    pendingVerifications: data.ngos.filter(n => !n.verified).length
  });
});

app.get('/api/database', (req, res) => {
  res.json({ 
    users: data.users.map(u => ({...u, password: '[HIDDEN]'})), 
    ngos: data.ngos, 
    donations: data.donations 
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`👥 Total users: ${data.users.length}`);
  console.log('🔐 Test accounts:');
  data.users.forEach(u => console.log(`   - ${u.email} (${u.role})`));
});
