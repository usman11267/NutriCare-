import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown,
  Flame,
  Droplets,
  Apple,
  AlertCircle,
  CheckCircle2,
  Eye,
  MessageCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const Monitoring = () => {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock patient data with diet logs
  const patients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      goal: 'Weight Loss',
      calorieTarget: 1800,
      todayCalories: 1450,
      weeklyAvg: 1720,
      adherence: 92,
      status: 'on-track',
      weeklyData: [
        { day: 'Mon', calories: 1750, target: 1800 },
        { day: 'Tue', calories: 1680, target: 1800 },
        { day: 'Wed', calories: 1820, target: 1800 },
        { day: 'Thu', calories: 1700, target: 1800 },
        { day: 'Fri', calories: 1650, target: 1800 },
        { day: 'Sat', calories: 1900, target: 1800 },
        { day: 'Sun', calories: 1450, target: 1800 }
      ],
      todayMeals: [
        { meal: 'Breakfast', food: 'Oatmeal with berries', calories: 350, time: '8:00 AM' },
        { meal: 'Snack', food: 'Greek yogurt', calories: 150, time: '10:30 AM' },
        { meal: 'Lunch', food: 'Grilled chicken salad', calories: 450, time: '1:00 PM' },
        { meal: 'Snack', food: 'Apple & almonds', calories: 200, time: '4:00 PM' },
        { meal: 'Dinner', food: 'Not logged yet', calories: 0, time: '-' }
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'MC',
      goal: 'Diabetes Management',
      calorieTarget: 2000,
      todayCalories: 1850,
      weeklyAvg: 1950,
      adherence: 88,
      status: 'on-track',
      weeklyData: [
        { day: 'Mon', calories: 2050, target: 2000 },
        { day: 'Tue', calories: 1900, target: 2000 },
        { day: 'Wed', calories: 1980, target: 2000 },
        { day: 'Thu', calories: 1920, target: 2000 },
        { day: 'Fri', calories: 1850, target: 2000 },
        { day: 'Sat', calories: 2100, target: 2000 },
        { day: 'Sun', calories: 1850, target: 2000 }
      ],
      todayMeals: [
        { meal: 'Breakfast', food: 'Scrambled eggs with vegetables', calories: 400, time: '7:30 AM' },
        { meal: 'Lunch', food: 'Quinoa bowl with grilled salmon', calories: 550, time: '12:30 PM' },
        { meal: 'Snack', food: 'Mixed nuts', calories: 180, time: '3:00 PM' },
        { meal: 'Dinner', food: 'Steamed vegetables with tofu', calories: 420, time: '7:00 PM' }
      ]
    },
    {
      id: 3,
      name: 'Emily Davis',
      avatar: 'ED',
      goal: 'Muscle Gain',
      calorieTarget: 2400,
      todayCalories: 2200,
      weeklyAvg: 2350,
      adherence: 85,
      status: 'on-track',
      weeklyData: [
        { day: 'Mon', calories: 2500, target: 2400 },
        { day: 'Tue', calories: 2300, target: 2400 },
        { day: 'Wed', calories: 2400, target: 2400 },
        { day: 'Thu', calories: 2350, target: 2400 },
        { day: 'Fri', calories: 2200, target: 2400 },
        { day: 'Sat', calories: 2450, target: 2400 },
        { day: 'Sun', calories: 2200, target: 2400 }
      ],
      todayMeals: [
        { meal: 'Breakfast', food: 'Protein pancakes', calories: 550, time: '7:00 AM' },
        { meal: 'Snack', food: 'Protein shake', calories: 300, time: '10:00 AM' },
        { meal: 'Lunch', food: 'Chicken breast with rice', calories: 650, time: '1:00 PM' },
        { meal: 'Snack', food: 'Cottage cheese with fruits', calories: 250, time: '4:00 PM' }
      ]
    },
    {
      id: 4,
      name: 'James Wilson',
      avatar: 'JW',
      goal: 'Heart Health',
      calorieTarget: 1800,
      todayCalories: 0,
      weeklyAvg: 1650,
      adherence: 45,
      status: 'needs-attention',
      weeklyData: [
        { day: 'Mon', calories: 1700, target: 1800 },
        { day: 'Tue', calories: 1800, target: 1800 },
        { day: 'Wed', calories: 0, target: 1800 },
        { day: 'Thu', calories: 1900, target: 1800 },
        { day: 'Fri', calories: 0, target: 1800 },
        { day: 'Sat', calories: 1650, target: 1800 },
        { day: 'Sun', calories: 0, target: 1800 }
      ],
      todayMeals: []
    },
    {
      id: 5,
      name: 'Robert Brown',
      avatar: 'RB',
      goal: 'Weight Loss',
      calorieTarget: 1600,
      todayCalories: 0,
      weeklyAvg: 1200,
      adherence: 30,
      status: 'needs-attention',
      weeklyData: [
        { day: 'Mon', calories: 1500, target: 1600 },
        { day: 'Tue', calories: 0, target: 1600 },
        { day: 'Wed', calories: 1400, target: 1600 },
        { day: 'Thu', calories: 0, target: 1600 },
        { day: 'Fri', calories: 0, target: 1600 },
        { day: 'Sat', calories: 1300, target: 1600 },
        { day: 'Sun', calories: 0, target: 1600 }
      ],
      todayMeals: []
    }
  ]

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'bg-green-500/20 text-green-400'
      case 'needs-attention': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getAdherenceColor = (adherence) => {
    if (adherence >= 80) return 'text-green-400'
    if (adherence >= 60) return 'text-yellow-400'
    return 'text-red-400'
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
          Patient Monitoring 📊
        </h1>
        <p className="text-gray-400">
          Track and review your patients' daily diet logs and progress
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <div className="card py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{patients.filter(p => p.status === 'on-track').length}</p>
              <p className="text-sm text-gray-400">On Track</p>
            </div>
          </div>
        </div>
        <div className="card py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{patients.filter(p => p.status === 'needs-attention').length}</p>
              <p className="text-sm text-gray-400">Need Attention</p>
            </div>
          </div>
        </div>
        <div className="card py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Apple className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{patients.filter(p => p.todayCalories > 0).length}</p>
              <p className="text-sm text-gray-400">Logged Today</p>
            </div>
          </div>
        </div>
        <div className="card py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {Math.round(patients.reduce((acc, p) => acc + p.adherence, 0) / patients.length)}%
              </p>
              <p className="text-sm text-gray-400">Avg Adherence</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1 card max-h-[600px] overflow-y-auto"
        >
          <h2 className="font-display text-lg font-bold text-white mb-4 sticky top-0 bg-neutral-850 pb-4">
            Patients
          </h2>
          <div className="space-y-3">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedPatient?.id === patient.id 
                    ? 'bg-primary-500/20 border border-primary-500/50' 
                    : 'bg-white/5 border border-transparent hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{patient.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{patient.name}</p>
                    <p className="text-xs text-gray-400">{patient.goal}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Today: {patient.todayCalories} / {patient.calorieTarget} kcal</span>
                  <span className={getAdherenceColor(patient.adherence)}>{patient.adherence}%</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Patient Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {selectedPatient ? (
            <>
              {/* Weekly Chart */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-bold text-white">
                    {selectedPatient.name}'s Weekly Progress
                  </h2>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-sm text-gray-400">Daily Target</p>
                    <p className="text-xl font-bold text-white">{selectedPatient.calorieTarget} kcal</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-sm text-gray-400">Weekly Average</p>
                    <p className="text-xl font-bold text-white">{selectedPatient.weeklyAvg} kcal</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-sm text-gray-400">Adherence</p>
                    <p className={`text-xl font-bold ${getAdherenceColor(selectedPatient.adherence)}`}>
                      {selectedPatient.adherence}%
                    </p>
                  </div>
                </div>

                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedPatient.weeklyData}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} domain={['dataMin - 200', 'dataMax + 200']} />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#1f2937', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="rgba(255,255,255,0.3)" 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="calories" 
                        stroke="#22c55e" 
                        strokeWidth={3}
                        dot={{ fill: '#22c55e', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Today's Meals */}
              <div className="card">
                <h2 className="font-display text-lg font-bold text-white mb-4">Today's Diet Log</h2>
                {selectedPatient.todayMeals.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPatient.todayMeals.map((meal, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 rounded-lg bg-primary-500/20 text-primary-400 text-xs font-medium">
                            {meal.meal}
                          </span>
                          <div>
                            <p className="text-white">{meal.food}</p>
                            <p className="text-xs text-gray-500">{meal.time}</p>
                          </div>
                        </div>
                        <span className="text-white font-medium">{meal.calories} kcal</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="font-medium text-gray-400">Total</span>
                      <span className="text-xl font-bold text-gradient">
                        {selectedPatient.todayCalories} / {selectedPatient.calorieTarget} kcal
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-400">No meals logged today</p>
                    <button className="mt-4 text-primary-400 hover:text-primary-300 text-sm flex items-center gap-2 mx-auto">
                      <MessageCircle className="w-4 h-4" />
                      Send reminder
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="card h-96 flex items-center justify-center">
              <div className="text-center">
                <Eye className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select a patient to view their diet logs</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Monitoring


