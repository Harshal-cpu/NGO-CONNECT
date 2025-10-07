import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import NGORegistration from './components/NGORegistration';
import MyNGOProfile from './components/MyNGOProfile';
import BrowseNGOs from './components/BrowseNGOs';
import NGODetailView from './components/NGODetailView';
import DonationPage from './components/DonationPage';
import HomePage from './components/HomePage';
import DonationRequests from './components/DonationRequests';
import DonorDashboard from './components/DonorDashboard';
import NGODashboard from './components/NGODashboard';
import CreateDonationRequest from './components/CreateDonationRequest';
import Layout from './components/Layout';
import AboutUs from './components/AboutUs';

const MockLogin: React.FC = () => {
  const { login } = useAuth();
  
  const handleMockLogin = () => {
    login({ email: 'demo@test.com', password: 'password' });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Demo Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Click below to login with demo credentials
          </p>
        </div>
        <button
          onClick={handleMockLogin}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Login as Demo User
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ngo/register" 
              element={
                <ProtectedRoute>
                  <NGORegistration />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ngo/profile" 
              element={
                <ProtectedRoute>
                  <MyNGOProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ngo/create-request" 
              element={
                <ProtectedRoute>
                  <CreateDonationRequest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/browse" 
              element={
                <ProtectedRoute>
                  <BrowseNGOs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ngo/:id" 
              element={
                <ProtectedRoute>
                  <NGODetailView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/donate/:id" 
              element={
                <ProtectedRoute>
                  <DonationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/donations/requests" 
              element={
                <ProtectedRoute>
                  <DonationRequests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/donor/dashboard" 
              element={
                <ProtectedRoute>
                  <DonorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ngo/dashboard" 
              element={
                <ProtectedRoute>
                  <NGODashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
