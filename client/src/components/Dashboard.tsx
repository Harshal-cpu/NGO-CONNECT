import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminDashboard from './AdminDashboard';

interface DashboardStats {
  totalDonated: number;
  causesSupported: number;
  totalDonations: number;
  uniqueDonors: number;
  activeCampaigns: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalDonated: 0,
    causesSupported: 0,
    totalDonations: 0,
    uniqueDonors: 0,
    activeCampaigns: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]); // Remove fetchDashboardStats dependency

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard stats for user:', user?.role, user?.id);
      
      if (user?.role === 'Donor') {
        console.log('Making API call to /api/dashboard/donor-stats');
        const response = await api.get('/dashboard/donor-stats');
        console.log('Donor stats response:', response.data);
        setStats(response.data);
      } else if (user?.role === 'NGO') {
        console.log('Making API call to /api/dashboard/ngo-stats');
        const response = await api.get('/dashboard/ngo-stats');
        console.log('NGO stats response:', response.data);
        setStats({
          totalDonated: response.data.totalReceived || 0,
          causesSupported: 1,
          totalDonations: response.data.totalDonations || 0,
          uniqueDonors: response.data.uniqueDonors || 0,
          activeCampaigns: response.data.isVerified ? 1 : 0
        });
      } else {
        // Default stats for other roles
        setStats({
          totalDonated: 0,
          causesSupported: 0,
          totalDonations: 0,
          uniqueDonors: 0,
          activeCampaigns: 0
        });
      }
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      console.error('Error details:', error.response?.data);
      // Set fallback data
      if (user?.role === 'Donor') {
        setStats({
          totalDonated: 2500,
          causesSupported: 3,
          totalDonations: 5,
          uniqueDonors: 1,
          activeCampaigns: 2
        });
      } else if (user?.role === 'NGO') {
        setStats({
          totalDonated: 0,
          causesSupported: 1,
          totalDonations: 8500,
          uniqueDonors: 12,
          activeCampaigns: 1
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dashboard - Welcome back, {user?.name}!
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            {user?.role === 'NGO' && (
              <div className="space-y-6">
                <p className="text-gray-600">Manage your NGO campaigns and donations</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                    <h3 className="font-semibold text-blue-100">Active Campaigns</h3>
                    <p className="text-3xl font-bold">
                      {loading ? '...' : stats.activeCampaigns}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                    <h3 className="font-semibold text-green-100">Total Received</h3>
                    <p className="text-3xl font-bold">
                      {loading ? '...' : `₹${(stats.totalDonated || 0).toLocaleString()}`}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                    <h3 className="font-semibold text-purple-100">Total Donors</h3>
                    <p className="text-3xl font-bold">
                      {loading ? '...' : stats.uniqueDonors}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate('/ngo/dashboard')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 font-medium"
                  >
                    View Donations
                  </button>
                  <button 
                    onClick={() => navigate('/ngo/register')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium"
                  >
                    Register NGO
                  </button>
                  <button 
                    onClick={() => navigate('/ngo/profile')}
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            )}

            {user?.role === 'Donor' && (
              <div className="space-y-6">
                <p className="text-gray-600">Track your donations and find causes to support</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                    <h3 className="font-semibold text-green-100">Total Donated</h3>
                    <p className="text-3xl font-bold">
                      {loading ? '...' : `₹${(stats.totalDonated || 0).toLocaleString()}`}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                    <h3 className="font-semibold text-blue-100">Causes Supported</h3>
                    <p className="text-3xl font-bold">
                      {loading ? '...' : stats.causesSupported}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate('/donor/dashboard')}
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
                  >
                    My Donations
                  </button>
                  <button 
                    onClick={() => navigate('/donations/requests')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
                  >
                    Donation Requests
                  </button>
                  <button 
                    onClick={() => navigate('/browse')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium"
                  >
                    Browse NGOs
                  </button>
                </div>
              </div>
            )}

            {user?.role === 'Admin' && (
              <AdminDashboard />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
