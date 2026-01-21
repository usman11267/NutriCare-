import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, Send, Sparkles, RefreshCw, Lightbulb, Apple, TrendingUp, AlertTriangle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const AIAssistant = () => {
  const { user } = useAuthStore()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hello ${user?.user_metadata?.name || 'there'}! 👋 I'm your AI nutrition assistant powered by advanced AI. I can help you with:

• **Diet suggestions** based on your goals
• **Food analysis** and calorie information
• **BMI-based advice** for healthy eating
• **Meal planning** ideas and recipes

How can I help you today?`,
      timestamp: new Date()
    }
  ])

  const quickPrompts = [
    { icon: Apple, text: 'Suggest healthy breakfast ideas', color: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, text: 'How can I lose weight healthily?', color: 'from-blue-500 to-indigo-500' },
    { icon: Lightbulb, text: 'Tips for reducing sugar intake', color: 'from-yellow-500 to-orange-500' },
    { icon: AlertTriangle, text: 'Foods to avoid for better health', color: 'from-red-500 to-pink-500' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage) => {
    // Simulated AI responses based on keywords
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('breakfast')) {
      return `Here are some healthy breakfast ideas for you:

🥣 **Overnight Oats**
- 1/2 cup rolled oats, 1/2 cup Greek yogurt, 1/2 cup milk
- Add berries, nuts, and a drizzle of honey
- Prep the night before for a quick morning meal

🥚 **Veggie Egg White Omelette**
- 3 egg whites with spinach, tomatoes, and mushrooms
- Pair with whole-grain toast
- High protein, low calorie option

🍌 **Smoothie Bowl**
- Blend frozen banana, berries, and spinach
- Top with granola, chia seeds, and sliced almonds
- Refreshing and nutrient-packed

Would you like more details on any of these options?`
    }
    
    if (lowerMessage.includes('weight') || lowerMessage.includes('lose')) {
      return `Here are evidence-based tips for healthy weight loss:

📊 **Create a Calorie Deficit**
- Aim for 500-750 fewer calories per day
- This leads to 1-1.5 lbs loss per week safely

💪 **Prioritize Protein**
- Include protein in every meal
- Helps maintain muscle mass and keeps you full
- Good sources: lean meats, fish, legumes, Greek yogurt

🥗 **Focus on Whole Foods**
- Fruits, vegetables, whole grains
- Naturally lower in calories and higher in nutrients

🚶 **Stay Active**
- Aim for 150+ minutes of moderate exercise weekly
- Include both cardio and strength training

💤 **Get Quality Sleep**
- Poor sleep can increase hunger hormones
- Aim for 7-9 hours per night

⚠️ *Remember: I provide general advice only. For personalized plans, please consult with your dietitian!*`
    }
    
    if (lowerMessage.includes('sugar')) {
      return `Great question! Here are tips to reduce sugar intake:

🏷️ **Read Labels Carefully**
- Look for hidden sugars: sucrose, fructose, corn syrup
- Choose products with <5g added sugar per serving

🍎 **Swap Sugary Snacks**
- Instead of candy → fresh fruits
- Instead of soda → sparkling water with lemon
- Instead of cookies → nuts or dark chocolate

🥣 **Watch Breakfast Cereals**
- Many "healthy" cereals are sugar bombs
- Choose oatmeal or low-sugar options (<6g per serving)

☕ **Modify Your Coffee**
- Gradually reduce sugar in your coffee
- Try cinnamon for natural sweetness

🍝 **Cook at Home More**
- Restaurant and processed foods often have hidden sugars
- You control ingredients when cooking

💡 **Give it Time**
- Your taste buds adapt in 2-3 weeks
- Foods will taste sweeter naturally

Would you like specific meal suggestions with low sugar content?`
    }
    
    if (lowerMessage.includes('avoid')) {
      return `Here are foods to limit for better health:

🚫 **Highly Processed Foods**
- Chips, instant noodles, processed meats
- Often high in sodium, unhealthy fats, and additives

🍬 **Sugary Beverages**
- Soda, energy drinks, sweetened coffee drinks
- Empty calories that spike blood sugar

🍟 **Trans Fats**
- Fried foods, some margarines, packaged baked goods
- Increases bad cholesterol, decreases good cholesterol

🧂 **Excess Sodium**
- Limit to 2,300mg per day
- High in: canned soups, deli meats, fast food

🍺 **Excessive Alcohol**
- Limit to 1 drink/day for women, 2 for men
- Empty calories and affects metabolism

🍞 **Refined Carbs**
- White bread, pastries, white rice
- Choose whole grain alternatives instead

⚠️ *Moderation is key - you don't have to eliminate these completely, just be mindful!*`
    }

    // Default response
    return `That's a great question! Based on my nutrition knowledge, here are some thoughts:

${userMessage.length > 20 ? 
  `I understand you're asking about "${userMessage.slice(0, 50)}...". ` : 
  `Regarding "${userMessage}": `
}

For personalized advice, I'd recommend:

1. **Track Your Current Intake**
   - Use your diet log to see patterns
   - This helps identify areas for improvement

2. **Set Small, Achievable Goals**
   - Change one habit at a time
   - Sustainable progress beats quick fixes

3. **Stay Consistent**
   - Nutrition changes take time
   - Trust the process!

Would you like me to elaborate on any specific aspect? Or you can ask me about:
• Specific foods and their benefits
• Meal planning strategies
• Managing cravings
• Nutrition for specific goals

*Remember: For medical advice, please consult your healthcare provider or dietitian!*`
  }

  const handleSend = async () => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    try {
      // Call the actual backend API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
      const response = await fetch(`${apiUrl}/ai/quick-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage.content })
      })

      const data = await response.json()
      
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || generateAIResponse(userMessage.content),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('AI API error:', error)
      // Fallback to local response
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt) => {
    setMessage(prompt)
  }

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: `Chat cleared! How can I help you with your nutrition questions today?`,
      timestamp: new Date()
    }])
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex items-center justify-between p-4 mb-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center glow">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              AI Nutrition Assistant
              <Sparkles className="w-4 h-4 text-accent-400" />
            </h2>
            <p className="text-sm text-gray-400">Powered by Google Gemini</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span className="text-sm hidden sm:inline">Clear Chat</span>
        </button>
      </motion.div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleQuickPrompt(prompt.text)}
              className="card hover:border-primary-500/30 transition-all text-left flex items-center gap-3 p-4"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${prompt.color} flex items-center justify-center flex-shrink-0`}>
                <prompt.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-gray-300">{prompt.text}</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 card overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white rounded-br-sm'
                  : 'bg-white/10 text-white rounded-bl-sm'
              }`}>
                <div className="text-sm leading-relaxed whitespace-pre-line prose prose-invert prose-sm max-w-none">
                  {msg.content.split('\n').map((line, i) => {
                    // Bold text
                    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    // Bullet points
                    if (line.startsWith('•') || line.startsWith('-')) {
                      return <p key={i} className="ml-2" dangerouslySetInnerHTML={{ __html: line }} />
                    }
                    // Emoji headers
                    if (/^[🥣🥚🍌📊💪🥗🚶💤🏷️🍎🥣☕🍝💡🚫🍬🍟🧂🍺🍞⚠️]/u.test(line)) {
                      return <p key={i} className="font-medium mt-2" dangerouslySetInnerHTML={{ __html: line }} />
                    }
                    return <p key={i} dangerouslySetInnerHTML={{ __html: line }} />
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex items-center gap-2">
                <div className="spinner w-4 h-4 border-2" />
                <span className="text-sm text-gray-400">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mt-4 p-4"
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ask me anything about nutrition..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI provides general advice only. For medical concerns, consult your healthcare provider.
        </p>
      </motion.div>
    </div>
  )
}

export default AIAssistant


