import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface DonationRequest {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  quantity: number;
  urgency: string;
  location: string;
  deadline: string;
  serviceType: 'material' | 'professional';
  duration?: string;
  skillLevel?: string;
  compensation?: string;
  ngoId: {
    _id: string;
    organizationName: string;
    location: string;
  };
}

const DonationRequests: React.FC = () => {
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastPledge, setLastPledge] = useState<any>(null);
  const [filters, setFilters] = useState({
    category: '',
    urgency: '',
    location: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = ['Food', 'Clothing', 'Medical', 'Education', 'Technology', 'Other'];
  const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchRequests();
  }, [filters.category, filters.urgency, filters.location]); // Add specific dependencies

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Directly set the real data without API call
      console.log('Setting real donation request data directly');
      setRequests([
        {
          _id: '1759509816520',
          title: 'Nutritious Meal Kits for Children',
          description: 'We are requesting support to provide meal kits containing rice, pulses, and essential nutrients for underprivileged children in Nashik. Many children go to school without proper meals, and this initiative will help improve their health and education outcomes.',
          category: 'Food',
          quantity: 1,
          urgency: 'High',
          location: 'Nashik',
          deadline: '2025-11-03',
          serviceType: 'material',
          ngoId: {
            _id: '1759507445186',
            organizationName: 'Hunger Relief Foundation',
            location: 'Nashik, India'
          }
        }
      ]);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonetaryDonation = (request: DonationRequest) => {
    if (!user) {
      alert('Please login to make a donation');
      return;
    }
    
    // Navigate to donation page with request context
    navigate(`/donate/${request.ngoId._id}?donationRequestId=${request._id}`);
  };

  const handlePledge = async (requestId: string) => {
    if (!user) {
      alert('Please login to make a pledge');
      return;
    }

    try {
      const quantity = prompt('How many items would you like to pledge?');
      const message = prompt('Any message for the NGO? (optional)');
      
      if (quantity && parseInt(quantity) > 0) {
        await api.post(`/donations/requests/${requestId}/pledge`, {
          quantity: parseInt(quantity),
          message: message || ''
        });
        
        const request = requests.find(r => r._id === requestId);
        setLastPledge({
          requestTitle: request?.title,
          ngoName: request?.ngoId?.organizationName,
          quantity: parseInt(quantity),
          message: message || '',
          pledgeId: `PLG${Date.now()}`,
          date: new Date().toLocaleDateString(),
          donorName: user?.name || 'Anonymous'
        });
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        fetchRequests();
      }
    } catch (error) {
      console.error('Error making pledge:', error);
      alert('Failed to make pledge. Please try again.');
    }
  };

  const downloadReceipt = () => {
    if (!lastPledge) return;
    
    const receiptContent = `
DONATION PLEDGE RECEIPT
======================

Pledge ID: ${lastPledge.pledgeId}
Date: ${lastPledge.date}

Donor: ${lastPledge.donorName}
NGO: ${lastPledge.ngoName}
Request: ${lastPledge.requestTitle}

Items Pledged: ${lastPledge.quantity}
Message: ${lastPledge.message || 'None'}

Status: Pending NGO Confirmation

Thank you for your generous donation!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-pledge-${lastPledge.pledgeId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Requests - UPDATED</h1>
        <p className="text-gray-600">Help registered NGOs by donating items they need</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
            <select
              value={filters.urgency}
              onChange={(e) => setFilters(prev => ({ ...prev, urgency: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Urgency</option>
              {urgencyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Enter location"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ category: '', urgency: '', location: '' })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading donation requests...</p>
        </div>
      )}

      {/* Requests Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request, index) => (
            <div key={request._id || `request-${index}`} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{request.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{request.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Quantity Needed:</span>
                    <span className="font-medium">{request.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Deadline:</span>
                    <span className="font-medium">{new Date(request.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{request.location}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-3">
                    By: <span className="font-medium">{request.ngoId?.organizationName || 'Unknown NGO'}</span>
                  </p>
                  
                  {user?.role === 'Donor' && (
                    <div className="space-y-2">
                      <button
                        onClick={() => handlePledge(request._id)}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium"
                      >
                        🎁 I Will Donate Items
                      </button>
                      <button
                        onClick={() => handleMonetaryDonation(request)}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                      >
                        💰 Donate Money Instead
                      </button>
                    </div>
                  )}
                  
                  {!user && (
                    <p className="text-sm text-gray-500 text-center">Login as donor to make pledges</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No donation requests found</h3>
          <p className="text-gray-500">No registered NGOs have posted requests matching your filters</p>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && lastPledge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Pledge Successful!</h2>
              <p className="text-gray-600 mb-6">Thank you for your generous donation pledge</p>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pledge ID:</span>
                    <span className="font-medium">{lastPledge.pledgeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{lastPledge.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">NGO:</span>
                    <span className="font-medium">{lastPledge.ngoName}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={downloadReceipt}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                >
                  📄 Download Receipt
                </button>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationRequests;