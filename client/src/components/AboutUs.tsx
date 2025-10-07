import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About NGO Connect</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Bridging the gap between generous hearts and meaningful causes since 2025
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                We believe that every act of kindness, no matter how small, can create ripples of positive change. 
                NGO Connect was founded to make charitable giving more accessible, transparent, and impactful.
              </p>
              <p className="text-lg text-gray-700">
                Our platform connects verified NGOs with passionate donors, creating a trusted ecosystem where 
                generosity meets genuine need, and where every donation makes a measurable difference.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Verified NGOs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">$50M+</div>
                  <div className="text-gray-600">Donated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">1M+</div>
                  <div className="text-gray-600">Lives Impacted</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">150+</div>
                  <div className="text-gray-600">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-600">
                Every donation is tracked, every NGO is verified, and every impact is measured and reported.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-green-50 border border-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Impact</h3>
              <p className="text-gray-600">
                We focus on creating measurable, lasting change in communities around the world.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust</h3>
              <p className="text-gray-600">
                Security and trust are at the core of our platform, protecting both donors and recipients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600">Passionate individuals working to make a difference</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">AK</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Abhishek Kanade</h3>
              <p className="text-blue-600 mb-3">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Former nonprofit director with 15+ years of experience in charitable organizations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">HP</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Harshal Pawar</h3>
              <p className="text-green-600 mb-3">CTO</p>
              <p className="text-gray-600 text-sm">
                Technology leader passionate about using tech for social good and community impact.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">OG</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">OM & GAURAV</h3>
              <p className="text-purple-600 mb-3">Head of Partnerships</p>
              <p className="text-gray-600 text-sm">
                Building relationships with NGOs worldwide to expand our impact and reach.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8">
            Join thousands of donors and NGOs creating positive change worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Donating
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Register Your NGO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;