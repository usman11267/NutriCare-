import express from 'express'
import { generateAIResponse, getBMIAdvice } from '../config/gemini.js'
import { verifyToken, isPatient } from '../middleware/auth.js'
import { db } from '../config/supabase.js'

const router = express.Router()

// Chat with AI assistant (Patient only)
router.post('/chat', verifyToken, isPatient, async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Get user context
    const { data: profile } = await db.getUserById(req.user.id)
    
    // Get recent diet logs for context
    const today = new Date().toISOString().split('T')[0]
    const { data: recentLogs } = await db.getDietLogsByPatient(req.user.id, today)

    const context = {
      goal: profile?.goal,
      bmi: profile?.weight && profile?.height 
        ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
        : null,
      recentMeals: recentLogs?.slice(0, 5).map(log => log.food)
    }

    const result = await generateAIResponse(message, context)

    if (!result.success) {
      return res.json({
        response: result.fallback || 'I apologize, but I\'m having trouble processing your request. Please try again.',
        source: 'fallback'
      })
    }

    res.json({
      response: result.response,
      source: 'ai'
    })
  } catch (error) {
    console.error('AI Chat error:', error)
    res.status(500).json({ error: 'Failed to process AI request' })
  }
})

// Get BMI-based advice
router.post('/bmi-advice', async (req, res) => {
  try {
    const { weight, height } = req.body

    if (!weight || !height) {
      return res.status(400).json({ error: 'Weight and height are required' })
    }

    const weightNum = parseFloat(weight)
    const heightNum = parseFloat(height)

    if (isNaN(weightNum) || isNaN(heightNum)) {
      return res.status(400).json({ error: 'Invalid weight or height values' })
    }

    if (weightNum < 20 || weightNum > 500 || heightNum < 100 || heightNum > 250) {
      return res.status(400).json({ error: 'Please enter realistic weight and height values' })
    }

    const bmi = (weightNum / Math.pow(heightNum / 100, 2)).toFixed(1)
    const result = await getBMIAdvice(parseFloat(bmi), weightNum, heightNum)

    res.json({
      bmi: result.bmi,
      category: result.category,
      advice: result.success ? result.advice : getDefaultBMIAdvice(result.category)
    })
  } catch (error) {
    console.error('BMI Advice error:', error)
    res.status(500).json({ error: 'Failed to generate BMI advice' })
  }
})

// Quick nutrition question (no auth required)
router.post('/quick-question', async (req, res) => {
  try {
    const { question } = req.body

    if (!question) {
      return res.status(400).json({ error: 'Question is required' })
    }

    // Rate limit quick questions (in production, use proper rate limiting)
    const result = await generateAIResponse(question)

    res.json({
      question,
      response: result.success ? result.response : result.fallback
    })
  } catch (error) {
    console.error('Quick question error:', error)
    res.status(500).json({ error: 'Failed to process question' })
  }
})

// Food nutrition info
router.get('/nutrition/:food', async (req, res) => {
  try {
    const { food } = req.params

    const prompt = `Provide brief nutritional information for "${food}". Include approximate calories per 100g, key nutrients, and health benefits. Keep it concise.`
    
    const result = await generateAIResponse(prompt)

    res.json({
      food,
      info: result.success ? result.response : `Nutritional information for ${food} is currently unavailable.`
    })
  } catch (error) {
    console.error('Nutrition info error:', error)
    res.status(500).json({ error: 'Failed to fetch nutrition information' })
  }
})

// Helper function for default BMI advice
function getDefaultBMIAdvice(category) {
  const advice = {
    'Underweight': 'Your BMI suggests you may be underweight. Consider consulting a healthcare provider to discuss healthy ways to gain weight through nutrient-dense foods and balanced meals.',
    'Normal weight': 'Great news! Your BMI is in the healthy range. Continue maintaining a balanced diet rich in fruits, vegetables, whole grains, and lean proteins.',
    'Overweight': 'Your BMI suggests you may be slightly overweight. Small lifestyle changes like increasing physical activity and focusing on whole foods can help you reach a healthier weight.',
    'Obese': 'Your BMI indicates it may be beneficial to focus on your health. Consider consulting with a healthcare provider and dietitian who can create a personalized plan to help you achieve your health goals.'
  }
  return advice[category] || 'Please consult with a healthcare provider for personalized advice.'
}

export default router


