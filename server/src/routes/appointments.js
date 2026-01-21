import express from 'express'
import { db } from '../config/supabase.js'
import { verifyToken, isDietitian, isPatient, isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

// Get appointments (different views for patient vs dietitian)
router.get('/', verifyToken, isAuthenticated, async (req, res) => {
  try {
    const { date } = req.query

    if (req.userRole === 'dietitian') {
      // Dietitian sees all appointments
      if (date) {
        const { data, error } = await db.getAppointmentsByDate(date)
        if (error) throw error
        return res.json({ appointments: data })
      }
      // Return today's appointments by default
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await db.getAppointmentsByDate(today)
      if (error) throw error
      return res.json({ appointments: data })
    } else {
      // Patient sees only their appointments
      const { data, error } = await db.getAppointmentsByPatient(req.user.id)
      if (error) throw error
      return res.json({ appointments: data })
    }
  } catch (error) {
    console.error('Get appointments error:', error)
    res.status(500).json({ error: 'Failed to fetch appointments' })
  }
})

// Create appointment (Patient books)
router.post('/', verifyToken, isPatient, async (req, res) => {
  try {
    const { date, time, type, mode = 'video', notes } = req.body

    if (!date || !time) {
      return res.status(400).json({ error: 'Date and time are required' })
    }

    // Check for conflicting appointments
    const { data: existing } = await db.getAppointmentsByDate(date)
    const conflict = existing?.find(apt => 
      apt.time === time && apt.status !== 'cancelled'
    )

    if (conflict) {
      return res.status(400).json({ error: 'This time slot is already booked' })
    }

    const appointment = {
      patient_id: req.user.id,
      date,
      time,
      type: type || 'Consultation',
      mode,
      notes,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    const { data, error } = await db.createAppointment(appointment)

    if (error) {
      return res.status(500).json({ error: 'Failed to create appointment' })
    }

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: data
    })
  } catch (error) {
    console.error('Create appointment error:', error)
    res.status(500).json({ error: 'Failed to create appointment' })
  }
})

// Update appointment status (Dietitian approves/rejects)
router.patch('/:id', verifyToken, isDietitian, async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const updates = {
      status,
      updated_at: new Date().toISOString()
    }
    if (notes) updates.notes = notes

    const { data, error } = await db.updateAppointment(id, updates)

    if (error) {
      return res.status(500).json({ error: 'Failed to update appointment' })
    }

    res.json({
      message: 'Appointment updated successfully',
      appointment: data
    })
  } catch (error) {
    console.error('Update appointment error:', error)
    res.status(500).json({ error: 'Failed to update appointment' })
  }
})

// Cancel appointment (Patient can cancel their own)
router.delete('/:id', verifyToken, isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params

    // For patients, verify they own the appointment
    if (req.userRole === 'patient') {
      const { data: appointments } = await db.getAppointmentsByPatient(req.user.id)
      const appointment = appointments?.find(apt => apt.id === id)
      
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' })
      }
    }

    const { error } = await db.updateAppointment(id, { 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })

    if (error) {
      return res.status(500).json({ error: 'Failed to cancel appointment' })
    }

    res.json({ message: 'Appointment cancelled successfully' })
  } catch (error) {
    console.error('Cancel appointment error:', error)
    res.status(500).json({ error: 'Failed to cancel appointment' })
  }
})

// Get available time slots
router.get('/available-slots', async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ error: 'Date is required' })
    }

    // Define available time slots
    const allSlots = [
      '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
    ]

    // Get booked appointments for the date
    const { data: booked } = await db.getAppointmentsByDate(date)
    const bookedTimes = booked?.filter(apt => apt.status !== 'cancelled').map(apt => apt.time) || []

    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot))

    res.json({ 
      date,
      availableSlots,
      bookedSlots: bookedTimes
    })
  } catch (error) {
    console.error('Get slots error:', error)
    res.status(500).json({ error: 'Failed to fetch available slots' })
  }
})

export default router


