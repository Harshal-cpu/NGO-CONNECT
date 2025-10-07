#!/bin/bash

echo "🚀 Starting CONNECT NGO deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the client
echo "🔨 Building React client..."
cd client && npm run build && cd ..

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to set your environment variables in Vercel dashboard:"
echo "   - NODE_ENV=production"
echo "   - JWT_SECRET=your_secure_jwt_secret"
echo "   - RAZORPAY_KEY_ID=your_razorpay_key"
echo "   - RAZORPAY_KEY_SECRET=your_razorpay_secret"
echo "   - STRIPE_SECRET_KEY=your_stripe_secret"
