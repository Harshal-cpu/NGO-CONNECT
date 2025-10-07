import React, { useState } from 'react';
import { ngoService } from '../services/ngoService';

const NGORegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    cause: 'Education',
    contact: {
      phone: '',
      email: '',
      address: ''
    },
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const causes = [
    'Education', 'Healthcare', 'Environment', 'Poverty', 
    'Animal Welfare', 'Disaster Relief', 'Human Rights', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await ngoService.registerNGO(formData);
      setSuccess('NGO registered successfully! Your NGO is now pending verification and available for donations.');
      setFormData({
        name: '',
        cause: 'Education',
        contact: { phone: '', email: '', address: '' },
        description: ''
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">NGO Registration</h2>
          <p className="text-gray-600 mb-8">Register your NGO to start receiving donations and support</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NGO Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your NGO name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Cause *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.cause}
                onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
              >
                {causes.map(cause => (
                  <option key={cause} value={cause}>{cause}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value }
                  })}
                  placeholder="+1-555-0123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value }
                  })}
                  placeholder="contact@ngo.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.contact.address}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, address: e.target.value }
                })}
                placeholder="Enter your NGO's address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description * (50-1000 characters)
              </label>
              <textarea
                required
                rows={5}
                minLength={50}
                maxLength={1000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your NGO's mission, activities, and impact..."
              />
              <p className="text-sm text-gray-500 mt-2">
                {formData.description.length}/1000 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register NGO'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NGORegistration;