import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-api-key')

// Nutrition-focused system prompt
const SYSTEM_PROMPT = `You are a helpful and knowledgeable AI nutrition assistant for NutriCare, a dietitian consultation platform. Your role is to:

1. Provide general diet and nutrition advice
2. Suggest healthy food alternatives
3. Explain nutritional concepts in simple terms
4. Offer motivation and encouragement for healthy eating habits
5. Give BMI-based general recommendations

IMPORTANT RULES:
- Never diagnose medical conditions
- Always recommend consulting a healthcare provider for medical concerns
- Provide evidence-based nutrition information
- Use simple, easy-to-understand language
- Be encouraging and supportive
- Focus only on diet and nutrition topics
- If asked about topics outside nutrition/diet, politely redirect the conversation

Format your responses with clear sections using markdown when helpful.`

export async function generateAIResponse(userMessage, context = {}) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Build context-aware prompt
    let contextInfo = ''
    if (context.bmi) {
      contextInfo += `\nUser's BMI: ${context.bmi} (${getBMICategory(context.bmi)})`
    }
    if (context.goal) {
      contextInfo += `\nUser's goal: ${context.goal}`
    }
    if (context.recentMeals) {
      contextInfo += `\nRecent meals: ${context.recentMeals.join(', ')}`
    }

    const prompt = `${SYSTEM_PROMPT}

${contextInfo ? 'User Context:' + contextInfo + '\n\n' : ''}User Question: ${userMessage}

Please provide a helpful, accurate, and encouraging response about nutrition and diet.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return {
      success: true,
      response: text
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    return {
      success: false,
      error: 'Failed to generate AI response. Please try again later.',
      fallback: getFallbackResponse(userMessage)
    }
  }
}

export async function analyzeDietLog(meals, userGoal = 'general health') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const mealsText = meals.map(m => `- ${m.meal}: ${m.food} (${m.calories} kcal)`).join('\n')

    const prompt = `${SYSTEM_PROMPT}

Analyze the following daily diet log for a user whose goal is "${userGoal}":

${mealsText}

Total Calories: ${meals.reduce((sum, m) => sum + m.calories, 0)} kcal

Please provide:
1. A brief assessment of the overall nutritional balance
2. 2-3 specific improvement suggestions
3. Positive aspects of the current diet
4. One motivational tip

Keep the response concise and actionable.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return {
      success: true,
      analysis: text
    }
  } catch (error) {
    console.error('Diet Analysis Error:', error)
    return {
      success: false,
      error: 'Failed to analyze diet log.'
    }
  }
}

export async function getBMIAdvice(bmi, weight, height) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const category = getBMICategory(bmi)

    const prompt = `${SYSTEM_PROMPT}

A user has just calculated their BMI with the following results:
- Weight: ${weight} kg
- Height: ${height} cm
- BMI: ${bmi}
- Category: ${category}

Please provide:
1. A brief explanation of what their BMI means
2. General dietary recommendations for their category
3. 2-3 actionable tips they can start today
4. Encouragement and next steps

Keep the response supportive and motivating, not alarming.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return {
      success: true,
      advice: text,
      bmi,
      category
    }
  } catch (error) {
    console.error('BMI Advice Error:', error)
    return {
      success: false,
      error: 'Failed to generate BMI advice.',
      bmi,
      category: getBMICategory(bmi)
    }
  }
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal weight'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('breakfast')) {
    return 'For a healthy breakfast, consider options like oatmeal with fruits, Greek yogurt with nuts, or whole-grain toast with avocado. These provide sustained energy and essential nutrients.'
  }
  
  if (lowerMessage.includes('weight') || lowerMessage.includes('lose')) {
    return 'For healthy weight management, focus on a balanced diet with plenty of vegetables, lean proteins, and whole grains. Combine this with regular physical activity and adequate sleep. Remember, sustainable changes work better than quick fixes!'
  }
  
  if (lowerMessage.includes('protein')) {
    return 'Good protein sources include lean meats, fish, eggs, legumes, tofu, and Greek yogurt. Adults generally need about 0.8-1g of protein per kg of body weight daily.'
  }
  
  return "I'm here to help with nutrition and diet questions! You can ask me about healthy eating, meal ideas, understanding nutrients, or general dietary advice. For specific medical concerns, please consult with your dietitian or healthcare provider."
}

export default { generateAIResponse, analyzeDietLog, getBMIAdvice }


