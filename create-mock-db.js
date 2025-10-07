const fs = require('fs');
const path = require('path');

// Create mock database files
const mockData = {
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'ngo@test.com',
      role: 'NGO',
      phone: '+1234567890',
      organization: 'Education for All'
    },
    {
      id: '2', 
      name: 'Jane Smith',
      email: 'donor@test.com',
      role: 'Donor',
      phone: '+1234567891'
    }
  ],
  ngos: [
    {
      id: '1',
      userId: '1',
      organizationName: 'Education for All',
      description: 'Providing quality education to underprivileged children',
      causes: ['Education'],
      location: 'New York, NY',
      website: 'https://educationforall.org',
      isVerified: true
    }
  ],
  donationRequests: [
    {
      id: '1',
      ngoId: '1',
      title: 'School Books and Supplies',
      description: 'We need educational materials for 200 students in our program.',
      category: 'Education',
      quantity: 200,
      urgency: 'Medium',
      location: 'New York, NY',
      deadline: '2024-12-31',
      status: 'Active',
      pledges: []
    }
  ]
};

// Create data directory
const dataDir = path.join(__dirname, 'mock-data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Write mock data files
Object.keys(mockData).forEach(collection => {
  const filePath = path.join(dataDir, `${collection}.json`);
  fs.writeFileSync(filePath, JSON.stringify(mockData[collection], null, 2));
  console.log(`✅ Created ${collection}.json`);
});

console.log('🎉 Mock database created successfully!');
console.log('📁 Data stored in: mock-data/');
console.log('💡 To use real MongoDB, install and start MongoDB service first.');