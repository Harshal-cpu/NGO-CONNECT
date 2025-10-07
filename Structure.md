Here's the complete structure of your CONNECT NGO project:

### Root Directory
D:\CONNECT NGO\
├── .git/                          # Git repository
├── .gitignore                     # Git ignore file
├── README.md                      # Project documentation
├── package.json                   # Root package configuration
├── package-lock.json              # Dependency lock file
├── node_modules/                  # Root dependencies
├── MODERN_STYLING_GUIDE.md        # Styling guidelines
├── docker-setup.md               # Docker setup instructions


### Backend Directory (/backend/)
backend/
├── server.js                      # Main Express server
├── persistent-server.js           # Persistent server version
├── working-server.js              # Working server backup
├── simple-server.js               # Simplified server
├── simple-auth-server.js          # Auth-focused server
├── package.json                   # Backend dependencies
├── package-lock.json              # Backend dependency lock
├── .env                           # Environment variables
├── database.json                  # JSON database file
├── server.log                     # Server logs
├── startup.log                    # Startup logs
├── node_modules/                  # Backend dependencies (extensive)
├── models/                        # Data models
│   ├── User.js                    # User model
│   ├── NGO.js                     # NGO model
│   ├── DonationRequest.js         # Donation request model
│   └── Transaction.js             # Transaction model
├── routes/                        # API routes
│   ├── auth.js                    # Authentication routes
│   ├── auth-simple.js             # Simplified auth routes
│   ├── auth-fixed.js              # Fixed auth routes
│   ├── auth-backup.js             # Auth backup
│   ├── users.js                   # User routes
│   ├── admin.js                   # Admin routes
│   ├── ngo.js                     # NGO routes
│   ├── donations.js               # Donation routes
│   ├── payments.js                # Payment routes
│   └── browse.js                  # Browse routes
└── middleware/                    # Middleware functions
    ├── auth.js                    # Authentication middleware
    └── admin.js                   # Admin middleware


### Frontend Directory (/client/)
client/
├── package.json                   # Frontend dependencies
├── package-lock.json              # Frontend dependency lock
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS configuration
├── README.md                      # Client documentation
├── .gitignore                     # Client git ignore
├── node_modules/                  # Frontend dependencies
├── build/                         # Production build output
├── public/                        # Static assets
└── src/                           # Source code
    ├── App.tsx                    # Main App component
    ├── App.css                    # App styles
    ├── index.tsx                  # Entry point
    ├── index.css                  # Global styles
    ├── components/                # React components
    │   ├── HomePage.tsx           # Home page
    │   ├── Header.tsx             # Navigation header
    │   ├── Footer.tsx             # Footer component
    │   ├── Login.tsx              # Login form
    │   ├── Register.tsx           # Registration form
    │   ├── Dashboard.tsx          # Main dashboard
    │   ├── DonorDashboard.tsx     # Donor-specific dashboard
    │   ├── NGODashboard.tsx       # NGO-specific dashboard
    │   ├── AdminDashboard.tsx     # Admin dashboard
    │   ├── BrowseNGOs.tsx         # NGO browsing page
    │   ├── NGOProfile.tsx         # NGO profile display
    │   ├── MyNGOProfile.tsx       # NGO profile management
    │   ├── NGORegistration.tsx    # NGO registration
    │   ├── NGODetailView.tsx      # Detailed NGO view
    │   ├── DonationPage.tsx       # Donation interface
    │   ├── DonationForm.tsx       # Donation form
    │   ├── SimpleDonationForm.tsx # Simple donation form
    │   ├── DonationHistory.tsx    # Donation history
    │   ├── DonationRequests.tsx   # Donation requests
    │   ├── CreateDonationRequest.tsx # Create donation request
    │   ├── DonationReceipt.tsx    # Donation receipt
    │   ├── DonationRequestReceipt.tsx # Request receipt
    │   ├── AboutUs.tsx            # About page
    │   └── Layout.tsx             # Layout wrapper
    ├── context/                   # React context
    │   ├── AuthContext.tsx        # Authentication context
    │   └── MockAuthContext.tsx    # Mock auth for testing
    ├── services/                  # API services
    │   ├── api.ts                 # API configuration
    │   └── ngoService.ts          # NGO-specific services
    └── types/                     # TypeScript types
        ├── auth.ts                # Authentication types
        └── ngo.ts                 # NGO types


### Utility & Test Files
├── mock-data/                     # Mock data for testing
│   ├── users.json                 # Sample users
│   ├── ngos.json                  # Sample NGOs
│   └── donationRequests.json      # Sample donation requests
├── create-admin.js                # Admin creation script
├── create-mock-db.js              # Mock database setup
├── create-test-user.js            # Test user creation
├── create-user-simple.js          # Simple user creation
├── setup-database.js              # Database setup script
├── start-backend.js               # Backend startup script
├── working-server.js              # Working server backup
├── view-database.js               # Database viewer
├── test-*.js                      # Various test files
└── *.log files                    # Log files


### Key Technologies Used:
• **Backend**: Node.js, Express.js, MongoDB/Mongoose, JWT, bcrypt
• **Frontend**: React 18, TypeScript, Tailwind CSS, Axios
• **Database**: MongoDB with JSON fallback
• **Authentication**: JWT-based with role management
• **Payment**: Stripe integration
• **Development**: Concurrently, Nodemon

This is a comprehensive MERN stack NGO donation platform with role-based authentication, payment processing, and modern
UI components.