# 🌟 CONNECT NGO - Donation Platform

A full-stack web application connecting NGOs with donors, enabling seamless monetary and in-kind donations. Built with the MERN stack and designed for modern donation management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)
![React](https://img.shields.io/badge/react-v19.1-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-v4.9-blue.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Admin, NGO, Donor)
- Password encryption with bcrypt
- Protected routes and middleware

### 💰 Donation Management
- Secure payment processing with Stripe
- Real-time donation tracking
- Donation history and analytics
- Multiple payment methods support

### 🏢 NGO Management
- NGO registration and verification system
- Profile management and customization
- Cause categorization
- Verification badge system

### 📊 Dashboard Analytics
- Personalized dashboards for each user role
- Real-time statistics and insights
- Donation trends and reports
- User activity monitoring

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Professional and intuitive interface
- Mobile-first approach
- Accessibility compliant

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Stripe React** - Payment integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **JSON Database** - File-based data storage
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Concurrently** - Run multiple scripts
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
CONNECT-NGO/
├── 📁 backend/                 # Node.js/Express backend
│   ├── 📄 server.js           # Main server file
│   ├── 📄 database.json       # JSON database
│   ├── 📁 models/             # Data models
│   ├── 📁 routes/             # API routes
│   ├── 📁 middleware/         # Authentication middleware
│   └── 📄 package.json        # Backend dependencies
├── 📁 client/                 # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/     # React components
│   │   ├── 📁 context/        # React context
│   │   ├── 📁 services/       # API services
│   │   ├── 📁 types/          # TypeScript types
│   │   └── 📄 App.tsx         # Main App component
│   ├── 📁 public/             # Static assets
│   └── 📄 package.json        # Frontend dependencies
├── 📄 package.json            # Root package.json
├── 📄 README.md               # Project documentation
└── 📄 .gitignore              # Git ignore rules
```

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/connect-ngo.git
   cd connect-ngo
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Backend environment (backend/.env)
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   
   # Frontend environment (client/.env)
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. **Initialize database**
   ```bash
   npm run setup-mock-db
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database Viewer: http://localhost:5000/api/database

## 🎯 Usage

### For Donors
1. Register as a Donor
2. Browse verified NGOs
3. Make secure donations
4. Track donation history
5. View impact analytics

### For NGOs
1. Register your organization
2. Complete verification process
3. Create donation campaigns
4. Manage donor relationships
5. Access fundraising analytics

### For Admins
1. Verify NGO applications
2. Monitor platform activity
3. Manage users and organizations
4. Generate platform reports
5. Oversee donation transactions

## 📡 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
```

### NGO Endpoints
```http
GET  /api/browse/ngos      # Browse all NGOs
POST /api/ngo/register     # Register new NGO
GET  /api/ngo/my-profile   # Get NGO profile
PUT  /api/ngo/:id/edit     # Update NGO profile
```

### Donation Endpoints
```http
POST /api/payments/create-donation  # Create donation
GET  /api/payments/my-donations     # Get user donations
GET  /api/donations/requests        # Get donation requests
```

### Admin Endpoints
```http
GET  /api/admin/stats      # Platform statistics
GET  /api/admin/ngos       # All NGOs management
PUT  /api/admin/ngos/:id/verify  # Verify NGO
DELETE /api/admin/ngos/:id # Delete NGO
```

## 👥 User Roles

### 🎯 Donor
- Browse and search NGOs
- Make secure donations
- Track donation history
- View impact reports
- Manage profile settings

### 🏢 NGO
- Register organization
- Create fundraising campaigns
- Manage donor relationships
- Access analytics dashboard
- Update organization profile

### 👑 Admin
- Verify NGO applications
- Monitor platform activity
- Manage users and content
- Generate system reports
- Oversee transactions

## 🖼 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### NGO Dashboard
![NGO Dashboard](screenshots/ngo-dashboard.png)

### Donation Process
![Donation Process](screenshots/donation.png)

### Admin Panel
![Admin Panel](screenshots/admin.png)

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run backend          # Start backend only
npm run frontend         # Start frontend only

# Installation
npm run install-all      # Install all dependencies
npm run install-backend  # Install backend dependencies
npm run install-frontend # Install frontend dependencies

# Database
npm run setup-db         # Setup database
npm run setup-mock-db    # Setup with mock data
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
```

## 🧪 Testing

```bash
# Run frontend tests
cd client && npm test

# Run backend tests
cd backend && npm test

# Run all tests
npm run test:all
```

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd client
npm run build
# Deploy dist folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Set environment variables
# Deploy to your preferred platform
```

### Full Stack (Docker)
```bash
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Node.js](https://nodejs.org/) - Backend runtime
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Stripe](https://stripe.com/) - Payment processing
- [Heroicons](https://heroicons.com/) - Icon library

## 📞 Support

For support, email support@connectngo.com or join our Slack channel.

## 🔗 Links

- [Live Demo](https://connect-ngo-demo.netlify.app)
- [API Documentation](https://api.connectngo.com/docs)
- [Project Board](https://github.com/yourusername/connect-ngo/projects)
- [Issues](https://github.com/yourusername/connect-ngo/issues)

---

<div align="center">
  <p>Made with ❤️ for a better world</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
# CONNECT-NGO
# NGO-CONNECT
