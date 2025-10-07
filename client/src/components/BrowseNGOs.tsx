import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ngoService, NGO } from '../services/ngoService';

const BrowseNGOs: React.FC = () => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [filters, setFilters] = useState({
    cause: '',
    verified: false
  });
  const [loading, setLoading] = useState(true);
  const [editingNGO, setEditingNGO] = useState<NGO | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    cause: '',
    contact: { phone: '', email: '', address: '' },
    description: ''
  });
  const navigate = useNavigate();

  const causes = ['Education', 'Healthcare', 'Environment', 'Poverty', 'Animal Welfare', 'Disaster Relief', 'Human Rights', 'Other'];

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      setLoading(true);
      const allNGOs = await ngoService.getAllNGOs();
      console.log('Fetched NGOs in BrowseNGOs:', allNGOs);
      console.log('First NGO structure:', allNGOs[0]);
      setNgos(allNGOs);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      setNgos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ngo: NGO) => {
    setEditingNGO(ngo);
    setEditForm({
      name: ngo.name,
      cause: ngo.cause,
      contact: ngo.contact || { phone: '', email: '', address: '' },
      description: ngo.description
    });
  };

  const handleSaveEdit = async () => {
    if (!editingNGO) return;
    
    try {
      // Update in localStorage for now
      const allNGOs = await ngoService.getAllNGOs();
      const updatedNGOs = allNGOs.map(ngo => 
        ngo._id === editingNGO._id ? { ...ngo, ...editForm } : ngo
      );
      
      // Save updated NGOs back to localStorage
      const storedNGOs = JSON.parse(localStorage.getItem('registeredNGOs') || '[]');
      const updatedStoredNGOs = storedNGOs.map((ngo: any) => 
        ngo._id === editingNGO._id ? { ...ngo, ...editForm } : ngo
      );
      localStorage.setItem('registeredNGOs', JSON.stringify(updatedStoredNGOs));
      
      setEditingNGO(null);
      fetchNGOs(); // Refresh the list
    } catch (error) {
      console.error('Error updating NGO:', error);
    }
  };

  const filteredNGOs = ngos.filter(ngo => {
    if (filters.cause && ngo.cause !== filters.cause) return false;
    if (filters.verified && !ngo.isVerified) return false;
    return true;
  });

  const handleDonate = (ngoId: string) => {
    navigate(`/donate/${ngoId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading NGOs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse NGOs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover and support amazing organizations making a difference in the world
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Filter NGOs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cause</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.cause}
                onChange={(e) => setFilters({ ...filters, cause: e.target.value })}
              >
                <option value="">All Causes</option>
                {causes.map(cause => (
                  <option key={cause} value={cause}>{cause}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="verified"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={filters.verified}
                  onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="verified" className="font-medium text-gray-700">
                  Show only verified NGOs
                </label>
                <p className="text-gray-500">Verified by admin for authenticity</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredNGOs.length}</span> of <span className="font-semibold">{ngos.length}</span> NGOs
                </p>
                {filters.verified && (
                  <p className="text-xs text-green-600 mt-1">✓ Verified NGOs only</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {filteredNGOs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No NGOs Found</h3>
            <p className="text-gray-600">
              {ngos.length === 0 
                ? "No NGOs have been registered yet. Be the first to register your NGO!"
                : "No NGOs match your current filters. Try adjusting your search criteria."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNGOs.map((ngo) => (
              <div key={ngo._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{ngo.name}</h3>
                    <div className="flex flex-col items-end gap-1">
                      {ngo.isVerified ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          ✓ Verified by Admin
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                          ⏳ Pending Verification
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      {ngo.cause}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {ngo.description}
                  </p>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>📧 {ngo.contact?.email || 'No email provided'}</p>
                    <p>📞 {ngo.contact?.phone || 'No phone provided'}</p>
                    <p>📍 {ngo.contact?.address || 'No address provided'}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Total Donations Received:</span>
                      <span className="text-lg font-bold text-green-600">
                        ₹{(ngo.totalReceived || 0).toLocaleString()}
                      </span>
                    </div>
                    {ngo.totalReceived === 0 && (
                      <p className="text-xs text-gray-500 mt-1">No donations received yet</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDonate(ngo._id)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Donate
                    </button>
                    <button
                      onClick={() => handleEdit(ngo)}
                      className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingNGO && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit NGO Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cause</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.cause}
                    onChange={(e) => setEditForm({ ...editForm, cause: e.target.value })}
                  >
                    {causes.map(cause => (
                      <option key={cause} value={cause}>{cause}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.contact.email}
                    onChange={(e) => setEditForm({ 
                      ...editForm, 
                      contact: { ...editForm.contact, email: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.contact.phone}
                    onChange={(e) => setEditForm({ 
                      ...editForm, 
                      contact: { ...editForm.contact, phone: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    value={editForm.contact.address}
                    onChange={(e) => setEditForm({ 
                      ...editForm, 
                      contact: { ...editForm.contact, address: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingNGO(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseNGOs;
