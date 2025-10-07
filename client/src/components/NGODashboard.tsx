import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface DonationRequest {
  _id: string;
  title: string;
  category: string;
  quantity: number;
  urgency: string;
  status: string;
  deadline: string;
  pledges: any[];
}

const NGODashboard: React.FC = () => {
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [stats, setStats] = useState({
    totalReceived: 0,
    totalDonations: 0,
    uniqueDonors: 0,
    isVerified: false
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRequests();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/ngo-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching NGO stats:', error);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const response = await api.get('/donations/my-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">NGO Dashboard</h1>
        <p className="text-gray-600">Manage your donation requests and track pledges</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Received</h3>
          <p className="text-3xl font-bold text-green-600">${stats.totalReceived}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Donations</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalDonations}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Unique Donors</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.uniqueDonors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Verification Status</h3>
          <p className={`text-3xl font-bold ${stats.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
            {stats.isVerified ? '✓ Verified' : '⏳ Pending'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => navigate('/ngo/create-request')}
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
        >
          Create Donation Request
        </button>
        <button
          onClick={() => navigate('/ngo/profile')}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
        >
          View Profile
        </button>
      </div>

      {/* My Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">My Donation Requests</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading your requests...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {requests.map(request => (
              <div key={request._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span>Category: {request.category}</span>
                      <span>•</span>
                      <span>Quantity: {request.quantity}</span>
                      <span>•</span>
                      <span>Pledges: {request.pledges?.length || 0}</span>
                      <span>•</span>
                      <span>Deadline: {new Date(request.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donation requests yet</h3>
            <p className="text-gray-600 mb-6">Create your first donation request to start receiving help</p>
            <button
              onClick={() => navigate('/ngo/create-request')}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
            >
              Create Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NGODashboard;
