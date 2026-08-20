const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

console.log('Starting debug server...');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'database.json');

console.log('Loading database...');
const database = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
console.log('Database loaded:', {
  users: database.users?.length || 0,
  ngos: database.ngos?.length || 0,
  donations: database.donations?.length || 0,
  donationRequests: database.donationRequests?.length || 0
});

app.get('/api/donations/requests', (req, res) => {
  console.log('GET /api/donations/requests called');
  
  if (!database.donationRequests) {
    database.donationRequests = [];
  }
  
  const requestsWithNGONames = database.donationRequests.map(request => {
    const ngo = database.ngos.find(n => Number(n.id) === Number(request.ngoId));
    console.log(`Request ${request.id}: NGO ID ${request.ngoId}, Found NGO: ${ngo ? ngo.name : 'Not found'}`);
    
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
  
  console.log('Returning requests:', requestsWithNGONames);
  res.json(requestsWithNGONames);
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
});
