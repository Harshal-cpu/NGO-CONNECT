import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  ngoName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface NGO {
  id: string;
  name: string;
  email: string;
  cause: string;
  verified: boolean;
  totalReceived: number;
}

interface Stats {
  totalUsers: number;
  totalNGOs: number;
  totalDonations: number;
  pendingVerifications: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalNGOs: 0,
    totalDonations: 0,
    pendingVerifications: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [donationsRes, ngosRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/donations'),
        axios.get('http://localhost:5000/api/admin/ngos'),
        axios.get('http://localhost:5000/api/admin/stats')
      ]);
      
      setDonations(donationsRes.data.donations);
      setNgos(ngosRes.data.ngos);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const verifyNGO = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/ngos/₹{id}/verify`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error verifying NGO:', error);
    }
  };

  const deleteNGO = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "₹{name}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/ngos/₹{id}`);
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error deleting NGO:', error);
        alert('Failed to delete NGO. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="mb-6">
          <nav className="flex space-x-8">
            {['overview', 'donations', 'ngos'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ₹{
                  activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'overview' ? 'Overview' : tab === 'donations' ? 'Donation History' : 'NGO Management'}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Total NGOs</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalNGOs}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Total Donations</h3>
                <p className="text-3xl font-bold text-purple-600">₹{(stats.totalDonations || 0).toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Pending Verifications</h3>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingVerifications}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Donations</h3>
                <div className="space-y-3">
                  {donations.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{donation.donorName}</p>
                        <p className="text-sm text-gray-500">₹{donation.amount} to {donation.ngoName}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ₹{
                        donation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">NGO Status</h3>
                <div className="space-y-3">
                  {ngos.slice(0, 3).map((ngo) => (
                    <div key={ngo.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{ngo.name}</p>
                        <p className="text-sm text-gray-500">{ngo.cause} - ₹{ngo.totalReceived}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ₹{
                        ngo.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ngo.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Donation History</h2>
              <p className="text-gray-600">Real donation data with actual donors and NGOs</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{donation.donorName}</div>
                          <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{donation.ngoName}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{(donation.amount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{donation.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ₹{
                          donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {donation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ngos' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">NGO Management</h2>
              <p className="text-gray-600">Real NGO data with actual donation totals</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGO Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cause</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Received</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ngos.map((ngo) => (
                    <tr key={ngo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{ngo.name}</div>
                          <div className="text-sm text-gray-500">{ngo.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{ngo.cause}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{(ngo.totalReceived || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ₹{
                          ngo.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ngo.verified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {!ngo.verified ? (
                            <button
                              onClick={() => verifyNGO(ngo.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                            >
                              Verify
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500">Verified</span>
                          )}
                          <button
                            onClick={() => deleteNGO(ngo.id, ngo.name)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
