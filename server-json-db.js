const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const DB_FILE = path.join(__dirname, 'database.json');

// Database functions
const loadDatabase = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      console.log('✅ Database loaded successfully');
      console.log(`👥 Users: ${data.users.length}, 🏢 NGOs: ${data.ngos.length}, 💰 Donations: ${data.donations.length}`);
      return data;
    }
  } catch (error) {
    console.error('❌ Error loading database:', error.message);
  }
  
  // Return default data if file doesn't exist or error
  return {
    users: [],
    ngos: [],
    donations: [],
    donationRequests: []
  };
};

const saveDatabase = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    console.log('💾 Database saved successfully');
    return true;
  } catch (error) {
    console.error('❌ Error saving database:', error.message);
    return false;
  }
};

// Load initial data
let database = loadDatabase();

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, phone, organization } = req.body;
  
  // Check if user already exists
  if (database.users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'User already exists with this email' });
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role,
    phone,
    organization: organization || null,
    createdAt: new Date().toISOString()
  };
  
  // Add to database
  database.users.push(newUser);
  
  // Auto-create NGO if role is NGO
  if (role === 'NGO' && organization) {
    const newNGO = {
      id: Date.now() + 1,
      name: organization,
      email: email,
      cause: 'General',
      verified: false,
      totalReceived: 0,
      userId: newUser.id,
      createdAt: new Date().toISOString()
    };
    database.ngos.push(newNGO);
  }
  
  // Save to file
  if (saveDatabase(database)) {
    console.log(`✅ New ${role} registered: ${email}`);
    res.json({
      success: true,
      message: 'Registration successful',
      token: 'auth-token-' + newUser.id,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save user data' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user in database
  const user = database.users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.log(`❌ Login failed for: ${email}`);
    return res.status(400).json({ success: false, message: 'Invalid email or password' });
  }
  
  console.log(`✅ Login successful: ${email} (${user.role})`);
  res.json({
    success: true,
    message: 'Login successful',
    token: 'auth-token-' + user.id,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Donation requests endpoint
app.get('/api/donations/requests', (req, res) => {
  // Mock donation requests data since we don't have a requests table yet
  const mockRequests = [
    {
      id: 1,
      title: "Emergency Food Supplies",
      description: "Urgent need for food supplies for flood victims",
      category: "Food",
      quantity: "500 meals",
      urgency: "High",
      location: "Mumbai, Maharashtra",
      deadline: "2025-10-15",
      ngoId: 1,
      ngoName: "Save Children",
      status: "Active",
      createdAt: "2025-09-20"
    },
    {
      id: 2,
      title: "Educational Materials",
      description: "Books and stationery for underprivileged children",
      category: "Education",
      quantity: "200 sets",
      urgency: "Medium",
      location: "Delhi, India",
      deadline: "2025-11-01",
      ngoId: 2,
      ngoName: "Green Initiative",
      status: "Active",
      createdAt: "2025-09-25"
    }
  ];
  
  res.json(mockRequests);
});

// Admin endpoints
app.get('/api/admin/donations', (req, res) => {
  const donationsWithNames = database.donations.map(donation => {
    // Get proper donor name
    let donorName = donation.donorName;
    if (!donorName || donorName.includes('@')) {
      const donor = database.users.find(u => u.id === donation.donorId);
      donorName = donor ? donor.name : donation.donorEmail || 'Unknown Donor';
    }
    
    // Get proper NGO name
    let ngoName = donation.ngoName;
    if (!ngoName) {
      const ngo = database.ngos.find(n => n.id === donation.ngoId);
      ngoName = ngo ? ngo.name : 'Unknown NGO';
    }
    
    return {
      ...donation,
      donorName,
      ngoName
    };
  });
  
  res.json({ donations: donationsWithNames });
});

app.get('/api/admin/ngos', (req, res) => {
  const ngosWithRealTotals = database.ngos.map(ngo => {
    const ngoDonations = database.donations.filter(d => d.ngoId === ngo.id);
    const actualTotalReceived = ngoDonations.reduce((sum, d) => sum + d.amount, 0);
    
    return {
      ...ngo,
      totalReceived: actualTotalReceived
    };
  });
  
  res.json({ ngos: ngosWithRealTotals });
});

app.get('/api/admin/stats', (req, res) => {
  const totalDonations = database.donations.reduce((sum, d) => sum + d.amount, 0);
  res.json({
    totalUsers: database.users.length,
    totalNGOs: database.ngos.length,
    totalDonations,
    pendingVerifications: database.ngos.filter(n => !n.verified).length
  });
});

// Simple auth middleware for JSON database
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    // Extract user ID from token (format: 'auth-token-{userId}')
    if (token.startsWith('auth-token-')) {
      const userId = parseInt(token.replace('auth-token-', ''));
      const user = database.users.find(u => u.id === userId);
      if (user) {
        req.user = { id: user.id, email: user.email, role: user.role };
        next();
      } else {
        return res.status(401).json({ message: 'User not found' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid token format' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Pledge endpoint for donation requests
app.post('/api/donations/requests/:id/pledge', authenticateToken, (req, res) => {
  const requestId = req.params.id;
  const { quantity, message } = req.body;
  const userId = req.user?.id;
  
  console.log(`User ${userId} making pledge for request ${requestId}`);
  
  res.json({
    success: true,
    message: 'Pledge made successfully',
    pledge: {
      id: Date.now(),
      requestId,
      donorId: userId,
      quantity,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  });
});

// Dashboard stats for donors
app.get('/api/dashboard/donor-stats', authenticateToken, (req, res) => {
  const userId = req.user?.id;
  const userDonations = database.donations.filter(d => d.donorId === userId);
  const totalDonated = userDonations.reduce((sum, d) => sum + d.amount, 0);
  const uniqueNGOs = [...new Set(userDonations.map(d => d.ngoId))].length;
  
  res.json({
    totalDonated,
    causesSupported: uniqueNGOs,
    totalDonations: userDonations.length,
    uniqueDonors: 1,
    activeCampaigns: database.ngos.filter(n => n.verified).length
  });
});

// Dashboard stats for NGOs
app.get('/api/dashboard/ngo-stats', authenticateToken, (req, res) => {
  const userId = req.user?.id;
  const ngo = database.ngos.find(n => n.userId === userId);
  const ngoId = ngo?.id;
  const ngoDonations = database.donations.filter(d => d.ngoId === ngoId);
  const totalReceived = ngoDonations.reduce((sum, d) => sum + d.amount, 0);
  const uniqueDonors = [...new Set(ngoDonations.map(d => d.donorId))].length;
  
  res.json({
    totalReceived,
    totalDonations: ngoDonations.length,
    uniqueDonors,
    isVerified: ngo?.verified || false,
    organizationName: ngo?.name || 'Unknown'
  });
});

// NGO Profile endpoints
app.get('/api/ngo/my-profile', authenticateToken, (req, res) => {
  const userId = req.user?.id;
  const ngo = database.ngos.find(n => n.userId === userId);
  
  if (!ngo) {
    return res.status(404).json({ message: 'NGO profile not found' });
  }
  
  res.json(ngo);
});

// Donation requests endpoints
app.get('/api/donations/my-requests', authenticateToken, (req, res) => {
  const userId = req.user?.id;
  const ngo = database.ngos.find(n => n.userId === userId);
  
  if (!ngo) {
    return res.status(404).json({ message: 'NGO not found' });
  }
  
  // Return empty array for now since we don't have donation requests in the simple backend
  res.json([]);
});

// Get all donation requests with NGO names
app.get('/api/donations/requests', (req, res) => {
  if (!database.donationRequests) {
    database.donationRequests = [];
  }
  
  const requestsWithNGONames = database.donationRequests.map(request => {
    // Convert both IDs to numbers for comparison
    const ngo = database.ngos.find(n => Number(n.id) === Number(request.ngoId));
    console.log(`Looking for NGO with ID: ${request.ngoId}, Found: ${ngo ? ngo.name : 'Not found'}`);
    
    return {
      ...request,
      _id: request.id,
      ngoId: {
        _id: request.ngoId,
        organizationName: ngo ? ngo.name : 'Unknown NGO',
        location: ngo ? (ngo.contact?.address || 'Unknown Location') : 'Unknown Location'
      }
    };
  });
  
  console.log('Donation requests with NGO names:', requestsWithNGONames);
  res.json(requestsWithNGONames);
});

// Create donation request endpoint
app.post('/api/donations/requests', authenticateToken, (req, res) => {
  const userId = req.user?.id;
  const ngo = database.ngos.find(n => n.userId === userId);
  
  if (!ngo) {
    return res.status(404).json({ message: 'NGO not found' });
  }
  
  const { title, description, targetAmount, category, urgency, quantity, location, deadline } = req.body;
  
  const donationRequest = {
    id: Date.now(),
    ngoId: ngo.id,
    title,
    description,
    targetAmount: parseFloat(targetAmount) || null,
    category,
    urgency: urgency || 'Medium',
    quantity: parseInt(quantity) || 1,
    location: location || ngo.contact?.address || 'Not specified',
    deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    status: 'active',
    createdAt: new Date().toISOString(),
    pledges: []
  };
  
  // Initialize donation requests array if it doesn't exist
  if (!database.donationRequests) {
    database.donationRequests = [];
  }
  
  database.donationRequests.push(donationRequest);
  saveDatabase(database);
  
  console.log(`✅ Donation request created: ${title}`);
  res.json({ success: true, request: donationRequest });
});

// Payment endpoints
app.post('/api/payments/create-donation', authenticateToken, (req, res) => {
  console.log('🔄 Processing donation request...');
  console.log('User:', req.user);
  console.log('Request body:', req.body);
  
  const { ngoId, amount, message } = req.body;
  const donorId = req.user?.id;
  
  if (!donorId) {
    console.log('❌ No donor ID found');
    return res.status(400).json({ message: 'Donor ID required' });
  }
  
  if (!ngoId || !amount) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ message: 'NGO ID and amount required' });
  }
  
  const donation = {
    id: Date.now(),
    donorId,
    ngoId: parseInt(ngoId),
    amount: parseFloat(amount),
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
    donorName: req.user?.name,
    donorEmail: req.user?.email,
    message: message || '',
    createdAt: new Date().toISOString()
  };
  
  console.log('💰 Creating donation:', donation);
  
  database.donations.push(donation);
  saveDatabase(database);
  
  console.log('✅ Donation saved successfully');
  res.json({ success: true, donation });
});

app.get('/api/payments/my-donations', authenticateToken, (req, res) => {
  const userId = req.user?.id;
  const userDonations = database.donations.filter(d => d.donorId === userId);
  
  // Add NGO names to donations that don't have them
  const donationsWithNGONames = userDonations.map(donation => {
    // If donation already has ngoName, keep it
    if (donation.ngoName && donation.ngoName !== 'Unknown NGO') {
      return donation;
    }
    
    // Otherwise, look up NGO name
    const ngo = database.ngos.find(n => n.id === donation.ngoId);
    return {
      ...donation,
      ngoName: ngo ? ngo.name : `NGO ID: ${donation.ngoId}`
    };
  });
  
  console.log('User donations with NGO names:', donationsWithNGONames);
  res.json(donationsWithNGONames);
});

// Razorpay payment endpoints
app.post('/api/payments/razorpay/create-order', authenticateToken, async (req, res) => {
  try {
    console.log('🔄 Creating Razorpay order...');
    const { ngoId, amount, message, anonymous } = req.body;
    const donorId = req.user?.id;
    
    if (!donorId) {
      return res.status(400).json({ message: 'Donor ID required' });
    }
    
    if (!ngoId || !amount) {
      return res.status(400).json({ message: 'NGO ID and amount required' });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        donorId: donorId.toString(),
        ngoId: ngoId.toString(),
        message: message || '',
        anonymous: anonymous || false
      }
    };

    const order = await razorpay.orders.create(options);
    
    // Create a pending donation record
    const donation = {
      id: Date.now(),
      donorId,
      ngoId: parseInt(ngoId),
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      donorName: req.user?.name,
      donorEmail: req.user?.email,
      message: message || '',
      anonymous: anonymous || false,
      razorpayOrderId: order.id,
      paymentGateway: 'razorpay',
      createdAt: new Date().toISOString()
    };

    database.donations.push(donation);
    saveDatabase(database);

    console.log('✅ Razorpay order created:', order.id);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      donationId: donation.id,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('❌ Razorpay order creation error:', error);
    res.status(500).json({ message: 'Payment order creation failed' });
  }
});

app.post('/api/payments/razorpay/verify-payment', authenticateToken, async (req, res) => {
  try {
    console.log('🔄 Verifying Razorpay payment...');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = req.body;
    
    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is verified, update donation status
      const donationIndex = database.donations.findIndex(d => d.id === parseInt(donationId));
      
      if (donationIndex !== -1) {
        database.donations[donationIndex].status = 'completed';
        database.donations[donationIndex].razorpayPaymentId = razorpay_payment_id;
        database.donations[donationIndex].razorpaySignature = razorpay_signature;
        database.donations[donationIndex].completedAt = new Date().toISOString();
        
        saveDatabase(database);
        
        console.log('✅ Payment verified and donation completed');
        res.json({ 
          success: true, 
          message: 'Payment verified successfully',
          donation: database.donations[donationIndex]
        });
      } else {
        res.status(404).json({ message: 'Donation not found' });
      }
    } else {
      console.log('❌ Payment signature verification failed');
      res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed' 
      });
    }
  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

app.get('/api/payments/razorpay/payment/:paymentId', authenticateToken, async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);
    res.json(payment);
  } catch (error) {
    console.error('❌ Payment fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch payment details' });
  }
});

app.put('/api/admin/ngos/:id/verify', (req, res) => {
  const ngoId = parseInt(req.params.id);
  const ngo = database.ngos.find(n => n.id === ngoId);
  
  if (ngo) {
    ngo.verified = true;
    ngo.verifiedAt = new Date().toISOString();
    
    if (saveDatabase(database)) {
      console.log(`✅ NGO verified: ${ngo.name}`);
      res.json({ success: true, message: 'NGO verified successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save verification' });
    }
  } else {
    res.status(404).json({ success: false, message: 'NGO not found' });
  }
});

app.delete('/api/admin/ngos/:id', (req, res) => {
  const ngoId = parseInt(req.params.id);
  const ngoIndex = database.ngos.findIndex(n => n.id === ngoId);
  
  if (ngoIndex !== -1) {
    const deletedNgo = database.ngos[ngoIndex];
    database.ngos.splice(ngoIndex, 1);
    
    if (saveDatabase(database)) {
      console.log(`🗑️ NGO deleted: ${deletedNgo.name}`);
      res.json({ success: true, message: 'NGO deleted successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete NGO' });
    }
  } else {
    res.status(404).json({ success: false, message: 'NGO not found' });
  }
});

// Database viewer
app.get('/api/database', (req, res) => {
  res.json({
    users: database.users.map(u => ({ ...u, password: '[PROTECTED]' })),
    ngos: database.ngos,
    donations: database.donations,
    stats: {
      totalUsers: database.users.length,
      totalNGOs: database.ngos.length,
      totalDonations: database.donations.length,
      databaseFile: DB_FILE
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server running',
    database: 'Connected',
    users: database.users.length,
    timestamp: new Date().toISOString()
  });
});

// Edit NGO endpoint
app.put('/api/ngo/:id/edit', (req, res) => {
  const ngoId = parseInt(req.params.id);
  const { name, cause, contact, description } = req.body;
  
  const ngoIndex = database.ngos.findIndex(n => n.id === ngoId);
  
  if (ngoIndex === -1) {
    return res.status(404).json({ success: false, message: 'NGO not found' });
  }
  
  // Update NGO data
  database.ngos[ngoIndex] = {
    ...database.ngos[ngoIndex],
    name,
    cause,
    contact,
    description,
    updatedAt: new Date().toISOString()
  };
  
  if (saveDatabase(database)) {
    console.log(`✅ NGO updated: ${name}`);
    res.json({
      success: true,
      message: 'NGO updated successfully',
      ngo: database.ngos[ngoIndex]
    });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update NGO' });
  }
});

// Get current user (for token validation)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = database.users.find(u => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// Browse NGOs endpoint
app.get('/api/browse/ngos', (req, res) => {
  const ngosWithDonations = database.ngos.map(ngo => {
    // Calculate actual total donations received by this NGO
    const ngoDonations = database.donations.filter(d => d.ngoId === ngo.id);
    const actualTotalReceived = ngoDonations.reduce((sum, d) => sum + d.amount, 0);
    const donationCount = ngoDonations.length;
    
    return {
      _id: ngo.id,
      name: ngo.name,
      cause: ngo.cause,
      description: ngo.description || 'No description provided',
      contact: ngo.contact || { email: ngo.email, phone: '', address: '' },
      isVerified: ngo.verified || false,
      totalReceived: actualTotalReceived,
      donationCount: donationCount
    };
  });
  
  res.json(ngosWithDonations);
});

// NGO Registration endpoint
app.post('/api/ngo/register', (req, res) => {
  const { name, cause, contact, description } = req.body;
  
  // Check if NGO already exists
  if (database.ngos.find(n => n.name === name || n.email === contact.email)) {
    return res.status(400).json({ success: false, message: 'NGO with this name or email already exists' });
  }
  
  // Create new NGO
  const newNGO = {
    id: Date.now(),
    name,
    cause,
    contact,
    description,
    verified: false,
    totalReceived: 0,
    userId: null,
    createdAt: new Date().toISOString()
  };
  
  // Add to database
  database.ngos.push(newNGO);
  
  // Save to file
  if (saveDatabase(database)) {
    console.log(`✅ New NGO registered: ${name}`);
    res.json({
      success: true,
      message: 'NGO registered successfully',
      ngo: {
        id: newNGO.id,
        name: newNGO.name,
        cause: newNGO.cause,
        verified: newNGO.verified
      }
    });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save NGO data' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n🚀 CONNECT NGO Server Started');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`💾 Database: ${DB_FILE}`);
  console.log(`👥 Loaded Users: ${database.users.length}`);
  console.log(`🏢 Loaded NGOs: ${database.ngos.length}`);
  console.log(`💰 Loaded Donations: ${database.donations.length}`);
  console.log('\n📋 Available Accounts:');
  database.users.forEach(user => {
    console.log(`   - ${user.email} (${user.role})`);
  });
  console.log('\n🔗 API Endpoints:');
  console.log(`   - Database Viewer: http://localhost:${PORT}/api/database`);
  console.log(`   - Health Check: http://localhost:${PORT}/api/health`);
  console.log('\n✅ Ready for connections!\n');
});
