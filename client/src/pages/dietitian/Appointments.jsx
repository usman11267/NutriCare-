import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  MoreVertical
} from 'lucide-react'

const DietitianAppointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDetails, setShowDetails] = useState(null)

  // Mock appointments
  const appointments = [
    { 
      id: 1, 
      patientName: 'Sarah Johnson', 
      patientAvatar: 'SJ',
      date: '2026-01-21', 
      time: '9:00 AM', 
      duration: 30,
      type: 'Follow-up Session', 
      status: 'confirmed',
      mode: 'video',
      notes: 'Discuss weekly progress and adjust meal plan'
    },
    { 
      id: 2, 
      patientName: 'Michael Chen', 
      patientAvatar: 'MC',
      date: '2026-01-21', 
      time: '10:30 AM', 
      duration: 60,
      type: 'Initial Consultation', 
      status: 'confirmed',
      mode: 'video',
      notes: 'New patient - diabetes management focus'
    },
    { 
      id: 3, 
      patientName: 'Emily Davis', 
      patientAvatar: 'ED',
      date: '2026-01-21', 
      time: '12:00 PM', 
      duration: 30,
      type: 'Progress Review', 
      status: 'pending',
      mode: 'in-person',
      notes: 'Monthly review of muscle gain progress'
    },
    { 
      id: 4, 
      patientName: 'James Wilson', 
      patientAvatar: 'JW',
      date: '2026-01-21', 
      time: '2:00 PM', 
      duration: 45,
      type: 'Meal Plan Review', 
      status: 'confirmed',
      mode: 'video',
      notes: 'Heart-healthy diet adjustments'
    },
    { 
      id: 5, 
      patientName: 'Amanda Foster', 
      patientAvatar: 'AF',
      date: '2026-01-21', 
      time: '3:30 PM', 
      duration: 30,
      type: 'Follow-up', 
      status: 'confirmed',
      mode: 'video',
      notes: 'Pre-marathon nutrition check'
    },
    { 
      id: 6, 
      patientName: 'Robert Brown', 
      patientAvatar: 'RB',
      date: '2026-01-22', 
      time: '10:00 AM', 
      duration: 60,
      type: 'Initial Consultation', 
      status: 'pending',
      mode: 'in-person',
      notes: 'First meeting - weight loss goals'
    }
  ]

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0]
  }

  const todayAppointments = appointments.filter(apt => apt.date === formatDateKey(selectedDate))

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getWeekDates = (date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const weekDates = getWeekDates(selectedDate)

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + (direction * 7))
    setSelectedDate(newDate)
  }

  const getAppointmentCount = (date) => {
    return appointments.filter(apt => apt.date === formatDateKey(date)).length
  }

  const handleApprove = (id) => {
    console.log('Approved appointment:', id)
    setShowDetails(null)
  }

  const handleReject = (id) => {
    console.log('Rejected appointment:', id)
    setShowDetails(null)
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
          Appointments 📅
        </h1>
        <p className="text-gray-400">
          Manage your schedule and patient appointments
        </p>
      </motion.div>

      {/* Week Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-display text-lg font-bold text-white">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, i) => {
            const isSelected = formatDateKey(date) === formatDateKey(selectedDate)
            const isToday = formatDateKey(date) === formatDateKey(new Date())
            const aptCount = getAppointmentCount(date)
            
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  isSelected 
                    ? 'bg-primary-500 text-white' 
                    : isToday
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'hover:bg-white/10 text-gray-400'
                }`}
              >
                <span className="text-xs font-medium mb-1">{weekDays[i]}</span>
                <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-white'}`}>
                  {date.getDate()}
                </span>
                {aptCount > 0 && (
                  <span className={`mt-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                    isSelected ? 'bg-white/20' : 'bg-primary-500/20 text-primary-400'
                  }`}>
                    {aptCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Appointments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-white">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium">
            {todayAppointments.length} appointments
          </span>
        </div>

        {todayAppointments.length > 0 ? (
          <div className="space-y-4">
            {todayAppointments.map((apt) => (
              <motion.div
                key={apt.id}
                layout
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary-500/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">{apt.patientAvatar}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">{apt.patientName}</h3>
                      <p className="text-sm text-gray-400 mb-2">{apt.type}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {apt.time} ({apt.duration} min)
                        </span>
                        <span className="flex items-center gap-1">
                          {apt.mode === 'video' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                          {apt.mode === 'video' ? 'Video Call' : 'In-person'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'confirmed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {apt.status}
                    </span>
                    <button 
                      onClick={() => setShowDetails(showDetails === apt.id ? null : apt.id)}
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showDetails === apt.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-1">Notes:</p>
                        <p className="text-white">{apt.notes}</p>
                      </div>
                      <div className="flex gap-3">
                        {apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(apt.id)}
                              className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(apt.id)}
                              className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && apt.mode === 'video' && (
                          <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                            <Video className="w-4 h-4" />
                            Start Video Call
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No appointments scheduled for this day</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default DietitianAppointments


