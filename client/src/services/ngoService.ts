import axios from 'axios';

export interface NGO {
  _id: string;
  name: string;
  description: string;
  cause: string;
  contact?: {
    phone: string;
    email: string;
    address: string;
  };
  isVerified?: boolean;
  totalReceived?: number;
  donationCount?: number;
}

// Sample NGOs for fallback
const sampleNGOs: NGO[] = [
  {
    _id: '1',
    name: 'Save Children India',
    description: 'Helping children across India with education and healthcare. We provide school supplies, medical care, and nutritious meals to children in need.',
    cause: 'Child Welfare',
    contact: { email: 'contact@savechildren.in', phone: '+91-9876543210', address: 'Mumbai, Maharashtra' },
    isVerified: true,
    totalReceived: 1250
  },
  {
    _id: '2', 
    name: 'Clean Water Initiative',
    description: 'Providing clean water access to rural communities across India. We build wells, install water purification systems, and educate communities about water safety.',
    cause: 'Water & Sanitation',
    contact: { email: 'info@cleanwater.in', phone: '+91-9876543211', address: 'Bangalore, Karnataka' },
    isVerified: false,
    totalReceived: 550
  },
  {
    _id: '3',
    name: 'Education First India',
    description: 'Promoting education in underserved areas across India. We build schools, train teachers, and provide scholarships to deserving students.',
    cause: 'Education',
    contact: { email: 'hello@educationfirst.in', phone: '+91-9876543212', address: 'Delhi, India' },
    isVerified: true,
    totalReceived: 2200
  }
];

export const ngoService = {
  // Get all NGOs (from API with fallback to samples)
  async getAllNGOs(): Promise<NGO[]> {
    console.log('Getting all NGOs...');
    
    try {
      // Try to fetch from backend API first
      const response = await axios.get('https://ngo-connect-backend-ct0p.onrender.com/api/browse/ngos');
      console.log('API Response:', response.data);
      
      // Backend returns direct array
      if (response.data && Array.isArray(response.data)) {
        console.log('Fetched NGOs from API:', response.data);
        const apiNGOs = response.data.map((ngo: any) => ({
          _id: ngo._id.toString(),
          name: ngo.name || 'Unnamed NGO',
          description: ngo.description || 'No description provided',
          cause: ngo.cause || 'Other',
          contact: {
            email: ngo.contact?.email || '',
            phone: ngo.contact?.phone || '',
            address: ngo.contact?.address || ''
          },
          isVerified: ngo.isVerified || false,
          totalReceived: ngo.totalReceived || 0,
          donationCount: ngo.donationCount || 0
        }));
        console.log('Formatted API NGOs:', apiNGOs);
        return apiNGOs;
      }
    } catch (error) {
      console.log('API not available, using fallback data:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Fallback to localStorage + samples
    const storedNGOs = JSON.parse(localStorage.getItem('registeredNGOs') || '[]');
    console.log('Stored NGOs from localStorage:', storedNGOs);
    
    // Convert stored NGOs to proper format with complete data
    const formattedStoredNGOs = storedNGOs.map((ngo: any, index: number) => ({
      _id: ngo._id || ngo.id || `stored_${Date.now()}_${index}`,
      name: ngo.name || ngo.organizationName || 'Unnamed NGO',
      description: ngo.description || 'No description provided',
      cause: ngo.cause || 'Other',
      contact: {
        email: ngo.contact?.email || ngo.email || '',
        phone: ngo.contact?.phone || ngo.phone || '',
        address: ngo.contact?.address || ngo.address || ''
      },
      isVerified: ngo.isVerified || false,
      totalReceived: ngo.totalReceived || 0
    }));

    console.log('Formatted stored NGOs:', formattedStoredNGOs);

    const allNGOs = [...sampleNGOs, ...formattedStoredNGOs];
    console.log('All NGOs combined:', allNGOs);
    return allNGOs;
  },

  // Get single NGO by ID
  async getNGOById(id: string): Promise<NGO | null> {
    console.log('Getting NGO by ID:', id);
    const allNGOs = await this.getAllNGOs();
    const foundNGO = allNGOs.find(ngo => ngo._id.toString() === id.toString());
    console.log('Found NGO:', foundNGO);
    return foundNGO || null;
  },

  // Register new NGO (save to localStorage)
  async registerNGO(ngoData: any): Promise<NGO> {
    const newNGO: NGO = {
      _id: Date.now().toString(),
      name: ngoData.name,
      description: ngoData.description,
      cause: ngoData.cause,
      contact: ngoData.contact,
      isVerified: false,
      totalReceived: 0
    };

    // Save to localStorage
    const existingNGOs = JSON.parse(localStorage.getItem('registeredNGOs') || '[]');
    existingNGOs.push(newNGO);
    localStorage.setItem('registeredNGOs', JSON.stringify(existingNGOs));

    return newNGO;
  }
};
