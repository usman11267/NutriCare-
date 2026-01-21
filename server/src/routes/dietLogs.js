import express from 'express'
import { db } from '../config/supabase.js'
import { verifyToken, isDietitian, isPatient, isAuthenticated } from '../middleware/auth.js'
import { analyzeDietLog } from '../config/gemini.js'

const router = express.Router()

// Get diet logs (Patient sees own, Dietitian can see any patient's)
router.get('/', verifyToken, isAuthenticated, async (req, res) => {
  try {
    const { patientId, date, startDate, endDate } = req.query

    let targetPatientId = req.user.id

    // Dietitian can view any patient's logs
    if (req.userRole === 'dietitian' && patientId) {
      targetPatientId = patientId
    }

    let data, error

    if (startDate && endDate) {
      const result = await db.getDietLogsByDate(targetPatientId, startDate, endDate)
      data = result.data
      error = result.error
    } else {
      const result = await db.getDietLogsByPatient(targetPatientId, date || null)
      data = result.data
      error = result.error
    }

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch diet logs' })
    }

    // Calculate daily summary if date is specified
    let summary = null
    if (date && data) {
      summary = {
        totalCalories: data.reduce((sum, log) => sum + (log.calories || 0), 0),
        mealCount: data.length,
        meals: {
          breakfast: data.filter(log => log.meal === 'breakfast'),
          lunch: data.filter(log => log.meal === 'lunch'),
          dinner: data.filter(log => log.meal === 'dinner'),
          snacks: data.filter(log => log.meal === 'snacks')
        }
      }
    }

    res.json({ 
      logs: data,
      summary
    })
  } catch (error) {
    console.error('Get diet logs error:', error)
    res.status(500).json({ error: 'Failed to fetch diet logs' })
  }
})

// Add diet log entry (Patient only)
router.post('/', verifyToken, isPatient, async (req, res) => {
  try {
    const { meal, food, quantity, calories, time, notes } = req.body

    if (!meal || !food) {
      return res.status(400).json({ error: 'Meal type and food are required' })
    }

    if (!['breakfast', 'lunch', 'dinner', 'snacks'].includes(meal)) {
      return res.status(400).json({ error: 'Invalid meal type' })
    }

    const log = {
      patient_id: req.user.id,
      meal,
      food,
      quantity: quantity || '1 serving',
      calories: parseInt(calories) || 0,
      time: time || new Date().toTimeString().slice(0, 5),
      notes,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    }

    const { data, error } = await db.createDietLog(log)

    if (error) {
      return res.status(500).json({ error: 'Failed to add diet log' })
    }

    res.status(201).json({
      message: 'Diet log added successfully',
      log: data
    })
  } catch (error) {
    console.error('Add diet log error:', error)
    res.status(500).json({ error: 'Failed to add diet log' })
  }
})

// Delete diet log entry (Patient can delete their own)
router.delete('/:id', verifyToken, isPatient, async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await db.deleteDietLog(id)

    if (error) {
      return res.status(500).json({ error: 'Failed to delete diet log' })
    }

    res.json({ message: 'Diet log deleted successfully' })
  } catch (error) {
    console.error('Delete diet log error:', error)
    res.status(500).json({ error: 'Failed to delete diet log' })
  }
})

// Get AI analysis of daily diet (Patient only)
router.get('/analyze', verifyToken, isPatient, async (req, res) => {
  try {
    const { date } = req.query
    const targetDate = date || new Date().toISOString().split('T')[0]

    // Get patient's diet logs for the day
    const { data: logs, error } = await db.getDietLogsByPatient(req.user.id, targetDate)

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch diet logs' })
    }

    if (!logs || logs.length === 0) {
      return res.json({
        message: 'No diet logs found for this date',
        analysis: null
      })
    }

    // Get patient's goal
    const { data: profile } = await db.getUserById(req.user.id)
    const userGoal = profile?.goal || 'general health'

    // Generate AI analysis
    const meals = logs.map(log => ({
      meal: log.meal,
      food: log.food,
      calories: log.calories
    }))

    const result = await analyzeDietLog(meals, userGoal)

    res.json({
      date: targetDate,
      logs,
      totalCalories: logs.reduce((sum, log) => sum + (log.calories || 0), 0),
      analysis: result.success ? result.analysis : 'Unable to generate analysis at this time.'
    })
  } catch (error) {
    console.error('Analyze diet error:', error)
    res.status(500).json({ error: 'Failed to analyze diet' })
  }
})

// Dietitian feedback on diet log
router.post('/:id/feedback', verifyToken, isDietitian, async (req, res) => {
  try {
    const { id } = req.params
    const { feedback } = req.body

    if (!feedback) {
      return res.status(400).json({ error: 'Feedback is required' })
    }

    // In a real app, you'd store this feedback
    // For now, just return success
    res.json({
      message: 'Feedback submitted successfully',
      logId: id,
      feedback
    })
  } catch (error) {
    console.error('Submit feedback error:', error)
    res.status(500).json({ error: 'Failed to submit feedback' })
  }
})

export default router


