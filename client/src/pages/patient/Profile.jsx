import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Target, 
  Scale, 
  Ruler,
  Save,
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../config/supabase'

const Profile = () => {
  const { user, profile, updateProfile } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    height: '',
    weight: '',
    goal: ''
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        height: profile.height || '',
        weight: profile.weight || '',
        goal: profile.goal || ''
      })
    }
  }, [profile, user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth || null,
          height: formData.height ? parseFloat(formData.height) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          goal: formData.goal
        })
        .eq('id', user.id)

      if (error) throw error

      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        goal: formData.goal
      })

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditing(false)
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    } finally {
      setIsSaving(false)
    }
  }

  const calculateBMI = () => {
    if (formData.weight && formData.height) {
      const heightM = parseFloat(formData.height) / 100
      const bmi = parseFloat(formData.weight) / (heightM * heightM)
      return bmi.toFixed(1)
    }
    return null
  }

  const getBMICategory = (bmi) => {
    if (!bmi) return null
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-400' }
    if (bmi < 25) return { category: 'Normal', color: 'text-green-400' }
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-400' }
    return { category: 'Obese', color: 'text-red-400' }
  }

  const bmi = calculateBMI()
  const bmiInfo = getBMICategory(parseFloat(bmi))

  const goalOptions = [
    'Weight Loss',
    'Weight Gain',
    'Muscle Building',
    'Maintain Weight',
    'Improve Energy',
    'Better Nutrition',
    'Diabetes Management',
    'Heart Health'
  ]

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          My Profile 👤
        </h1>
        <p className="text-gray-400">
          Manage your personal information and health goals
        </p>
      </motion.div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 flex items-center gap-3 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p className="text-sm">{message.text}</p>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="card text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-white">
                  {formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'NA'}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-400 hover:bg-white/20 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{formData.name || 'Your Name'}</h2>
            <p className="text-gray-400 mb-4">{formData.email}</p>
            
            {/* BMI Card */}
            {bmi && (
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-400 mb-1">Your BMI</p>
                <p className="text-3xl font-bold text-white mb-1">{bmi}</p>
                <p className={`text-sm font-medium ${bmiInfo?.color}`}>
                  {bmiInfo?.category}
                </p>
              </div>
            )}

            <div className="space-y-3 text-left">
              {formData.phone && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{formData.phone}</span>
                </div>
              )}
              {formData.goal && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{formData.goal}</span>
                </div>
              )}
              {profile?.created_at && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary text-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-12 disabled:opacity-60"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="input-field pl-12 opacity-60 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-12 disabled:opacity-60"
                      placeholder="03001234567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-12 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Height (cm)
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-12 disabled:opacity-60"
                      placeholder="170"
                      min="100"
                      max="250"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-12 disabled:opacity-60"
                      placeholder="70"
                      min="20"
                      max="300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Health Goal
                </label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field pl-12 disabled:opacity-60 appearance-none cursor-pointer"
                  >
                    <option value="">Select your goal</option>
                    {goalOptions.map(goal => (
                      <option key={goal} value={goal}>{goal}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isSaving ? (
                      <div className="spinner w-5 h-5 border-2" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
