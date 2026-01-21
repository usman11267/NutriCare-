import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Scale, Ruler, ArrowRight, RefreshCw, Info, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const BMICalculator = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ weight: '', height: '' })
  const [result, setResult] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const calculateBMI = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const weight = parseFloat(formData.weight)
      const height = parseFloat(formData.height) / 100 // convert cm to m
      const bmi = weight / (height * height)
      
      let category, color, advice
      if (bmi < 18.5) {
        category = 'Underweight'
        color = 'text-blue-400'
        advice = 'You may need to gain some weight. Focus on nutrient-dense foods and consult a dietitian for a personalized plan.'
      } else if (bmi < 25) {
        category = 'Normal'
        color = 'text-green-400'
        advice = 'Great job! You\'re in a healthy weight range. Maintain your balanced diet and regular physical activity.'
      } else if (bmi < 30) {
        category = 'Overweight'
        color = 'text-yellow-400'
        advice = 'Consider adopting a healthier diet and increasing physical activity. Small changes can make a big difference.'
      } else {
        category = 'Obese'
        color = 'text-red-400'
        advice = 'It\'s important to focus on your health. Consult a healthcare provider and dietitian for professional guidance.'
      }
      
      setResult({ bmi: bmi.toFixed(1), category, color, advice })
      setStep(3)
      setIsCalculating(false)
    }, 1500)
  }

  const reset = () => {
    setStep(1)
    setFormData({ weight: '', height: '' })
    setResult(null)
  }

  const stepIndicators = ['Weight', 'Height', 'Result']

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            BMI Calculator
          </h1>
          <p className="text-gray-400">
            Calculate your Body Mass Index and get personalized insights
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {stepIndicators.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                step > i ? 'bg-primary-500/20' : step === i + 1 ? 'bg-primary-500 text-white' : 'bg-white/5'
              }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > i ? 'bg-primary-500 text-white' : step === i + 1 ? 'bg-white text-primary-500' : 'bg-white/10 text-gray-500'
                }`}>
                  {step > i ? '✓' : i + 1}
                </span>
                <span className={`text-sm font-medium ${
                  step >= i + 1 ? 'text-white' : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </div>
              {i < stepIndicators.length - 1 && (
                <div className={`w-8 h-0.5 ${step > i + 1 ? 'bg-primary-500' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Calculator Card */}
        <div className="card">
          <AnimatePresence mode="wait">
            {/* Step 1: Weight */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Enter Your Weight</h2>
                    <p className="text-gray-400 text-sm">Step 1 of 3</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g., 70"
                    className="input-field text-2xl text-center font-bold"
                    min="20"
                    max="300"
                    autoFocus
                  />
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Enter your weight in kilograms
                  </p>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.weight || formData.weight < 20}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Height */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
                    <Ruler className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Enter Your Height</h2>
                    <p className="text-gray-400 text-sm">Step 2 of 3</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="e.g., 175"
                    className="input-field text-2xl text-center font-bold"
                    min="100"
                    max="250"
                    autoFocus
                  />
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Enter your height in centimeters
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={calculateBMI}
                    disabled={!formData.height || formData.height < 100 || isCalculating}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    {isCalculating ? (
                      <div className="spinner w-5 h-5 border-2" />
                    ) : (
                      <>
                        Calculate
                        <Calculator className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Result */}
            {step === 3 && result && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* BMI Display */}
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-2">Your BMI is</p>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className={`text-7xl font-display font-bold ${result.color}`}
                  >
                    {result.bmi}
                  </motion.div>
                  <div className={`mt-4 inline-block px-6 py-2 rounded-full ${
                    result.category === 'Normal' ? 'bg-green-500/20 text-green-400' :
                    result.category === 'Underweight' ? 'bg-blue-500/20 text-blue-400' :
                    result.category === 'Overweight' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  } font-semibold`}>
                    {result.category}
                  </div>
                </div>

                {/* BMI Scale */}
                <div className="relative">
                  <div className="h-4 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 overflow-hidden" />
                  <motion.div
                    initial={{ left: '0%' }}
                    animate={{ left: `${Math.min(Math.max((parseFloat(result.bmi) - 15) / 25 * 100, 0), 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute top-0 -translate-x-1/2 w-1 h-4 bg-white rounded-full shadow-lg"
                  />
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>15</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>

                {/* Advice */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {result.advice}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Calculate Again
                  </button>
                  <Link
                    to="/register"
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    Get AI Advice
                    <TrendingUp className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BMI Categories Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { range: '< 18.5', label: 'Underweight', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
            { range: '18.5 - 24.9', label: 'Normal', color: 'bg-green-500/20 text-green-400 border-green-500/20' },
            { range: '25 - 29.9', label: 'Overweight', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' },
            { range: '≥ 30', label: 'Obese', color: 'bg-red-500/20 text-red-400 border-red-500/20' }
          ].map((item, i) => (
            <div key={i} className={`p-3 rounded-xl border ${item.color} text-center`}>
              <p className="text-lg font-bold">{item.range}</p>
              <p className="text-xs opacity-80">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default BMICalculator


