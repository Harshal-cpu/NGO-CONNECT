import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimpleDonationForm from './SimpleDonationForm';

interface NGOProfile {
  _id: string;
  organizationName: string;
  description: string;
  causes: string[];
  location: string;
  website?: string;
  phone?: string;
  isVerified: boolean;
  foundedYear?: number;
  teamSize?: number;
  userId: {
    name: string;
    email: string;
    phone?: string;
  };
}

const NGOProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ngo, setNgo] = useState<NGOProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDonationForm, setShowDonationForm] = useState(false);

  useEffect(() => {
    fetchNGOProfile();
  }, [id]);

  const fetchNGOProfile = async () => {
    try {
      // Mock data since backend might not be connected
      const mockNGO: NGOProfile = {
        _id: id || '1',
        organizationName: 'Education for All',
        description: 'Education for All is dedicated to providing quality education to underprivileged children across urban and rural areas. We believe every child deserves access to learning opportunities that can transform their future. Our programs include after-school tutoring, scholarship programs, and building educational infrastructure in underserved communities.',
        causes: ['Education', 'Poverty'],
        location: 'New York, NY',
        website: 'https://educationforall.org',
        phone: '+1-555-0123',
        isVerified: true,
        foundedYear: 2015,
        teamSize: 25,
        userId: {
          name: 'John Doe',
          email: 'john@educationforall.org',
          phone: '+1-555-0123'
        }
      };

      setNgo(mockNGO);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching NGO profile:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading NGO profile...</div>;
  }

  if (!ngo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">NGO Not Found</h2>
        <button
          onClick={() => navigate('/browse')}
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/browse')}
        className="text-indigo-600 hover:text-indigo-800 mb-6 flex items-center"
      >
        ← Back to Browse
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{ngo.organizationName}</h1>
              <p className="text-indigo-100">📍 {ngo.location}</p>
            </div>
            {ngo.isVerified && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Causes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Focus Areas</h3>
            <div className="flex flex-wrap gap-2">
              {ngo.causes.map(cause => (
                <span key={cause} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {cause}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About Us</h3>
            <p className="text-gray-700 leading-relaxed">{ngo.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {ngo.foundedYear && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{ngo.foundedYear}</div>
                <div className="text-sm text-gray-600">Founded</div>
              </div>
            )}
            {ngo.teamSize && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{ngo.teamSize}+</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
            )}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">100+</div>
              <div className="text-sm text-gray-600">Lives Impacted</div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Contact Person</p>
                <p className="font-medium">{ngo.userId.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{ngo.userId.email}</p>
              </div>
              {ngo.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{ngo.phone}</p>
                </div>
              )}
              {ngo.website && (
                <div>
                  <p className="text-sm text-gray-600">Website</p>
                  <a
                    href={ngo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    {ngo.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => setShowDonationForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
            >
              Donate Now
            </button>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium">
              Contact NGO
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 font-medium">
              Share
            </button>
          </div>
        </div>
      </div>
      
      {/* Donation Form Modal */}
      {showDonationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SimpleDonationForm
            ngoId={ngo._id}
            ngoName={ngo.organizationName}
            onSuccess={() => {
              setShowDonationForm(false);
              alert('Thank you for your donation!');
            }}
            onCancel={() => setShowDonationForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default NGOProfileView;