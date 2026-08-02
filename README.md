# 🥗 NutriCare -- Dietitian Web Application


# NutriCare

### AI-Powered Diet Consultation & Nutrition Management Platform

A modern full-stack web application that connects **Patients** with
**Professional Dietitians** through online consultations, diet tracking,
AI-powered nutrition assistance, and real-time communication.

🌐 **Live Demo:** https://nutri-care-nine.vercel.app/

📂 **Repository:** https://github.com/usman11267/NutriCare-
:::

------------------------------------------------------------------------

## ✨ Features

### 👤 Patient Portal

-   BMI Calculator
-   Daily Diet Log
-   Nutrition Tracking
-   Appointment Booking
-   Real-time Chat
-   AI Nutrition Assistant (Google Gemini)
-   Personal Dashboard
-   Progress Monitoring

### 👨‍⚕️ Dietitian Portal

-   Patient Management
-   Appointment Approval
-   Progress Analytics
-   Diet Plan Management
-   Dashboard Statistics
-   Secure Messaging

------------------------------------------------------------------------

## 🛠 Tech Stack

  Category         Technology
  ---------------- ------------------------------------------
  Frontend         React, Vite, Tailwind CSS, Framer Motion
  Backend          Node.js, Express.js
  Database         Supabase (PostgreSQL)
  Authentication   Supabase Auth
  Realtime         Firebase Realtime Database
  AI               Google Gemini API
  Charts           Recharts

------------------------------------------------------------------------

## 📁 Project Structure

``` text
NutriCare/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
├── database/
│   └── schema.sql
└── package.json
```

------------------------------------------------------------------------

## 🚀 Installation

``` bash
git clone https://github.com/usman11267/NutriCare-.git
cd NutriCare-

npm install
npm run install:all

npm run dev
```

Frontend:

    http://localhost:5173

Backend:

    http://localhost:3001

------------------------------------------------------------------------

## 🔐 Environment Variables

### client/.env

``` env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_PROJECT_ID=
```

### server/.env

``` env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
PORT=3001
```

------------------------------------------------------------------------

## 📡 API

### Authentication

-   POST `/api/auth/register`
-   POST `/api/auth/login`
-   GET `/api/auth/me`

### Appointments

-   GET `/api/appointments`
-   POST `/api/appointments`
-   PATCH `/api/appointments/:id`

### Diet Logs

-   GET `/api/diet-logs`
-   POST `/api/diet-logs`
-   DELETE `/api/diet-logs/:id`

### AI

-   POST `/api/ai/chat`
-   POST `/api/ai/bmi-advice`
-   GET `/api/ai/nutrition/:food`

------------------------------------------------------------------------

## 🎨 UI Highlights

-   Dark Theme
-   Glassmorphism
-   Responsive Design
-   Framer Motion Animations
-   Modern Dashboard

------------------------------------------------------------------------

## 📦 Deployment

### Frontend

Deploy to **Vercel**

### Backend

Deploy to **Render** or **Railway**

------------------------------------------------------------------------

## 🗺 Roadmap

-   Email Notifications
-   Video Consultations
-   AI Meal Planner
-   Payment Integration
-   Mobile App

------------------------------------------------------------------------

## 🤝 Contributing

Fork the repository, create a feature branch, commit your changes, and
open a Pull Request.

------------------------------------------------------------------------

## 📄 License

Licensed under the ISC License.

------------------------------------------------------------------------

## 👨‍💻 Author

**Muhammad Usman**

Built with ❤️ using React, Node.js, Supabase, Firebase and Google Gemini
AI.

------------------------------------------------------------------------

## 🔗 Useful Links

-   Live Demo: https://nutri-care-nine.vercel.app/
-   GitHub: https://github.com/usman11267/NutriCare-
-   Supabase: https://supabase.com/docs
-   Firebase: https://firebase.google.com/docs
-   Google AI Studio: https://aistudio.google.com/
-   Tailwind CSS: https://tailwindcss.com/docs
-   Framer Motion: https://motion.dev/
