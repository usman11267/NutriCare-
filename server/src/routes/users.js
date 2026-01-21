import express from 'express'
import { db } from '../config/supabase.js'
import { verifyToken, isDietitian, isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

// Get all patients (Dietitian only)
router.get('/patients', verifyToken, isDietitian, async (req, res) => {
  try {
    const { data, error } = await db.getAllPatients()

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch patients' })
    }

    res.json({ patients: data })
  } catch (error) {
    console.error('Get patients error:', error)
    res.status(500).json({ error: 'Failed to fetch patients' })
  }
})

// Get single patient details (Dietitian only)
router.get('/patients/:id', verifyToken, isDietitian, async (req, res) => {
  try {
    const { id } = req.params
    const { data: patient, error } = await db.getUserById(id)

    if (error || !patient) {
      return res.status(404).json({ error: 'Patient not found' })
    }

    if (patient.role !== 'patient') {
      return res.status(400).json({ error: 'User is not a patient' })
    }

    // Get patient's diet logs
    const { data: dietLogs } = await db.getDietLogsByPatient(id)

    // Get patient's appointments
    const { data: appointments } = await db.getAppointmentsByPatient(id)

    res.json({
      patient: {
        ...patient,
        dietLogs: dietLogs || [],
        appointments: appointments || []
      }
    })
  } catch (error) {
    console.error('Get patient error:', error)
    res.status(500).json({ error: 'Failed to fetch patient details' })
  }
})

// Update user profile
router.patch('/profile', verifyToken, isAuthenticated, async (req, res) => {
  try {
    const { name, phone, dateOfBirth, height, weight, goal } = req.body

    const updates = {}
    if (name) updates.name = name
    if (phone) updates.phone = phone
    if (dateOfBirth) updates.date_of_birth = dateOfBirth
    if (height) updates.height = height
    if (weight) updates.weight = weight
    if (goal) updates.goal = goal
    updates.updated_at = new Date().toISOString()

    const { data, error } = await db.updateUser(req.user.id, updates)

    if (error) {
      return res.status(500).json({ error: 'Failed to update profile' })
    }

    res.json({
      message: 'Profile updated successfully',
      profile: data
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Get patient statistics (Dietitian only)
router.get('/patients/:id/stats', verifyToken, isDietitian, async (req, res) => {
  try {
    const { id } = req.params
    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const { data: weeklyLogs, error } = await db.getDietLogsByDate(id, weekAgo, today)

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch statistics' })
    }

    // Calculate statistics
    const stats = {
      totalLogs: weeklyLogs.length,
      averageCalories: weeklyLogs.length > 0 
        ? Math.round(weeklyLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / weeklyLogs.length)
        : 0,
      daysLogged: [...new Set(weeklyLogs.map(log => log.date))].length,
      adherenceRate: Math.round((weeklyLogs.length / 7) * 100)
    }

    res.json({ stats })
  } catch (error) {
    console.error('Get patient stats error:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

export default router


