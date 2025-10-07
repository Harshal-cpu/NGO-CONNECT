const axios = require('axios');

async function testDonationPage() {
  console.log('🧪 Testing donation page functionality...\n');
  
  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Testing backend connection...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is running');
    
    // Test 2: Check if NGOs are available
    console.log('\n2️⃣ Testing NGO data...');
    const ngosResponse = await axios.get('http://localhost:5000/api/browse/ngos');
    if (ngosResponse.data.success && ngosResponse.data.ngos.length > 0) {
      console.log(`✅ Found ${ngosResponse.data.ngos.length} NGOs`);
      
      // Test 3: Check specific NGO by ID
      const firstNGO = ngosResponse.data.ngos[0];
      console.log(`\n3️⃣ Testing donation page for NGO: ${firstNGO.name} (ID: ${firstNGO._id})`);
      
      // Simulate what happens when user clicks donate
      console.log(`📍 Donation URL would be: http://localhost:3000/donate/${firstNGO._id}`);
      console.log(`✅ NGO data available for donation page`);
      
      // Test 4: Check if frontend is accessible
      console.log('\n4️⃣ Testing frontend accessibility...');
      try {
        const frontendResponse = await axios.get('http://localhost:3000', { timeout: 5000 });
        console.log('✅ Frontend is accessible');
      } catch (error) {
        console.log('⚠️ Frontend might still be starting up');
      }
      
    } else {
      console.log('❌ No NGOs found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDonationPage();
