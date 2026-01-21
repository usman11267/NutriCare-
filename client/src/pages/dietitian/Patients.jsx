import { useState, useEffect } from 'react'
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
  Mail,
  Loader2
} from 'lucide-react'
import { supabase } from '../../config/supabase'

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'patient')
          .order('created_at', { ascending: false })

        if (error) throw error

        // Process patients with calculated fields
        const processedPatients = data.map(patient => {
          const bmi = patient.weight && patient.height 
            ? (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)
            : null
          
          const initials = patient.name
            ? patient.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : 'NA'

          // Calculate days since last update
          const lastUpdate = new Date(patient.updated_at || patient.created_at)
          const now = new Date()
          const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24))
          
          let status = 'active'
          let progress = 'on-track'
          
          if (daysSinceUpdate > 7) {
            status = 'inactive'
            progress = 'needs-attention'
          } else if (daysSinceUpdate < 2) {
            progress = 'excellent'
          }

          return {
            id: patient.id,
            name: patient.name || 'Unknown',
            email: patient.email,
            phone: patient.phone,
            avatar: initials,
            age: patient.date_of_birth ? calculateAge(patient.date_of_birth) : null,
            goal: patient.goal || 'Not set',
            startWeight: patient.weight || 0,
            currentWeight: patient.weight || 0,
            targetWeight: patient.weight ? patient.weight - 5 : 0,
            bmi: bmi ? parseFloat(bmi) : null,
            status,
            progress,
            lastActivity: formatTimeAgo(patient.updated_at || patient.created_at),
            joinedDate: patient.created_at,
            nextAppointment: null
          }
        })

        setPatients(processedPatients)
      } catch (error) {
        console.error('Error fetching patients:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const calculateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return `${Math.floor(diffMins / 1440)} days ago`
  }

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
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary-400" />
                <span className="text-gray-400">Loading patients...</span>
              </div>
            ) : (
              <p className="text-gray-400">No patients found matching your criteria</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Patients


