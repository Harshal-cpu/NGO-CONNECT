const express = require('express');
const DonationRequest = require('../models/DonationRequest');
const NGO = require('../models/NGO');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all donation requests
router.get('/requests', async (req, res) => {
  try {
    const { category, urgency, location } = req.query;
    let filter = { status: 'Active' };
    
    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;
    if (location) filter.location = new RegExp(location, 'i');
    
    const requests = await DonationRequest.find(filter)
      .populate('ngoId', 'organizationName location')
      .sort({ urgency: -1, createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create donation request (NGO only)
router.post('/requests', auth, async (req, res) => {
  try {
    const { title, description, category, quantity, urgency, location, deadline } = req.body;
    
    // Find NGO profile for the logged-in user
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }
    
    const request = new DonationRequest({
      ngoId: ngo._id,
      title,
      description,
      category,
      quantity,
      urgency,
      location,
      deadline
    });
    
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get NGO's own donation requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }

    const requests = await DonationRequest.find({ ngoId: ngo._id })
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Make pledge (Donor only)
router.post('/requests/:id/pledge', auth, async (req, res) => {
  try {
    const { quantity, message } = req.body;
    
    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.pledges.push({
      donorId: req.user._id,
      quantity,
      message
    });
    
    await request.save();
    res.json({ message: 'Pledge made successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get donor's pledges
router.get('/my-pledges', auth, async (req, res) => {
  try {
    const requests = await DonationRequest.find({
      'pledges.donorId': req.user._id
    })
    .populate('ngoId', 'organizationName')
    .sort({ createdAt: -1 });
    
    const pledges = [];
    requests.forEach(request => {
      const userPledges = request.pledges.filter(
        pledge => pledge.donorId.toString() === req.user._id.toString()
      );
      userPledges.forEach(pledge => {
        pledges.push({
          requestId: request._id,
          title: request.title,
          category: request.category,
          ngo: request.ngoId.organizationName,
          quantity: pledge.quantity,
          message: pledge.message,
          status: pledge.status,
          pledgedAt: pledge.pledgedAt
        });
      });
    });
    
    res.json(pledges);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;