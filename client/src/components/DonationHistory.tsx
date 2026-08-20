import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DonationReceipt from './DonationReceipt';
import axios from 'axios';

interface Donation {
  _id?: string;
  id?: string;
  ngoId: string | { _id: string; organizationName: string };
  donationRequestId?: { _id: string; title: string; category: string };
  ngoName?: string;
  amount: number;
  currency: string;
  message: string;
  anonymous: boolean;
  donorName?: string;
  donorEmail?: string;
  paymentMethod: string;
  date?: string;
  createdAt?: string;
  status: string;
  transactionId?: string;
  paymentIntentId?: string;
}

const DonationHistory: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, using localStorage fallback');
        loadFromLocalStorage();
        return;
      }

      const response = await axios.get('https://ngo-connect-backend-ct0p.onrender.com/api/payments/my-donations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Fetched donations from API:', response.data);
      setDonations(response.data.reverse()); // Show latest first
    } catch (error) {
      console.error('Error fetching donations:', error);
      // Fallback to localStorage if API fails
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    const storedDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    const userDonations = storedDonations.filter((donation: Donation) => 
      donation.donorEmail === user?.email || donation.anonymous
    );
    setDonations(userDonations.reverse());
  };

  const handleViewReceipt = (donationId: string) => {
    setSelectedDonation(donationId);
    setShowReceipt(true);
  };

  const getTotalDonated = () => {
    const total = donations.reduce((total, donation) => total + (donation.amount || 0), 0);
    return isNaN(total) ? 0 : total;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Donations</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹{getTotalDonated().toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-600">Total Donated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{donations.length}</div>
                <div className="text-sm text-gray-600">Donations Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(donations.map(d => d.ngoId)).size}
                </div>
                <div className="text-sm text-gray-600">NGOs Supported</div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading donations...</h3>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
            <p className="text-gray-600">Start making a difference by donating to NGOs</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => {
              const donationId = donation._id || donation.id || '';
              const ngoName = typeof donation.ngoId === 'object' ? donation.ngoId.organizationName : donation.ngoName || 'Unknown NGO';
              const donationDate = donation.createdAt || donation.date || new Date().toISOString();
              
              return (
                <div key={donationId} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{ngoName}</h3>
                      {donation.donationRequestId && (
                        <p className="text-sm text-blue-600 font-medium mb-1">
                          For: {donation.donationRequestId.title}
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {donation.donationRequestId.category}
                          </span>
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(donationDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="font-medium text-green-600">₹{donation.amount}</span>
                        <span className="capitalize text-gray-600">{donation.paymentMethod}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          donation.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {donation.status}
                        </span>
                      </div>
                      {donation.message && (
                        <p className="text-sm text-gray-600 mt-2 italic">"{donation.message}"</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleViewReceipt(donationId)}
                      className="ml-4 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Receipt
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showReceipt && (
          <DonationReceipt
            donationId={selectedDonation}
            onClose={() => setShowReceipt(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DonationHistory;
