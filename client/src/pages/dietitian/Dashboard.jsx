import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const DietitianDashboard = () => {
  const { user, profile } = useAuthStore()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  // Mock data
  const stats = [
    { 
      label: 'Total Patients', 
      value: 156, 
      change: '+12%', 
      trend: 'up', 
      icon: Users,
      color: 'from-blue-500 to-indigo-500' 
    },
    { 
      label: "Today's Appointments", 
      value: 8, 
      change: '+2', 
      trend: 'up', 
      icon: Calendar,
      color: 'from-primary-500 to-emerald-500' 
    },
    { 
      label: 'Pending Reviews', 
      value: 23, 
      change: '-5', 
      trend: 'down', 
      icon: AlertCircle,
      color: 'from-yellow-500 to-orange-500' 
    },
    { 
      label: 'Unread Messages', 
      value: 14, 
      change: '+8', 
      trend: 'up', 
      icon: MessageCircle,
      color: 'from-purple-500 to-pink-500' 
    }
  ]

  const weeklyPatients = [
    { day: 'Mon', patients: 8 },
    { day: 'Tue', patients: 12 },
    { day: 'Wed', patients: 10 },
    { day: 'Thu', patients: 15 },
    { day: 'Fri', patients: 11 },
    { day: 'Sat', patients: 5 },
    { day: 'Sun', patients: 3 }
  ]

  const patientProgress = [
    { name: 'Goal Achieved', value: 45, color: '#22c55e' },
    { name: 'On Track', value: 35, color: '#3b82f6' },
    { name: 'Needs Attention', value: 20, color: '#eab308' }
  ]

  const todayAppointments = [
    { time: '9:00 AM', patient: 'Sarah Johnson', type: 'Follow-up', status: 'completed' },
    { time: '10:30 AM', patient: 'Michael Chen', type: 'Initial Consultation', status: 'completed' },
    { time: '12:00 PM', patient: 'Emily Davis', type: 'Progress Review', status: 'in-progress' },
    { time: '2:00 PM', patient: 'James Wilson', type: 'Meal Plan Review', status: 'upcoming' },
    { time: '3:30 PM', patient: 'Amanda Foster', type: 'Follow-up', status: 'upcoming' }
  ]

  const recentActivity = [
    { patient: 'Sarah Johnson', action: 'logged breakfast', time: '10 min ago', icon: Activity },
    { patient: 'Michael Chen', action: 'completed weekly goal', time: '25 min ago', icon: CheckCircle2 },
    { patient: 'Emily Davis', action: 'sent a message', time: '1 hour ago', icon: MessageCircle },
    { patient: 'James Wilson', action: 'updated diet log', time: '2 hours ago', icon: Activity }
  ]

  const patientsNeedingAttention = [
    { name: 'Robert Brown', issue: 'No diet log for 5 days', severity: 'high' },
    { name: 'Lisa Wang', issue: 'Below calorie target consistently', severity: 'medium' },
    { name: 'David Kim', issue: 'Missed last appointment', severity: 'high' }
  ]

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            {greeting}, Dr. {profile?.name?.split(' ')[1] || 'Mitchell'}! 👩‍⚕️
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your patients today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/dietitian/patients" className="btn-secondary flex items-center gap-2 text-sm py-2">
            <Users className="w-4 h-4" />
            View All Patients
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Weekly Overview Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">Weekly Patient Sessions</h2>
              <span className="text-sm text-gray-400">This Week</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyPatients}>
                  <defs>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#1f2937', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPatients)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Today's Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">Today's Schedule</h2>
              <Link to="/dietitian/appointments" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1">
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {todayAppointments.map((apt, i) => (
                <div 
                  key={i}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                    apt.status === 'in-progress' 
                      ? 'bg-primary-500/10 border-primary-500/30' 
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <p className="text-sm font-medium text-white">{apt.time}</p>
                    </div>
                    <div>
                      <p className="font-medium text-white">{apt.patient}</p>
                      <p className="text-sm text-gray-400">{apt.type}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    apt.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {apt.status.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Patient Progress Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h2 className="font-display text-xl font-bold text-white mb-6">Patient Progress</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={patientProgress}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {patientProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {patientProgress.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Patients Needing Attention */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">Needs Attention</h2>
              <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                {patientsNeedingAttention.length}
              </span>
            </div>
            <div className="space-y-3">
              {patientsNeedingAttention.map((patient, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-white">{patient.name}</p>
                    <span className={`w-2 h-2 rounded-full ${
                      patient.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                  </div>
                  <p className="text-sm text-gray-400">{patient.issue}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h2 className="font-display text-xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.patient}</span>{' '}
                      <span className="text-gray-400">{activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DietitianDashboard


