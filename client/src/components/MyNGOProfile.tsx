import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import axios from 'axios';

interface NGOProfile {
  _id: string;
  id?: number;
  organizationName: string;
  name?: string;
  description: string;
  cause: string[];
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  website?: string;
  isVerified: boolean;
  foundedYear?: number;
  teamSize?: number;
}

const MyNGOProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ngo, setNgo] = useState<NGOProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<NGOProfile>>({});

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      const response = await api.get('/ngo/my-profile');
      setNgo(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback data for demo
      setNgo({
        _id: 'demo-id',
        id: 1,
        organizationName: 'My NGO Organization',
        name: 'My NGO Organization',
        description: 'This is my NGO working for social causes.',
        cause: ['Education', 'Health'],
        contact: {
          address: 'Mumbai, India',
          phone: '+91-9876543210',
          email: user?.email || 'ngo@example.com'
        },
        website: 'https://myngo.org',
        isVerified: false,
        foundedYear: 2020,
        teamSize: 10
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditForm({
      organizationName: ngo?.organizationName || ngo?.name || '',
      name: ngo?.name || ngo?.organizationName || '',
      description: ngo?.description || '',
      cause: ngo?.cause || [],
      contact: {
        phone: ngo?.contact?.phone || '',
        email: ngo?.contact?.email || '',
        address: ngo?.contact?.address || ''
      },
      website: ngo?.website || '',
      foundedYear: ngo?.foundedYear || undefined,
      teamSize: ngo?.teamSize || undefined
    });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!ngo || !editForm) return;
    
    setSaving(true);
    try {
      const updateData = {
        name: editForm.organizationName || editForm.name || ngo.organizationName || ngo.name || '',
        cause: editForm.cause?.[0] || ngo.cause?.[0] || 'General',
        contact: {
          phone: editForm.contact?.phone || ngo?.contact?.phone || '',
          email: editForm.contact?.email || ngo?.contact?.email || '',
          address: editForm.contact?.address || ngo?.contact?.address || ''
        },
        description: editForm.description || ngo.description,
        website: editForm.website,
        foundedYear: editForm.foundedYear,
        teamSize: editForm.teamSize
      };

      console.log('Sending update data:', updateData);
      
      const response = await axios.put(`https://ngo-connect-backend-ct0p.onrender.com/api/ngo/${ngo.id || ngo._id}/edit`, updateData);
      
      console.log('Response:', response.data);
      
      if (response.data.success) {
        setNgo({
          ...ngo,
          name: updateData.name,
          organizationName: updateData.name,
          cause: [updateData.cause],
          contact: updateData.contact,
          description: updateData.description,
          website: updateData.website || '',
          foundedYear: updateData.foundedYear,
          teamSize: updateData.teamSize
        });
        setEditing(false);
        setEditForm({});
        alert('Profile updated successfully!');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Failed to update profile: ${error.response.data.message || 'Unknown error'}`);
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({});
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
        <p className="text-gray-600 mb-6">You need to register your NGO first.</p>
        <button
          onClick={() => navigate('/ngo/register')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium"
        >
          Register NGO
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/ngo/dashboard')}
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          ← Back to Dashboard
        </button>
        <button
          onClick={editing ? handleCancel : handleEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
        {editing && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {editing ? (
                <input
                  type="text"
                  value={editForm.organizationName || editForm.name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, organizationName: e.target.value, name: e.target.value }))}
                  className="text-3xl font-bold mb-2 bg-transparent border-b-2 border-white text-white placeholder-gray-200 w-full"
                  placeholder="Organization Name"
                />
              ) : (
                <h1 className="text-3xl font-bold mb-2">{ngo.organizationName || ngo.name}</h1>
              )}
              {editing ? (
                <input
                  type="text"
                  value={editForm.contact?.address || ''}
                  onChange={(e) => setEditForm(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact!, address: e.target.value }
                  }))}
                  className="text-indigo-100 bg-transparent border-b border-white placeholder-gray-200 w-full"
                  placeholder="📍 Address"
                />
              ) : (
                <p className="text-indigo-100">📍 {ngo?.contact?.address || 'No address provided'}</p>
              )}
              <p className="text-indigo-100">👤 {user?.name}</p>
            </div>
            {ngo.isVerified ? (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                ✓ Verified
              </span>
            ) : (
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                ⏳ Pending Verification
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Focus Areas */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Focus Areas</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(ngo?.cause) ? ngo.cause : [ngo?.cause]).filter(Boolean).map((cause, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {cause}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About Our Organization</h3>
            {editing ? (
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-700 leading-relaxed"
                rows={4}
                placeholder="Describe your organization..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{ngo.description}</p>
            )}
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
              <div className="text-2xl font-bold text-indigo-600">Active</div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                {editing ? (
                  <input
                    type="email"
                    value={editForm.contact?.email || ''}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact!, email: e.target.value }
                    }))}
                    className="font-medium border border-gray-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <p className="font-medium">{ngo?.contact?.email || 'No email provided'}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                {editing ? (
                  <input
                    type="tel"
                    value={editForm.contact?.phone || ''}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact!, phone: e.target.value }
                    }))}
                    className="font-medium border border-gray-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <p className="font-medium">{ngo?.contact?.phone || 'No phone provided'}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Website</p>
                {editing ? (
                  <input
                    type="url"
                    value={editForm.website || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                    className="font-medium border border-gray-300 rounded px-2 py-1 w-full"
                    placeholder="https://..."
                  />
                ) : (
                  ngo.website ? (
                    <a
                      href={ngo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {ngo.website}
                    </a>
                  ) : (
                    <p className="font-medium text-gray-500">Not provided</p>
                  )
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Founded Year</p>
                {editing ? (
                  <input
                    type="number"
                    value={editForm.foundedYear || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, foundedYear: parseInt(e.target.value) }))}
                    className="font-medium border border-gray-300 rounded px-2 py-1 w-full"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                ) : (
                  <p className="font-medium">{ngo.foundedYear || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate('/ngo/create-request')}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
            >
              Create Donation Request
            </button>
            <button
              onClick={() => navigate('/ngo/dashboard')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNGOProfile;
