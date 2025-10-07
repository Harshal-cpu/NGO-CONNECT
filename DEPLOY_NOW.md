# 🚀 DEPLOY CONNECT NGO NOW

## ✅ STEP 1: Deploy Frontend to Netlify (2 minutes)

1. **Open Netlify**: Go to https://netlify.com
2. **Sign Up/Login**: Create account or login
3. **Deploy**: 
   - Click "Add new site" → "Deploy manually"
   - Drag and drop this folder: `client/build`
   - Wait 30 seconds
   - ✅ **Your frontend is LIVE!**

## ✅ STEP 2: Deploy Backend to Railway (3 minutes)

### Option A: GitHub Method (Recommended)
1. **Push to GitHub first**:
   ```bash
   # You need to authenticate with GitHub first
   # Use GitHub Desktop or authenticate git
   git push origin main
   ```

2. **Deploy on Railway**:
   - Go to https://railway.app
   - Sign up/Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select "CONNECT-NGO" repository
   - Select "backend" folder as root directory

3. **Set Environment Variables**:
   ```
   NODE_ENV=production
   JWT_SECRET=connect_ngo_super_secret_key_2024_production
   PORT=5000
   ```

### Option B: Direct Upload Method
1. **Zip Backend Folder**:
   - Compress the `backend` folder
   - Upload to Railway directly

## 🔧 Environment Variables for Railway:

```
NODE_ENV=production
JWT_SECRET=connect_ngo_super_secret_key_2024_production
PORT=5000
```

## 🔗 After Deployment:

1. **Get your Railway backend URL** (e.g., `https://your-app.railway.app`)
2. **Update frontend API URL** in Netlify:
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add: `REACT_APP_API_URL=https://your-railway-url.railway.app/api`
   - Redeploy frontend

## 🎉 Your CONNECT NGO Platform Will Be Live!

- **Frontend**: https://your-site.netlify.app
- **Backend**: https://your-app.railway.app
- **Full Platform**: Ready to help NGOs and donors connect!

---

**Need Help?** 
- Netlify Docs: https://docs.netlify.com
- Railway Docs: https://docs.railway.app
