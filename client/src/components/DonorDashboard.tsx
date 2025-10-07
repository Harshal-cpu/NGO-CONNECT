import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DonationRequestReceipt from './DonationRequestReceipt';
import api from '../services/api';

interface Pledge {
  requestId: string;
  title: string;
  category: string;
  ngo: string;
  quantity: number;
  message?: string;
  status: string;
  pledgedAt: string;
}

const DonorDashboard: React.FC = () => {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [stats, setStats] = useState({
    totalPledges: 0,
    totalValue: 0,
    activePledges: 0,
    completedPledges: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper function to safely format numbers
  const safeToLocaleString = (value: any): string => {
    const num = Number(value);
    return isNaN(num) ? '0' : num.toLocaleString();
  };

  useEffect(() => {
    fetchPledges();
  }, []);

  const fetchPledges = async () => {
    try {
      setLoading(true);
      
      // Initialize with safe defaults
      let currentStats = {
        totalPledges: 0,
        totalValue: 0,
        activePledges: 0,
        completedPledges: 0
      };
      
      // Fetch real stats from backend
      try {
        const statsResponse = await api.get('/dashboard/donor-stats');
        if (statsResponse.data) {
          currentStats = {
            totalPledges: statsResponse.data.totalDonations || 0,
            totalValue: statsResponse.data.totalDonated || 0,
            activePledges: statsResponse.data.totalDonations || 0,
            completedPledges: statsResponse.data.totalDonations || 0
          };
        }
      } catch (statsError) {
        console.warn('Could not fetch donor stats:', statsError);
      }
      
      // Fetch monetary donations for the logged-in user
      let monetaryDonations: any[] = [];
      try {
        const monetaryResponse = await api.get('/payments/my-donations');
        console.log('Fetched monetary donations:', monetaryResponse.data);
        monetaryDonations = (monetaryResponse.data || []).map((donation: any) => ({
          requestId: donation.id || donation._id || '',
          title: `Monetary Donation to ${donation.ngoName || 'NGO'}`,
          category: 'Monetary',
          ngo: donation.ngoName || 'Unknown NGO',
          quantity: donation.amount || 0,
          message: donation.message || '',
          status: donation.status === 'completed' ? 'Delivered' : 'Pending',
          pledgedAt: donation.date || donation.createdAt || new Date().toISOString()
        }));
      } catch (monetaryError) {
        console.warn('Could not fetch monetary donations:', monetaryError);
      }

      // Fetch donations for the logged-in user
      let inKindPledges: any[] = [];
      try {
        const pledgeResponse = await api.get('/payments/my-donations');
        inKindPledges = (pledgeResponse.data || []).map((pledge: any) => ({
          requestId: pledge.requestId || '',
          title: pledge.title || 'Donation',
          category: pledge.category || 'Other',
          ngo: pledge.ngo || 'Unknown NGO',
          quantity: pledge.quantity || 0,
          message: pledge.message || '',
          status: pledge.status || 'Pending',
          pledgedAt: pledge.pledgedAt || new Date().toISOString()
        }));
      } catch (pledgeError) {
        console.warn('Could not fetch in-kind pledges:', pledgeError);
      }

      const allDonations = [...monetaryDonations, ...inKindPledges];
      setPledges(allDonations);
      
      // Calculate real-time stats for the logged-in user
      const totalPledges = allDonations.length;
      const totalMonetary = monetaryDonations
        .filter((d: any) => d.status === 'Delivered')
        .reduce((sum: number, d: any) => sum + (d.quantity || 0), 0);
      const totalInKind = inKindPledges
        .filter((p: any) => p.status === 'Delivered')
        .reduce((sum: number, p: any) => sum + ((p.quantity || 0) * 50), 0);
      const totalValue = totalMonetary + totalInKind;
      const activePledges = allDonations.filter((p: any) => p.status !== 'Delivered').length;
      const completedPledges = allDonations.filter((p: any) => p.status === 'Delivered').length;
      
      setStats({ totalPledges, totalValue, activePledges, completedPledges });
    } catch (error) {
      console.error('Error fetching donations:', error);
      // Show empty state for users with no donations
      setPledges([]);
      setStats({ totalPledges: 0, totalValue: 0, activePledges: 0, completedPledges: 0 });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food': return '🍽️';
      case 'Clothing': return '👕';
      case 'Medical': return '🏥';
      case 'Education': return '📚';
      case 'Technology': return '💻';
      case 'Monetary': return '💰';
      default: return '📦';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donations</h1>
        <p className="text-gray-600">Track your donation history and impact in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.totalPledges}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : `₹${safeToLocaleString(stats.totalValue)}`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.activePledges}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.completedPledges}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => navigate('/donations/requests')}
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
        >
          Find New Requests
        </button>
        <button
          onClick={() => navigate('/browse')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium"
        >
          Browse NGOs
        </button>
        <button
          onClick={fetchPledges}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
        >
          Refresh Data
        </button>
      </div>

      {/* Donation History */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Donation History</h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading your donations...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pledges.map((pledge, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{getCategoryIcon(pledge.category)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{pledge.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">To: {pledge.ngo}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Amount: ₹{safeToLocaleString(pledge.quantity)}</span>
                        <span>•</span>
                        <span>Category: {pledge.category}</span>
                        <span>•</span>
                        <span>Date: {pledge.pledgedAt ? new Date(pledge.pledgedAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      {pledge.message && (
                        <p className="text-sm text-gray-600 mt-2 italic">"{pledge.message}"</p>
                      )}
                      <div className="mt-3">
                        <DonationRequestReceipt
                          pledge={pledge}
                          donorName={user?.name || 'Anonymous'}
                          donorEmail={user?.email || 'N/A'}
                        />
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pledge.status)}`}>
                    {pledge.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && pledges.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
            <p className="text-gray-600 mb-6">Start making a difference by supporting NGOs and causes you care about</p>
            <button
              onClick={() => navigate('/donations/requests')}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
            >
              Make Your First Donation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;