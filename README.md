# 🥗 NutriCare – Dietitian Web Application

A full-stack web application for online diet consultation, monitoring, and AI-powered nutrition assistance. Built with React, Node.js, Supabase, Firebase, and Google Gemini AI.

![NutriCare Banner](https://via.placeholder.com/800x400/22c55e/ffffff?text=NutriCare)

## ✨ Features

### For Patients
- 📊 **BMI Calculator** - Calculate and track your Body Mass Index
- 📝 **Daily Diet Log** - Log meals with calories and get nutritional insights
- 📅 **Appointment Booking** - Schedule consultations with dietitians
- 💬 **Real-time Chat** - Communicate directly with your dietitian
- 🤖 **AI Assistant** - Get instant nutrition advice powered by Google Gemini

### For Dietitians
- 👥 **Patient Management** - View and manage all patients
- 📈 **Progress Monitoring** - Track patient diet logs and progress
- ✅ **Appointment Management** - Approve, schedule, and manage appointments
- 💬 **Real-time Chat** - Communicate with patients instantly
- 📊 **Dashboard Analytics** - View statistics and patient insights

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Real-time Chat** | Firebase Realtime Database |
| **AI** | Google Gemini API |
| **Charts** | Recharts |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier)
- Firebase account (free tier)
- Google AI Studio account (for Gemini API)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd nutricare
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

3. **Set up environment variables**

Create `.env` files from the examples:
```bash
# Frontend
cp client/.env.example client/.env

# Backend
cp server/.env.example server/.env
```

4. **Configure Supabase**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql`
   - Copy your project URL and keys to the `.env` files

5. **Configure Firebase**
   - Create a new Firebase project
   - Enable Realtime Database
   - Copy your config to the frontend `.env`

6. **Configure Google Gemini**
   - Get an API key from Google AI Studio
   - Add it to the server `.env`

7. **Start the development servers**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 📁 Project Structure

```
nutricare/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── config/         # Supabase & Firebase config
│   │   ├── pages/          # Page components
│   │   │   ├── auth/       # Login, Register
│   │   │   ├── patient/    # Patient pages
│   │   │   └── dietitian/  # Dietitian pages
│   │   ├── store/          # Zustand state management
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # Supabase & Gemini config
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API routes
│   │   └── index.js
│   └── package.json
│
├── database/
│   └── schema.sql          # PostgreSQL schema
│
└── package.json            # Root package.json
```

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/patients` | Get all patients (dietitian only) |
| GET | `/api/users/patients/:id` | Get patient details |
| PATCH | `/api/users/profile` | Update profile |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Get appointments |
| POST | `/api/appointments` | Book appointment |
| PATCH | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Cancel appointment |
| GET | `/api/appointments/available-slots` | Get available time slots |

### Diet Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/diet-logs` | Get diet logs |
| POST | `/api/diet-logs` | Add diet log |
| DELETE | `/api/diet-logs/:id` | Delete diet log |
| GET | `/api/diet-logs/analyze` | Get AI analysis |

### AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Chat with AI assistant |
| POST | `/api/ai/bmi-advice` | Get BMI-based advice |
| POST | `/api/ai/quick-question` | Ask nutrition question |
| GET | `/api/ai/nutrition/:food` | Get food nutrition info |

## 🎨 UI Features

- **Modern Dark Theme** - Easy on the eyes with green accent colors
- **Glassmorphism Effects** - Beautiful blurred glass-like components
- **Smooth Animations** - Powered by Framer Motion
- **Responsive Design** - Works on all devices
- **Custom Typography** - Playfair Display for headings, DM Sans for body

## 🔧 Configuration

### Supabase Setup
1. Create tables using `database/schema.sql`
2. Enable Row Level Security (RLS)
3. Configure authentication providers

### Firebase Setup
1. Create Realtime Database
2. Set security rules for authenticated users
3. Enable authentication (optional)

### Gemini API Setup
1. Get API key from Google AI Studio
2. Use `gemini-pro` model for text generation

## 📦 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy the dist folder to Vercel
```

### Backend (Railway/Render)
```bash
cd server
# Deploy to Railway or Render
# Set environment variables
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

Built with ❤️ for a healthier world.

---

## 🔗 Links

- [Supabase Documentation](https://supabase.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)


