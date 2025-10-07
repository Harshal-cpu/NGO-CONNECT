import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CreateDonationRequest: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    urgency: 'Medium',
    location: '',
    deadline: '',
    duration: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Food', 'Clothing', 'Medical', 'Education', 'Technology',
    'Legal Services', 'Marketing', 'Finance', 'Construction', 'Transportation', 'Other'
  ];
  const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/donations/requests', {
        ...formData,
        quantity: parseInt(formData.quantity) || 1
      });
      alert('Request created successfully!');
      navigate('/ngo/dashboard');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const isProfessional = ['Legal Services', 'Marketing', 'Finance', 'Construction', 'Transportation'].includes(formData.category);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Request</h1>
        <p className="text-gray-600">Request materials or professional services for your NGO</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder={isProfessional ? 'e.g., Legal consultation for NGO registration' : 'e.g., Winter clothing for children'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder={isProfessional ? 'Describe the service needed and requirements' : 'Describe what you need and why'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select Category</option>
                <optgroup label="Material Donations">
                  <option value="Food">Food</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Medical">Medical</option>
                  <option value="Education">Education</option>
                  <option value="Technology">Technology</option>
                </optgroup>
                <optgroup label="Professional Services">
                  <option value="Legal Services">Legal Services</option>
                  <option value="Marketing">Marketing & PR</option>
                  <option value="Finance">Finance & Accounting</option>
                  <option value="Construction">Construction & Repair</option>
                  <option value="Transportation">Transportation</option>
                </optgroup>
                <option value="Other">Other</option>
              </select>
            </div>

            {!isProfessional && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Number of items needed"
                />
              </div>
            )}

            {isProfessional && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., 2 hours, 1 day, ongoing"
                />
              </div>
            )}
          </div>

          {isProfessional && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Professional Service Details</h3>
              <div className="text-sm text-blue-700">
                {formData.category === 'Legal Services' && 'Legal consultation, document preparation, compliance advice'}
                {formData.category === 'Marketing' && 'Social media management, content creation, branding, PR'}
                {formData.category === 'Finance' && 'Accounting, tax preparation, financial planning, auditing'}
                {formData.category === 'Construction' && 'Building repair, electrical work, plumbing, renovation'}
                {formData.category === 'Transportation' && 'Vehicle services, logistics, delivery, driver services'}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {urgencyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="City, State"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/ngo/dashboard')}
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
