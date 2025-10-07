import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Real background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80" 
            alt="People helping community" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/25 via-purple-900/15 to-indigo-900/25"></div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full opacity-30 animate-bounce-gentle backdrop-blur-sm"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full opacity-30 animate-pulse-slow backdrop-blur-sm"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full opacity-30 animate-bounce-gentle backdrop-blur-sm" style={{animationDelay: '1s'}}></div>
        
        <div className="relative section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium mb-8 border border-white/30">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Trusted by 500+ NGOs worldwide
              </div>
              
              <h1 className="text-responsive-xl font-black text-white mb-8 leading-tight">
                Connect Hearts with 
                <span className="text-yellow-300 block mt-2">Meaningful Causes</span>
              </h1>
              
              <p className="text-responsive-md text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
                Empowering change through transparent donations. Join thousands of donors 
                supporting verified NGOs making real impact in communities worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={() => navigate('/register')}
                  className="btn btn-primary text-lg px-12 py-4 shadow-strong group"
                >
                  <span className="flex items-center">
                    Start Your Impact Journey
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className="btn bg-white/20 backdrop-blur-md text-lg px-12 py-4 text-white border-2 border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </button>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-80">
                <div className="flex items-center text-sm text-blue-100">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% Verified NGOs
                </div>
                <div className="flex items-center text-sm text-blue-100">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure Donations
                </div>
                <div className="flex items-center text-sm text-blue-100">
                  <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Real-time Impact Tracking
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="section-padding bg-white relative">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full text-blue-700 text-sm font-medium mb-6 border border-blue-100">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></span>
              Real Impact Stories
            </div>
            <h2 className="text-responsive-lg font-bold text-gray-900 mb-6">
              Transforming Lives Through 
              <span className="text-gradient-cool block">Collective Action</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every donation creates ripples of change. See how your contributions make lasting impact in communities worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Education Card */}
            <div className="group card card-gradient hover:shadow-strong animate-slide-in-right">
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Education"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-white text-xl">📚</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                    <div className="text-sm font-semibold text-gray-800">Active Campaign</div>
                    <div className="text-xs text-gray-600">Education for Rural Children</div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                  Education for All
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Providing quality education and learning resources to 10,000+ children in underserved rural communities across 15 countries.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-black text-blue-600">$2.5M+</div>
                  <div className="text-sm text-gray-500">raised this year</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>78% of goal reached</span>
                  <span>10,247 children helped</span>
                </div>
              </div>
            </div>

            {/* Healthcare Card */}
            <div className="group card card-gradient hover:shadow-strong animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Healthcare"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-white text-xl">🏥</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                    <div className="text-sm font-semibold text-gray-800">Urgent Need</div>
                    <div className="text-xs text-gray-600">Mobile Health Clinics</div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-green-600 transition-colors">
                  Healthcare Heroes
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Mobile clinics and telemedicine services bringing essential medical care to remote areas where healthcare is scarce.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-black text-green-600">$1.8M+</div>
                  <div className="text-sm text-gray-500">raised this year</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>65% of goal reached</span>
                  <span>25,000 patients treated</span>
                </div>
              </div>
            </div>

            {/* Environment Card */}
            <div className="group card card-gradient hover:shadow-strong animate-slide-in-right" style={{animationDelay: '0.4s'}}>
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Environment"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-white text-xl">🌱</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                    <div className="text-sm font-semibold text-gray-800">Climate Action</div>
                    <div className="text-xs text-gray-600">Reforestation Project</div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-emerald-600 transition-colors">
                  Green Earth Initiative
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Large-scale reforestation and conservation projects planting 1M+ trees and protecting biodiversity across 5 continents.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-black text-emerald-600">$3.2M+</div>
                  <div className="text-sm text-gray-500">raised this year</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>92% of goal reached</span>
                  <span>1.2M trees planted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="section-padding bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="max-w-7xl mx-auto container-padding relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium mb-6 border border-white/20">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              Global Impact Dashboard
            </div>
            <h2 className="text-responsive-lg font-bold text-white mb-6">
              Making a Difference 
              <span className="text-gradient-warm block">Worldwide</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Real numbers, real impact. See how our community is changing lives across the globe.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-8 glass rounded-2xl hover:bg-white/30 transition-all duration-300 group">
              <div className="text-5xl font-black text-white mb-4 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-blue-200 font-semibold mb-2">Verified NGOs</div>
              <div className="text-3xl mb-2">🏢</div>
              <div className="text-sm text-blue-300">Across 50+ countries</div>
            </div>
            
            <div className="text-center p-8 glass rounded-2xl hover:bg-white/30 transition-all duration-300 group">
              <div className="text-5xl font-black text-white mb-4 group-hover:scale-110 transition-transform">$50M+</div>
              <div className="text-blue-200 font-semibold mb-2">Total Donated</div>
              <div className="text-3xl mb-2">💰</div>
              <div className="text-sm text-blue-300">This year alone</div>
            </div>
            
            <div className="text-center p-8 glass rounded-2xl hover:bg-white/30 transition-all duration-300 group">
              <div className="text-5xl font-black text-white mb-4 group-hover:scale-110 transition-transform">1M+</div>
              <div className="text-blue-200 font-semibold mb-2">Lives Impacted</div>
              <div className="text-3xl mb-2">❤️</div>
              <div className="text-sm text-blue-300">And counting</div>
            </div>
            
            <div className="text-center p-8 glass rounded-2xl hover:bg-white/30 transition-all duration-300 group">
              <div className="text-5xl font-black text-white mb-4 group-hover:scale-110 transition-transform">150+</div>
              <div className="text-blue-200 font-semibold mb-2">Countries</div>
              <div className="text-3xl mb-2">🌍</div>
              <div className="text-sm text-blue-300">Global reach</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section-padding bg-gradient-to-br from-gray-50 to-blue-50 relative">
        <div className="max-w-5xl mx-auto text-center container-padding">
          <div className="animate-fade-in-up">
            <h2 className="text-responsive-lg font-black text-gray-900 mb-8 leading-tight">
              Ready to Make a 
              <span className="text-gradient block mt-2">Lasting Impact?</span>
            </h2>
            <p className="text-responsive-md text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of changemakers supporting verified NGOs worldwide. 
              Your contribution, no matter the size, creates ripples of positive change.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <button
                onClick={() => navigate('/register')}
                className="btn btn-primary text-xl px-16 py-5 shadow-strong group"
              >
                <span className="flex items-center">
                  Start Your Journey
                  <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button
                onClick={() => navigate('/about')}
                className="btn btn-secondary text-xl px-16 py-5"
              >
                Learn More
              </button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.707-4.293c1.39-1.39 2.63-2.63 2.63-2.63s1.24 1.24 2.63 2.63L21 21H3l5.707-5.707z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">100% Transparent</h3>
                <p className="text-gray-600">Track exactly how your donations are used with real-time updates</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Safe</h3>
                <p className="text-gray-600">Bank-level security ensures your donations reach the right hands</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Impact</h3>
                <p className="text-gray-600">See immediate results and stories from the communities you help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
