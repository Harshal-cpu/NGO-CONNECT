import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ngoAPI } from '../services/api';

interface NGO {
  _id: string;
  name: string;
  description: string;
  cause: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  isVerified?: boolean;
  createdAt?: string;
  userId?: {
    name: string;
    email: string;
  };
}

const NGODetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNGODetails();
  }, [id]);

  const fetchNGODetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      // Try API first
      try {
        const response = await ngoAPI.getById(id);
        setNgo(response.data);
      } catch (apiError) {
        console.log('API not available, using fallback data');
        
        // Fallback to mock data and localStorage
        const mockNGOs: NGO[] = [
          {
            _id: '1',
            name: 'Education for All',
            description: 'Providing quality education to underprivileged children across rural communities. We believe every child deserves access to quality education regardless of their economic background. Our programs include building schools, training teachers, providing educational materials, and offering scholarships to deserving students.',
            cause: 'Education',
            contact: {
              phone: '+1-555-0123',
              email: 'contact@educationforall.org',
              address: 'New York, NY'
            },
            isVerified: true,
            createdAt: '2024-01-15'
          },
          {
            _id: '2',
            name: 'Green Earth Initiative',
            description: 'Environmental conservation and sustainability projects to protect our planet. We focus on reforestation, clean water initiatives, renewable energy projects, and environmental education. Our mission is to create a sustainable future for generations to come through community-driven environmental solutions.',
            cause: 'Environment',
            contact: {
              phone: '+1-555-0124',
              email: 'info@greenearth.org',
              address: 'San Francisco, CA'
            },
            isVerified: false,
            createdAt: '2024-02-20'
          },
          {
            _id: '3',
            name: 'Health Care Heroes',
            description: 'Providing medical care and health services to underserved rural communities. We operate mobile clinics, provide free medical checkups, distribute medicines, and conduct health awareness programs. Our team of dedicated doctors and nurses work tirelessly to ensure healthcare reaches every corner of rural areas.',
            cause: 'Healthcare',
            contact: {
              phone: '+1-555-0125',
              email: 'help@healthheroes.org',
              address: 'Austin, TX'
            },
            isVerified: true,
            createdAt: '2024-03-10'
          }
        ];

        // Check localStorage for additional NGOs
        const storedNGOs = JSON.parse(localStorage.getItem('registeredNGOs') || '[]');
        const allNGOs = [...mockNGOs, ...storedNGOs];
        
        const foundNGO = allNGOs.find(ngo => ngo._id === id);
        if (foundNGO) {
          setNgo(foundNGO);
        } else {
          setError('NGO not found');
        }
      }
    } catch (error) {
      console.error('Error fetching NGO details:', error);
      setError('Failed to load NGO details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !ngo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">NGO Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested NGO could not be found.'}</p>
          <button
            onClick={() => navigate('/browse')}
            className="btn btn-primary"
          >
            Back to Browse NGOs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/browse')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Browse NGOs
        </button>

        {/* NGO Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{ngo.name}</h1>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {ngo.cause}
                  </span>
                  {ngo.isVerified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate(`/donate/${ngo._id}`)}
                className="btn btn-primary"
              >
                Donate Now
              </button>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Organization</h2>
              <p className="text-gray-700 leading-relaxed">{ngo.description}</p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{ngo.contact.email}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{ngo.contact.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{ngo.contact.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Focus Area:</span>
                    <p className="text-gray-700">{ngo.cause}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <p className="text-gray-700">
                      {ngo.isVerified ? 'Verified Organization' : 'Pending Verification'}
                    </p>
                  </div>
                  {ngo.createdAt && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Member Since:</span>
                      <p className="text-gray-700">
                        {new Date(ngo.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => navigate(`/donate/${ngo._id}`)}
                className="btn btn-primary flex-1 md:flex-none"
              >
                Make a Donation
              </button>
              <button
                onClick={() => window.open(`mailto:${ngo.contact.email}`, '_blank')}
                className="btn btn-outline flex-1 md:flex-none"
              >
                Contact NGO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODetailView;
