# 🚀 NutriCare Deployment Guide (100% Free)

## Overview

This guide will help you deploy NutriCare completely free using:
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free)
- **Database**: Supabase (Already configured - Free)
- **Realtime**: Firebase (Already configured - Free)

---

## Prerequisites

1. GitHub account
2. Vercel account (https://vercel.com - sign up with GitHub)
3. Render account (https://render.com - sign up with GitHub)

---

## Step 1: Push Code to GitHub

```bash
# Initialize git repository (if not already done)
cd c:\Users\muham\Desktop\Dieti
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - NutriCare Diet Consultation Platform"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/nutricare.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `nutricare-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. Add Environment Variables (click "Environment" tab):
   ```
   NODE_ENV = production
   PORT = 10000
   CLIENT_URL = (leave empty for now, update after Vercel deployment)
   SUPABASE_URL = https://vjgtrvwlddnrorpcqgks.supabase.co
   SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZ3RydndsZGRucm9ycGNxZ2tzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODk3MDYyNiwiZXhwIjoyMDg0NTQ2NjI2fQ.rQaQ-rIhZe-HLXDKPuz4USF3xC4ft1-gjgxDch3xuGs
   GEMINI_API_KEY = AIzaSyC75rX5KyctIvNGcue3pDa44o3B0EUHqCA
   JWT_SECRET = your-super-secret-key-change-this
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. Copy your Render URL: `https://nutricare-api.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   ```
   VITE_SUPABASE_URL = https://vjgtrvwlddnrorpcqgks.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZ3RydndsZGRucm9ycGNxZ2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NzA2MjYsImV4cCI6MjA4NDU0NjYyNn0.6RDmT12S2Zh447UnhcZUlZrVNPxuGfvxWznls_qY-oU
   VITE_FIREBASE_API_KEY = AIzaSyC75rX5KyctIvNGcue3pDa44o3B0EUHqCA
   VITE_FIREBASE_AUTH_DOMAIN = myapp-bbeed.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL = https://myapp-bbeed-default-rtdb.asia-southeast1.firebasedatabase.app
   VITE_FIREBASE_PROJECT_ID = myapp-bbeed
   VITE_FIREBASE_STORAGE_BUCKET = myapp-bbeed.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID = 123456789
   VITE_FIREBASE_APP_ID = 1:123456789:web:abc123
   VITE_API_URL = https://nutricare-api.onrender.com/api
   ```
   ⚠️ **Replace `nutricare-api.onrender.com` with your actual Render URL from Step 2**

6. Click **"Deploy"**
7. Wait for deployment (2-3 minutes)
8. Your app is live at: `https://your-project.vercel.app`

---

## Step 4: Update Render with Vercel URL

1. Go back to Render Dashboard
2. Select your `nutricare-api` service
3. Go to **Environment** tab
4. Update `CLIENT_URL` to your Vercel URL: `https://your-project.vercel.app`
5. Click **"Save Changes"** (service will redeploy automatically)

---

## Step 5: Configure Supabase for Production

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/vjgtrvwlddnrorpcqgks)
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: `https://your-project.vercel.app/*`

---

## 🎉 Done!

Your NutriCare app is now live and accessible worldwide!

### Your URLs:
- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://nutricare-api.onrender.com`
- **API Health Check**: `https://nutricare-api.onrender.com/api/health`

---

## Free Tier Limitations

| Service | Limitations |
|---------|-------------|
| **Render** | Server sleeps after 15 min of inactivity (cold start ~30s) |
| **Vercel** | 100GB bandwidth/month, 100 deployments/day |
| **Supabase** | 500MB database, 2GB bandwidth, 50k monthly active users |
| **Firebase** | 100 simultaneous connections, 10GB/month bandwidth |

### Tips to Avoid Cold Starts
- Use a service like [UptimeRobot](https://uptimerobot.com) (free) to ping your Render URL every 14 minutes

---

## Troubleshooting

### CORS Errors
- Make sure `CLIENT_URL` on Render matches your Vercel URL exactly

### Database Connection Issues
- Check Supabase Dashboard for connection limits
- Verify environment variables are set correctly

### API Not Responding
- Check Render logs for errors
- Verify the server started successfully

---

## Auto-Deploy on Git Push

Both Vercel and Render will automatically redeploy when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Your app will be updated within minutes! 🚀
