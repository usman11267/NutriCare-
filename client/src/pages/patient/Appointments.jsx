import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  CalendarCheck
} from 'lucide-react'
import { supabase } from '../../config/supabase'
import { useAuthStore } from '../../store/authStore'

const Appointments = () => {
  const { user } = useAuthStore()
  const [step, setStep] = useState(1) // 1: date, 2: time, 3: confirm
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [showBooking, setShowBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [existingAppointments, setExistingAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  const currentMonth = new Date()
  const [viewMonth, setViewMonth] = useState(currentMonth)

  // Fetch appointments from Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', user.id)
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true })

        if (error) throw error
        setExistingAppointments(data || [])
      } catch (error) {
        console.error('Error fetching appointments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [user?.id])

  const availableTimeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'
  ]

  const bookedSlots = ['10:00 AM', '2:30 PM'] // Mock booked slots

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const isDatePast = (day) => {
    if (!day) return true
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isWeekend = (day) => {
    if (!day) return false
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day)
    return date.getDay() === 0 || date.getDay() === 6
  }

  const handleBookAppointment = async () => {
    if (!user?.id || !selectedDate || !selectedTime) return

    const appointmentDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), selectedDate)
    const dateString = appointmentDate.toISOString().split('T')[0]

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: user.id,
          date: dateString,
          time: selectedTime,
          type: 'Consultation',
          status: 'pending',
          mode: 'video'
        }])
        .select()
        .single()

      if (error) throw error

      setExistingAppointments(prev => [...prev, data])
      setBookingSuccess(true)
      setTimeout(() => {
        setShowBooking(false)
        setStep(1)
        setSelectedDate(null)
        setSelectedTime(null)
        setBookingSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Error booking appointment:', error)
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)

      if (error) throw error

      setExistingAppointments(prev => 
        prev.filter(apt => apt.id !== appointmentId)
      )
    } catch (error) {
      console.error('Error cancelling appointment:', error)
    }
  }

  const getSelectedDateString = () => {
    if (!selectedDate) return ''
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), selectedDate)
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
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
          Schedule consultations with your dietitian
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-white">Upcoming Appointments</h2>
            <button
              onClick={() => setShowBooking(true)}
              className="btn-primary flex items-center gap-2 text-sm py-2"
            >
              <Calendar className="w-4 h-4" />
              Book New
            </button>
          </div>

          {existingAppointments.length > 0 ? (
            <div className="space-y-4">
              {existingAppointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary-500/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex flex-col items-center justify-center">
                        <span className="text-xs text-primary-400 font-medium">
                          {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-xl font-bold text-white">
                          {new Date(apt.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">{apt.type}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {apt.time}
                          </span>
                          <span className="flex items-center gap-1">
                            {apt.mode === 'video' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                            {apt.mode === 'video' ? 'Video Call' : 'In-person'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {apt.status}
                      </span>
                      <button 
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No upcoming appointments</p>
              <button
                onClick={() => setShowBooking(true)}
                className="mt-4 text-primary-400 hover:text-primary-300"
              >
                Book your first appointment
              </button>
            </div>
          )}
        </motion.div>

        {/* Dietitian Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="font-display text-xl font-bold text-white mb-6">Your Dietitian</h2>
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">SM</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white">Dr. Sarah Mitchell</h3>
            <p className="text-sm text-gray-400 mb-4">Clinical Dietitian</p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center justify-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                Available: Mon-Fri, 9AM-5PM
              </p>
              <p className="flex items-center justify-center gap-2 text-gray-400">
                <Video className="w-4 h-4" />
                Video & In-person
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBooking(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg card"
              onClick={(e) => e.stopPropagation()}
            >
              {bookingSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CalendarCheck className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Appointment Booked!</h3>
                  <p className="text-gray-400">
                    Your appointment has been scheduled successfully. You'll receive a confirmation email shortly.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold text-white">
                      Book Appointment
                    </h2>
                    <button
                      onClick={() => setShowBooking(false)}
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Step Indicator */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {['Date', 'Time', 'Confirm'].map((label, i) => (
                      <div key={i} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          step > i + 1 ? 'bg-primary-500 text-white' :
                          step === i + 1 ? 'bg-primary-500/20 text-primary-400 border-2 border-primary-500' :
                          'bg-white/10 text-gray-500'
                        }`}>
                          {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                        </div>
                        {i < 2 && (
                          <div className={`w-12 h-0.5 ${step > i + 1 ? 'bg-primary-500' : 'bg-white/10'}`} />
                        )}
                      </div>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {/* Step 1: Select Date */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1))}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <h3 className="font-medium text-white">{formatDate(viewMonth)}</h3>
                          <button
                            onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1))}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-4">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-center text-xs text-gray-500 py-2">
                              {day}
                            </div>
                          ))}
                          {getDaysInMonth(viewMonth).map((day, i) => (
                            <button
                              key={i}
                              onClick={() => day && !isDatePast(day) && !isWeekend(day) && setSelectedDate(day)}
                              disabled={!day || isDatePast(day) || isWeekend(day)}
                              className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors ${
                                !day ? '' :
                                selectedDate === day ? 'bg-primary-500 text-white' :
                                isDatePast(day) || isWeekend(day) ? 'text-gray-600 cursor-not-allowed' :
                                'hover:bg-white/10 text-white'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setStep(2)}
                          disabled={!selectedDate}
                          className="w-full btn-primary"
                        >
                          Continue
                        </button>
                      </motion.div>
                    )}

                    {/* Step 2: Select Time */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <p className="text-gray-400 text-sm mb-4">
                          Available times for {getSelectedDateString()}
                        </p>
                        <div className="grid grid-cols-3 gap-2 mb-6">
                          {availableTimeSlots.map((time) => {
                            const isBooked = bookedSlots.includes(time)
                            return (
                              <button
                                key={time}
                                onClick={() => !isBooked && setSelectedTime(time)}
                                disabled={isBooked}
                                className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                                  selectedTime === time ? 'bg-primary-500 text-white' :
                                  isBooked ? 'bg-white/5 text-gray-600 cursor-not-allowed line-through' :
                                  'bg-white/5 text-white hover:bg-white/10'
                                }`}
                              >
                                {time}
                              </button>
                            )
                          })}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setStep(1)}
                            className="flex-1 btn-secondary"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => setStep(3)}
                            disabled={!selectedTime}
                            className="flex-1 btn-primary"
                          >
                            Continue
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Confirm */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="p-4 rounded-xl bg-white/5 mb-6">
                          <h4 className="font-medium text-white mb-4">Appointment Details</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Date</span>
                              <span className="text-white">{getSelectedDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Time</span>
                              <span className="text-white">{selectedTime}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Dietitian</span>
                              <span className="text-white">Dr. Sarah Mitchell</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Type</span>
                              <span className="text-white">Video Consultation</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setStep(2)}
                            className="flex-1 btn-secondary"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleBookAppointment}
                            className="flex-1 btn-primary flex items-center justify-center gap-2"
                          >
                            <Check className="w-5 h-5" />
                            Confirm Booking
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Appointments


