import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Apple, 
  TrendingUp, 
  Calendar, 
  MessageCircle, 
  Bot,
  Flame,
  Droplets,
  Dumbbell,
  ChevronRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../config/supabase'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const PatientDashboard = () => {
  const { user, profile } = useAuthStore()
  const [greeting, setGreeting] = useState('')
  const [todayStats, setTodayStats] = useState({
    calories: { current: 0, goal: 2000 },
    protein: { current: 0, goal: 120 },
    water: { current: 0, goal: 8 },
    exercise: { current: 0, goal: 45 }
  })
  const [recentMeals, setRecentMeals] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [weeklyProgress, setWeeklyProgress] = useState([])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return

      const today = new Date().toISOString().split('T')[0]

      try {
        // Fetch today's diet logs
        const { data: dietLogs } = await supabase
          .from('diet_logs')
          .select('*')
          .eq('patient_id', user.id)
          .eq('date', today)
          .order('created_at', { ascending: false })

        if (dietLogs) {
          const totalCalories = dietLogs.reduce((sum, log) => sum + (log.calories || 0), 0)
          const totalProtein = dietLogs.reduce((sum, log) => sum + (parseFloat(log.protein) || 0), 0)
          
          setTodayStats(prev => ({
            ...prev,
            calories: { ...prev.calories, current: totalCalories },
            protein: { ...prev.protein, current: Math.round(totalProtein) }
          }))

          setRecentMeals(dietLogs.slice(0, 4).map(log => ({
            meal: log.meal.charAt(0).toUpperCase() + log.meal.slice(1),
            food: log.food,
            calories: log.calories,
            time: log.time || 'N/A'
          })))
        }

        // Fetch upcoming appointments
        const { data: appointments } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', user.id)
          .gte('date', today)
          .order('date', { ascending: true })
          .limit(3)

        if (appointments) {
          setUpcomingAppointments(appointments.map(apt => ({
            date: new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            time: apt.time,
            type: apt.type,
            status: apt.status
          })))
        }

        // Fetch weekly progress (last 7 days)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 6)
        
        const { data: weekLogs } = await supabase
          .from('diet_logs')
          .select('date, calories')
          .eq('patient_id', user.id)
          .gte('date', weekAgo.toISOString().split('T')[0])
          .lte('date', today)

        if (weekLogs) {
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          const progress = []
          
          for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateStr = d.toISOString().split('T')[0]
            const dayLogs = weekLogs.filter(log => log.date === dateStr)
            const totalCal = dayLogs.reduce((sum, log) => sum + (log.calories || 0), 0)
            
            progress.push({
              day: dayNames[d.getDay()],
              calories: totalCal,
              target: 2000
            })
          }
          
          setWeeklyProgress(progress)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [user?.id])

  const quickActions = [
    { icon: Apple, label: 'Log Meal', path: '/patient/diet-log', color: 'from-primary-500 to-primary-600' },
    { icon: Calendar, label: 'Book Appointment', path: '/patient/appointments', color: 'from-blue-500 to-blue-600' },
    { icon: MessageCircle, label: 'Chat', path: '/patient/chat', color: 'from-purple-500 to-purple-600' },
    { icon: Bot, label: 'AI Assistant', path: '/patient/ai-assistant', color: 'from-accent-500 to-accent-600' }
  ]

  const StatCard = ({ icon: Icon, label, current, goal, unit, color }) => {
    const percentage = Math.min((current / goal) * 100, 100)
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-bold text-white">{current}</span>
          <span className="text-gray-500 mb-1">/ {goal} {unit}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-full bg-gradient-to-r ${color} rounded-full`}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          {greeting}, {profile?.name || user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-gray-400">
          Here's your health overview for today. Keep up the great work!
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
      >
        {quickActions.map((action, i) => (
          <Link
            key={i}
            to={action.path}
            className="card group hover:border-primary-500/30 transition-all flex flex-col items-center p-4"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-white">{action.label}</span>
          </Link>
        ))}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatCard 
          icon={Flame} 
          label="Calories" 
          current={todayStats.calories.current} 
          goal={todayStats.calories.goal}
          unit="kcal"
          color="from-orange-500 to-red-500"
        />
        <StatCard 
          icon={Dumbbell} 
          label="Protein" 
          current={todayStats.protein.current} 
          goal={todayStats.protein.goal}
          unit="g"
          color="from-blue-500 to-indigo-500"
        />
        <StatCard 
          icon={Droplets} 
          label="Water" 
          current={todayStats.water.current} 
          goal={todayStats.water.goal}
          unit="glasses"
          color="from-cyan-500 to-blue-500"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Exercise" 
          current={todayStats.exercise.current} 
          goal={todayStats.exercise.goal}
          unit="min"
          color="from-green-500 to-emerald-500"
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-white">Weekly Progress</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-500" />
                Calories
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white/30" />
                Target
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgress}>
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="calories" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCalories)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="rgba(255,255,255,0.3)" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-white">Appointments</h2>
            <Link to="/patient/appointments" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1">
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((apt, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-primary-400 font-medium">{apt.date}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    apt.status === 'confirmed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {apt.status}
                  </span>
                </div>
                <p className="text-white font-medium">{apt.type}</p>
                <p className="text-sm text-gray-400">{apt.time}</p>
              </div>
            ))}
            <Link
              to="/patient/appointments"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-primary-500/50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Book New Appointment
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-white">Today's Meals</h2>
          <Link to="/patient/diet-log" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1">
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentMeals.map((meal, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary-500/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-500/20 text-primary-400">
                  {meal.meal}
                </span>
                <span className="text-xs text-gray-500">{meal.time}</span>
              </div>
              <p className="text-white font-medium mb-1">{meal.food}</p>
              <p className="text-sm text-gray-400">{meal.calories} kcal</p>
            </div>
          ))}
        </div>
        <Link
          to="/patient/diet-log"
          className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-primary-500/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log New Meal
        </Link>
      </motion.div>
    </div>
  )
}

export default PatientDashboard


