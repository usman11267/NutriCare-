import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Public Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import PortfolioPage from './pages/PortfolioPage'
import BMICalculator from './pages/BMICalculator'

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard'
import PatientAppointments from './pages/patient/Appointments'
import PatientDietLog from './pages/patient/DietLog'
import PatientChat from './pages/patient/Chat'
import PatientAIAssistant from './pages/patient/AIAssistant'
import PatientProfile from './pages/patient/Profile'

// Dietitian Pages
import DietitianDashboard from './pages/dietitian/Dashboard'
import DietitianPatients from './pages/dietitian/Patients'
import DietitianAppointments from './pages/dietitian/Appointments'
import DietitianChat from './pages/dietitian/Chat'
import DietitianMonitoring from './pages/dietitian/Monitoring'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  const { initialize, isLoading } = useAuthStore()

  // Initialize auth state on app load
  useEffect(() => {
    initialize()
  }, [initialize])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        {/* Background decorations */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="bg-blur-circle w-[600px] h-[600px] -top-48 -left-48 bg-primary-500/20" />
          <div className="bg-blur-circle w-[500px] h-[500px] top-1/2 -right-48 bg-accent-500/10" />
          <div className="bg-blur-circle w-[400px] h-[400px] bottom-0 left-1/3 bg-primary-600/10" />
        </div>
        
        <Navbar />
        
        <main className="flex-1 relative z-10">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/bmi-calculator" element={<BMICalculator />} />
            
            {/* Patient Routes */}
            <Route 
              path="/patient/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/appointments" 
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientAppointments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/diet-log" 
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDietLog />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/chat" 
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientChat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/ai-assistant" 
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientAIAssistant />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/profile" 
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Dietitian Routes */}
            <Route 
              path="/dietitian/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['dietitian']}>
                  <DietitianDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dietitian/patients" 
              element={
                <ProtectedRoute allowedRoles={['dietitian']}>
                  <DietitianPatients />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dietitian/appointments" 
              element={
                <ProtectedRoute allowedRoles={['dietitian']}>
                  <DietitianAppointments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dietitian/chat" 
              element={
                <ProtectedRoute allowedRoles={['dietitian']}>
                  <DietitianChat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dietitian/monitoring" 
              element={
                <ProtectedRoute allowedRoles={['dietitian']}>
                  <DietitianMonitoring />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App


