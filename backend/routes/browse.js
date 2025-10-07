const express = require('express');
const NGO = require('../models/NGO');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get all NGOs with filtering and donation totals
router.get('/ngos', async (req, res) => {
  try {
    const { cause, location, verified } = req.query;
    let filter = {};
    
    if (cause) filter.cause = cause;
    if (location) filter['contact.address'] = new RegExp(location, 'i');
    if (verified === 'true') filter.isVerified = true;
    
    const ngos = await NGO.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Calculate donation totals for each NGO
    const ngosWithTotals = await Promise.all(
      ngos.map(async (ngo) => {
        const donations = await Transaction.aggregate([
          { 
            $match: { 
              ngoId: ngo._id, 
              status: 'completed' 
            } 
          },
          { 
            $group: { 
              _id: null, 
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            } 
          }
        ]);

        const donationData = donations[0] || { total: 0, count: 0 };
        
        return {
          ...ngo.toObject(),
          totalReceived: donationData.total,
          donationCount: donationData.count
        };
      })
    );
    
    res.json(ngosWithTotals);
  } catch (error) {
    console.error('Browse NGOs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get NGO by ID with donation totals
router.get('/ngos/:id', async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id)
      .populate('userId', 'name email phone');
    
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    // Calculate donation totals
    const donations = await Transaction.aggregate([
      { 
        $match: { 
          ngoId: ngo._id, 
          status: 'completed' 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        } 
      }
    ]);

    const donationData = donations[0] || { total: 0, count: 0 };
    
    const ngoWithTotals = {
      ...ngo.toObject(),
      totalReceived: donationData.total,
      donationCount: donationData.count
    };
    
    res.json(ngoWithTotals);
  } catch (error) {
    console.error('Get NGO by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
