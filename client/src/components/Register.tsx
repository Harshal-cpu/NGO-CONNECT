import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RegisterData } from '../types/auth';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    role: 'Donor',
    phone: '',
    organization: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.8), rgba(59, 130, 246, 0.8)), url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      {/* Background decorations */}
      <div className="absolute top-16 right-16 w-24 h-24 bg-white/10 rounded-full opacity-20 animate-bounce-gentle"></div>
      <div className="absolute bottom-16 left-16 w-20 h-20 bg-white/10 rounded-full opacity-20 animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-14 h-14 bg-white/10 rounded-full opacity-20 animate-bounce-gentle" style={{animationDelay: '0.5s'}}></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10 mx-4">
        {/* Header */}
        <div className="text-center animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-strong">
              <span className="text-white font-black text-2xl">NC</span>
            </div>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            Join Our Mission
          </h2>
          <p className="text-gray-600 text-lg">
            Create your account to start making a difference
          </p>
        </div>
        
        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <input
                type="tel"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              >
                <option value="Donor">Individual Donor</option>
                <option value="Admin">Admin</option>
                <option value="NGO">NGO Organization</option>
              </select>
              {formData.role === 'NGO' && (
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  placeholder="Organization Name"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              Create Account
            </button>
            
            <div className="text-center">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
              >
                Already have an account? <span className="text-green-600 font-semibold">Sign in</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;