# 🚀 Vercel Deployment Guide for CONNECT NGO

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js installed locally

## Deployment Steps

### 1. Prepare Your Repository
```bash
# Make sure your project is in a Git repository
git init
git add .
git commit -m "Initial commit for Vercel deployment"

# Push to your remote repository (GitHub/GitLab/Bitbucket)
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your project directory
cd "D:\CONNECT NGO"

# Deploy to Vercel
vercel

# Follow the prompts:
# - Link to existing project? No
# - What's your project's name? connect-ngo
# - In which directory is your code located? ./
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `client/build`

### 3. Environment Variables Setup
In your Vercel dashboard, go to Settings > Environment Variables and add:

```
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Domain Configuration
- Your app will be available at: `https://your-project-name.vercel.app`
- You can add a custom domain in Settings > Domains

## Project Structure for Vercel
```
CONNECT NGO/
├── client/                 # React frontend
│   ├── build/             # Built React app (auto-generated)
│   ├── src/               # React source code
│   └── package.json       # Frontend dependencies
├── backend/               # Express backend
│   ├── server.js          # Main server file
│   ├── database.json      # File-based database
│   └── package.json       # Backend dependencies
├── vercel.json           # Vercel configuration
├── package.json          # Root package.json with build scripts
└── .vercelignore         # Files to ignore during deployment
```

## Important Notes

### Database Considerations
⚠️ **Current Setup**: Uses file-based JSON database (`database.json`)
- This works for development but has limitations in production
- File system is read-only on Vercel after deployment
- Consider migrating to a cloud database for production:
  - MongoDB Atlas (recommended)
  - PostgreSQL (Supabase, Neon)
  - Firebase Firestore

### API Routes
- Backend APIs will be available at: `/api/*`
- Frontend will be served from the root: `/`

### Build Process
1. Vercel runs `npm run vercel-build`
2. This installs client dependencies and builds the React app
3. Backend is deployed as serverless functions

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check that all dependencies are in package.json
2. **API Not Working**: Ensure backend routes start with `/api/`
3. **Environment Variables**: Make sure all required env vars are set in Vercel dashboard

### Logs:
- View deployment logs in Vercel dashboard
- Check function logs for backend issues

## Production Recommendations

1. **Database Migration**:
   ```bash
   # Consider using MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ngo_donation
   ```

2. **Security**:
   - Use strong JWT secrets
   - Enable CORS only for your domain
   - Use production API keys for Razorpay/Stripe

3. **Performance**:
   - Enable caching for static assets
   - Optimize images and bundle size
   - Use CDN for better global performance

## Support
- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
