import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Apple, 
  Plus, 
  Clock, 
  Flame, 
  Search,
  ChevronDown,
  Check,
  X,
  Coffee,
  Sun,
  Moon,
  Cookie
} from 'lucide-react'
import { supabase } from '../../config/supabase'
import { useAuthStore } from '../../store/authStore'

const DietLog = () => {
  const { user } = useAuthStore()
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [newFood, setNewFood] = useState({
    name: '',
    quantity: '',
    calories: '',
    time: new Date().toTimeString().slice(0, 5)
  })

  const meals = [
    { id: 'breakfast', name: 'Breakfast', icon: Coffee, color: 'from-orange-500 to-amber-500', time: '6:00 - 10:00 AM' },
    { id: 'lunch', name: 'Lunch', icon: Sun, color: 'from-yellow-500 to-orange-500', time: '11:00 AM - 2:00 PM' },
    { id: 'dinner', name: 'Dinner', icon: Moon, color: 'from-indigo-500 to-purple-500', time: '6:00 - 9:00 PM' },
    { id: 'snacks', name: 'Snacks', icon: Cookie, color: 'from-pink-500 to-rose-500', time: 'Anytime' }
  ]

  // Logged foods state
  const [loggedFoods, setLoggedFoods] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  })

  // Fetch diet logs from Supabase
  useEffect(() => {
    const fetchDietLogs = async () => {
      if (!user?.id) return
      
      const today = new Date().toISOString().split('T')[0]
      
      try {
        const { data, error } = await supabase
          .from('diet_logs')
          .select('*')
          .eq('patient_id', user.id)
          .eq('date', today)
          .order('created_at', { ascending: true })

        if (error) throw error

        // Group by meal type
        const grouped = {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        }

        data?.forEach(log => {
          if (grouped[log.meal]) {
            grouped[log.meal].push({
              id: log.id,
              name: log.food,
              quantity: log.quantity,
              calories: log.calories,
              time: log.time
            })
          }
        })

        setLoggedFoods(grouped)
      } catch (error) {
        console.error('Error fetching diet logs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDietLogs()
  }, [user?.id])

  const popularFoods = [
    { name: 'Oatmeal', calories: 150, unit: 'per 100g' },
    { name: 'Chicken breast', calories: 165, unit: 'per 100g' },
    { name: 'Brown rice', calories: 112, unit: 'per 100g' },
    { name: 'Greek yogurt', calories: 59, unit: 'per 100g' },
    { name: 'Salmon', calories: 208, unit: 'per 100g' },
    { name: 'Banana', calories: 89, unit: 'per medium' },
    { name: 'Eggs', calories: 155, unit: 'per 100g' },
    { name: 'Avocado', calories: 160, unit: 'per 100g' }
  ]

  const filteredFoods = popularFoods.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTotalCalories = (mealId) => {
    return loggedFoods[mealId]?.reduce((sum, food) => sum + food.calories, 0) || 0
  }

  const getTotalDayCalories = () => {
    return Object.values(loggedFoods).flat().reduce((sum, food) => sum + food.calories, 0)
  }

  const handleAddFood = async () => {
    if (!selectedMeal || !newFood.name || !newFood.calories || !user?.id) return

    const today = new Date().toISOString().split('T')[0]

    try {
      const { data, error } = await supabase
        .from('diet_logs')
        .insert([{
          patient_id: user.id,
          meal: selectedMeal,
          food: newFood.name,
          quantity: newFood.quantity || '1 serving',
          calories: parseInt(newFood.calories),
          time: newFood.time,
          date: today
        }])
        .select()
        .single()

      if (error) throw error

      const food = {
        id: data.id,
        name: data.food,
        quantity: data.quantity,
        calories: data.calories,
        time: data.time
      }

      setLoggedFoods(prev => ({
        ...prev,
        [selectedMeal]: [...prev[selectedMeal], food]
      }))

      setNewFood({ name: '', quantity: '', calories: '', time: new Date().toTimeString().slice(0, 5) })
      setShowAddModal(false)
      setSearchQuery('')
    } catch (error) {
      console.error('Error adding food:', error)
    }
  }

  const handleRemoveFood = async (mealId, foodId) => {
    try {
      const { error } = await supabase
        .from('diet_logs')
        .delete()
        .eq('id', foodId)

      if (error) throw error

      setLoggedFoods(prev => ({
        ...prev,
        [mealId]: prev[mealId].filter(food => food.id !== foodId)
      }))
    } catch (error) {
      console.error('Error removing food:', error)
    }
  }

  const selectQuickFood = (food) => {
    setNewFood(prev => ({
      ...prev,
      name: food.name,
      calories: food.calories.toString()
    }))
    setSearchQuery('')
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
          Daily Diet Log 🍽️
        </h1>
        <p className="text-gray-400">
          Track your meals and stay on top of your nutrition goals
        </p>
      </motion.div>

      {/* Daily Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Today's Total</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold text-gradient">
                {getTotalDayCalories()}
              </span>
              <span className="text-gray-500">/ 2000 kcal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Remaining</p>
              <p className="text-xl font-bold text-primary-400">
                {Math.max(2000 - getTotalDayCalories(), 0)} kcal
              </p>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-24 h-24 -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(getTotalDayCalories() / 2000) * 251.2} 251.2`}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {Math.round((getTotalDayCalories() / 2000) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Meal Categories */}
      <div className="space-y-4">
        {meals.map((meal, index) => (
          <motion.div
            key={meal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="card"
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setSelectedMeal(selectedMeal === meal.id ? null : meal.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meal.color} flex items-center justify-center`}>
                  <meal.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{meal.name}</h3>
                  <p className="text-sm text-gray-400">{meal.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{getTotalCalories(meal.id)}</p>
                  <p className="text-sm text-gray-400">kcal</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                  selectedMeal === meal.id ? 'rotate-180' : ''
                }`} />
              </div>
            </div>

            <AnimatePresence>
              {selectedMeal === meal.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-white/10">
                    {loggedFoods[meal.id]?.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {loggedFoods[meal.id].map((food) => (
                          <div 
                            key={food.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 group"
                          >
                            <div className="flex items-center gap-3">
                              <Apple className="w-5 h-5 text-primary-400" />
                              <div>
                                <p className="font-medium text-white">{food.name}</p>
                                <p className="text-sm text-gray-400">{food.quantity} • {food.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-white font-medium">{food.calories} kcal</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveFood(meal.id, food.id)
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No foods logged yet</p>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedMeal(meal.id)
                        setShowAddModal(true)
                      }}
                      className="w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-primary-500/50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Food
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Add Food Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md card max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-white">
                  Add to {meals.find(m => m.id === selectedMeal)?.name}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search foods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-12"
                />
              </div>

              {/* Quick Select Foods */}
              {searchQuery && (
                <div className="mb-4 max-h-40 overflow-y-auto space-y-2">
                  {filteredFoods.map((food, i) => (
                    <button
                      key={i}
                      onClick={() => selectQuickFood(food)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-white">{food.name}</span>
                      <span className="text-sm text-gray-400">{food.calories} kcal {food.unit}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Food Name</label>
                  <input
                    type="text"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                    placeholder="e.g., Grilled chicken"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                    <input
                      type="text"
                      value={newFood.quantity}
                      onChange={(e) => setNewFood({ ...newFood, quantity: e.target.value })}
                      placeholder="e.g., 1 serving"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Calories</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={newFood.calories}
                        onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                        placeholder="e.g., 250"
                        className="input-field pr-16"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">kcal</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="time"
                      value={newFood.time}
                      onChange={(e) => setNewFood({ ...newFood, time: e.target.value })}
                      className="input-field pl-12"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddFood}
                  disabled={!newFood.name || !newFood.calories}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Add Food
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DietLog


