# MongoDB with Docker Setup

## Prerequisites
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Start Docker Desktop

## Setup Commands
```bash
# Start MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Setup database with sample data
npm run setup-db

# Start the application
npm run dev
```

## Verify Setup
```bash
# Check if MongoDB container is running
docker ps

# Check database connection
npm run setup-db
```

## Features Working with Real Database:
✅ User Authentication (real JWT tokens)
✅ NGO Registration & Profiles
✅ Donation Requests (CRUD operations)
✅ Donor Pledges (stored in DB)
✅ Browse NGOs with filters
✅ Donor Dashboard with real history
✅ All API endpoints functional

## Without Docker (Current Mock Setup):
✅ All UI features work
✅ Navigation between pages
✅ Mock data for testing
❌ Data not persisted
❌ No real authentication