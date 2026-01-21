# 🛠️ NutriCare Complete Setup Guide

This guide will walk you through setting up all services step by step.

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Supabase Setup](#2-supabase-setup)
3. [Firebase Setup](#3-firebase-setup)
4. [Google Gemini API Setup](#4-google-gemini-api-setup)
5. [Project Configuration](#5-project-configuration)
6. [Running the Application](#6-running-the-application)
7. [Testing the Application](#7-testing-the-application)
8. [Deployment](#8-deployment)

---

## 1. Prerequisites

### Install Node.js
1. Go to https://nodejs.org/
2. Download the **LTS version** (18.x or higher)
3. Run the installer
4. Verify installation:
```bash
node --version
npm --version
```

### Install Git (Optional)
1. Go to https://git-scm.com/
2. Download and install
3. Verify: `git --version`

---

## 2. Supabase Setup

Supabase provides the database and authentication.

### Step 2.1: Create Supabase Account
1. Go to https://supabase.com/
2. Click **"Start your project"**
3. Sign up with GitHub or Email

### Step 2.2: Create New Project
1. Click **"New Project"**
2. Fill in:
   - **Name**: `nutricare`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup

### Step 2.3: Get Your API Keys
1. In your project dashboard, click **"Settings"** (gear icon) in left sidebar
2. Click **"API"** under Configuration
3. Copy these values:

| Key | Where to Find |
|-----|---------------|
| **Project URL** | Under "Project URL" |
| **anon public** | Under "Project API keys" |
| **service_role** | Under "Project API keys" (click "Reveal") |

⚠️ **IMPORTANT**: Never share your `service_role` key publicly!

### Step 2.4: Create Database Tables
1. In left sidebar, click **"SQL Editor"**
2. Click **"New query"**
3. Copy ALL content from `database/schema.sql` file
4. Paste into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### Step 2.5: Verify Tables Created
1. Click **"Table Editor"** in left sidebar
2. You should see these tables:
   - `profiles`
   - `appointments`
   - `diet_logs`
   - `messages`

---

## 3. Firebase Setup

Firebase provides real-time chat functionality.

### Step 3.1: Create Firebase Account
1. Go to https://firebase.google.com/
2. Click **"Get started"**
3. Sign in with Google account

### Step 3.2: Create New Project
1. Click **"Add project"**
2. Enter project name: `nutricare`
3. **Disable** Google Analytics (optional, simplifies setup)
4. Click **"Create project"**
5. Wait for project creation, then click **"Continue"**

### Step 3.3: Add Web App
1. In Project Overview, click the **Web icon** (`</>`)
2. Enter app nickname: `nutricare-web`
3. **Don't** check "Firebase Hosting" for now
4. Click **"Register app"**
5. You'll see the Firebase config - **COPY THIS**:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "nutricare-xxxxx.firebaseapp.com",
  databaseURL: "https://nutricare-xxxxx-default-rtdb.firebaseio.com",
  projectId: "nutricare-xxxxx",
  storageBucket: "nutricare-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 3.4: Enable Realtime Database
1. In left sidebar, click **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Choose location (closest to users)
4. Select **"Start in test mode"** (for development)
5. Click **"Enable"**

### Step 3.5: Set Database Rules
1. In Realtime Database, click **"Rules"** tab
2. Replace with these rules:

```json
{
  "rules": {
    "chats": {
      "$roomId": {
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null"
        },
        "typing": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    }
  }
}
```

3. Click **"Publish"**

### Step 3.6: Get Database URL
1. In Realtime Database, look at the top of the page
2. Copy the URL (looks like: `https://nutricare-xxxxx-default-rtdb.firebaseio.com`)

---

## 4. Google Gemini API Setup

Gemini provides AI-powered nutrition advice.

### Step 4.1: Access Google AI Studio
1. Go to https://makersuite.google.com/ (or https://aistudio.google.com/)
2. Sign in with Google account
3. Accept terms if prompted

### Step 4.2: Create API Key
1. Click **"Get API Key"** in left sidebar
2. Click **"Create API key"**
3. Choose **"Create API key in new project"** (or select existing)
4. **COPY THE API KEY** immediately (it won't be shown again!)

### Step 4.3: Test the API (Optional)
1. In AI Studio, click **"New Prompt"**
2. Type: "What are healthy breakfast options?"
3. Click **"Run"** to verify it works

---

## 5. Project Configuration

Now let's configure the project with your keys.

### Step 5.1: Navigate to Project
```bash
cd C:\Users\muham\Desktop\Dieti
```

### Step 5.2: Create Client Environment File
1. Create file: `client/.env`
2. Add your values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=nutricare-xxxxx.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://nutricare-xxxxx-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=nutricare-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=nutricare-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# API URL
VITE_API_URL=http://localhost:3001/api
```

### Step 5.3: Create Server Environment File
1. Create file: `server/.env`
2. Add your values:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Gemini API
GEMINI_API_KEY=AIzaSy...

# JWT Secret
JWT_SECRET=your-super-secret-key-make-it-long-and-random
```

### Step 5.4: Install Dependencies
Open terminal/command prompt in the project folder:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Go back to root
cd ..
```

---

## 6. Running the Application

### Option A: Run Both Together (Recommended)
```bash
npm run dev
```

### Option B: Run Separately
Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

---

## 7. Testing the Application

### Step 7.1: Create Test Users

#### Option A: Register Through UI
1. Go to http://localhost:5173/register
2. Create a Patient account:
   - Name: `Test Patient`
   - Email: `patient@test.com`
   - Password: `test123`
   - Role: Patient
3. Create a Dietitian account:
   - Name: `Dr. Test`
   - Email: `dietitian@test.com`
   - Password: `test123`
   - Role: Dietitian

#### Option B: Create via Supabase Dashboard
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Fill in details and create

### Step 7.2: Test Features

#### As Patient:
1. Login at http://localhost:5173/login
2. Test BMI Calculator
3. Add diet logs
4. Book an appointment
5. Try AI Assistant

#### As Dietitian:
1. Logout and login as dietitian
2. View patient list
3. Monitor diet logs
4. Approve appointments

---

## 8. Deployment

### 8.1: Deploy Frontend to Vercel

1. Create account at https://vercel.com/
2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Deploy:
```bash
cd client
vercel
```

4. Follow prompts and add environment variables in Vercel dashboard

### 8.2: Deploy Backend to Railway

1. Create account at https://railway.app/
2. Create new project
3. Connect GitHub repo or deploy directly
4. Add environment variables in Railway dashboard
5. Deploy

### 8.3: Update URLs

After deployment, update:
- Frontend `.env`: Change `VITE_API_URL` to your Railway URL
- Backend `.env`: Change `CLIENT_URL` to your Vercel URL

---

## 🔧 Troubleshooting

### Common Issues

#### "npm install" fails
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

#### Supabase connection error
- Check if URL and keys are correct
- Ensure no extra spaces in .env file
- Verify tables exist in Supabase

#### Firebase error
- Check if Realtime Database is enabled
- Verify database URL is correct
- Check security rules

#### Gemini API error
- Verify API key is valid
- Check if you have API quota remaining
- Try generating a new key

#### Port already in use
```bash
# Find and kill process (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Or change port in .env
PORT=3002
```

---

## 📞 Quick Reference

| Service | Dashboard URL |
|---------|--------------|
| Supabase | https://app.supabase.com/ |
| Firebase | https://console.firebase.google.com/ |
| Google AI | https://aistudio.google.com/ |
| Vercel | https://vercel.com/dashboard |
| Railway | https://railway.app/dashboard |

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] Supabase project created
- [ ] Supabase tables created
- [ ] Firebase project created
- [ ] Realtime Database enabled
- [ ] Gemini API key obtained
- [ ] client/.env configured
- [ ] server/.env configured
- [ ] Dependencies installed
- [ ] Application running

---

**Need Help?** Check the README.md file or open an issue!

