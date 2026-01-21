import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  MessageCircle, 
  Calendar,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Eye,
  Mail
} from 'lucide-react'

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState(null)

  // Mock patient data
  const patients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      avatar: 'SJ',
      age: 32,
      goal: 'Weight Loss',
      startWeight: 78,
      currentWeight: 72,
      targetWeight: 65,
      bmi: 24.8,
      status: 'active',
      progress: 'on-track',
      lastActivity: '2 hours ago',
      joinedDate: '2025-10-15',
      nextAppointment: '2026-01-25'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      avatar: 'MC',
      age: 45,
      goal: 'Diabetes Management',
      startWeight: 92,
      currentWeight: 88,
      targetWeight: 82,
      bmi: 28.4,
      status: 'active',
      progress: 'excellent',
      lastActivity: '5 hours ago',
      joinedDate: '2025-09-01',
      nextAppointment: '2026-01-28'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      avatar: 'ED',
      age: 28,
      goal: 'Muscle Gain',
      startWeight: 55,
      currentWeight: 58,
      targetWeight: 62,
      bmi: 21.5,
      status: 'active',
      progress: 'on-track',
      lastActivity: '1 day ago',
      joinedDate: '2025-11-20',
      nextAppointment: '2026-02-01'
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.w@email.com',
      avatar: 'JW',
      age: 52,
      goal: 'Heart Health',
      startWeight: 95,
      currentWeight: 94,
      targetWeight: 85,
      bmi: 29.1,
      status: 'active',
      progress: 'needs-attention',
      lastActivity: '3 days ago',
      joinedDate: '2025-12-01',
      nextAppointment: null
    },
    {
      id: 5,
      name: 'Amanda Foster',
      email: 'amanda.f@email.com',
      avatar: 'AF',
      age: 35,
      goal: 'Sports Nutrition',
      startWeight: 62,
      currentWeight: 60,
      targetWeight: 58,
      bmi: 22.3,
      status: 'active',
      progress: 'excellent',
      lastActivity: '30 min ago',
      joinedDate: '2025-08-15',
      nextAppointment: '2026-01-22'
    },
    {
      id: 6,
      name: 'Robert Brown',
      email: 'robert.b@email.com',
      avatar: 'RB',
      age: 41,
      goal: 'Weight Loss',
      startWeight: 105,
      currentWeight: 103,
      targetWeight: 90,
      bmi: 32.1,
      status: 'inactive',
      progress: 'needs-attention',
      lastActivity: '5 days ago',
      joinedDate: '2025-11-01',
      nextAppointment: null
    }
  ]

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getProgressColor = (progress) => {
    switch (progress) {
      case 'excellent': return 'bg-green-500/20 text-green-400'
      case 'on-track': return 'bg-blue-500/20 text-blue-400'
      case 'needs-attention': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getWeightChange = (patient) => {
    const change = patient.startWeight - patient.currentWeight
    const isLoss = patient.goal.toLowerCase().includes('loss')
    const isPositive = isLoss ? change > 0 : change < 0
    return { value: Math.abs(change), isPositive }
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
          Patients 👥
        </h1>
        <p className="text-gray-400">
          Manage and monitor your patients' progress
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field pl-10 pr-10 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
      >
        <div className="card py-4">
          <p className="text-2xl font-bold text-white">{patients.length}</p>
          <p className="text-sm text-gray-400">Total Patients</p>
        </div>
        <div className="card py-4">
          <p className="text-2xl font-bold text-green-400">{patients.filter(p => p.status === 'active').length}</p>
          <p className="text-sm text-gray-400">Active</p>
        </div>
        <div className="card py-4">
          <p className="text-2xl font-bold text-blue-400">{patients.filter(p => p.progress === 'excellent').length}</p>
          <p className="text-sm text-gray-400">Excellent Progress</p>
        </div>
        <div className="card py-4">
          <p className="text-2xl font-bold text-yellow-400">{patients.filter(p => p.progress === 'needs-attention').length}</p>
          <p className="text-sm text-gray-400">Need Attention</p>
        </div>
      </motion.div>

      {/* Patient List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-gray-400">Patient</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Goal</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Progress</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Weight</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">BMI</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Last Active</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, i) => {
                const weightChange = getWeightChange(patient)
                return (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{patient.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300">{patient.goal}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getProgressColor(patient.progress)}`}>
                        {patient.progress.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white">{patient.currentWeight} kg</span>
                        <span className={`flex items-center text-xs ${weightChange.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {weightChange.isPositive ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                          {weightChange.value} kg
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`${
                        patient.bmi < 18.5 ? 'text-blue-400' :
                        patient.bmi < 25 ? 'text-green-400' :
                        patient.bmi < 30 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {patient.bmi}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400 text-sm">{patient.lastActivity}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No patients found matching your criteria</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Patients


