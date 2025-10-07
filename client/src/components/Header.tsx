import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 backdrop-blur-md shadow-xl border-b border-white/20 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative float-animation">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 border border-white/30">
                <span className="text-white font-black text-lg">NC</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
            </div>
            <div>
              <span className="text-2xl font-black text-white group-hover:text-yellow-300 transition-colors duration-300">
                NGO Connect
              </span>
              <div className="text-xs text-blue-100 font-medium">Empowering Change</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link to="/" className="nav-link text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg">
              Home
            </Link>
            <Link to="/about" className="nav-link text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg">
              About
            </Link>
            <Link to="/browse" className="nav-link text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg">
              NGOs
            </Link>
            <Link to="/donations/requests" className="nav-link text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg">
              Donate
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/30">
                <Link 
                  to="/dashboard" 
                  className="nav-link text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg"
                >
                  Dashboard
                </Link>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                      <span className="text-white font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Hi, {user.name}</div>
                      <div className="text-xs text-blue-100 capitalize">{user.role}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger text-sm px-4 py-2 hover:shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/30">
                <Link
                  to="/login"
                  className="nav-link text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 text-sm px-6 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-xl text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100 pb-6' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="pt-4 border-t border-white/20">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="nav-link text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg block"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="nav-link text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg block"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/browse" 
                className="nav-link text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg block"
                onClick={() => setIsMenuOpen(false)}
              >
                NGOs
              </Link>
              <Link 
                to="/donations/requests" 
                className="nav-link text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg block"
                onClick={() => setIsMenuOpen(false)}
              >
                Donate
              </Link>
              
              {user ? (
                <>
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">Hi, {user.name}</div>
                        <div className="text-sm text-blue-100 capitalize">{user.role}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to="/dashboard" 
                    className="nav-link text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="btn btn-danger text-sm w-full mt-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="border-t border-white/20 pt-4 mt-4 space-y-3">
                  <Link 
                    to="/login" 
                    className="nav-link text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 text-sm w-full shadow-lg hover:shadow-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;