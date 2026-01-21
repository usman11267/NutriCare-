import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  CheckCircle2, 
  Apple, 
  Brain, 
  CalendarCheck, 
  MessageCircle,
  TrendingUp,
  Shield,
  Star,
  Users,
  ChevronRight
} from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: Apple,
      title: 'Smart Diet Tracking',
      description: 'Log your daily meals and get instant nutritional insights. Track calories, macros, and more.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Brain,
      title: 'AI-Powered Advice',
      description: 'Get personalized diet recommendations powered by Google Gemini AI based on your goals.',
      color: 'from-accent-500 to-accent-600'
    },
    {
      icon: CalendarCheck,
      title: 'Easy Appointments',
      description: 'Book consultations with certified dietitians. Flexible scheduling that fits your lifestyle.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Connect directly with your dietitian. Get quick answers and ongoing support.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Progress Monitoring',
      description: 'Track your health journey with visual charts and milestone celebrations.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected. We take your privacy seriously.',
      color: 'from-teal-500 to-teal-600'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Lost 15kg in 3 months',
      content: 'NutriCare transformed my relationship with food. The AI suggestions are incredibly accurate and my dietitian is always there when I need guidance.',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Fitness Enthusiast',
      content: 'The meal tracking is so easy to use. I can log my food in seconds and get instant feedback. Best nutrition app I\'ve ever used!',
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Busy Professional',
      content: 'As someone with a hectic schedule, being able to chat with my dietitian anytime is a game-changer. Highly recommend!',
      avatar: 'ER'
    }
  ]

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50+', label: 'Expert Dietitians' },
    { value: '95%', label: 'Success Rate' },
    { value: '4.9', label: 'App Rating' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-6">
                🌿 Your Health Journey Starts Here
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Transform Your Diet with{' '}
                <span className="text-gradient">Expert Guidance</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Connect with certified dietitians, get AI-powered nutrition advice, and achieve your health goals with personalized meal plans.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/portfolio" className="btn-secondary flex items-center gap-2">
                  Meet Our Experts
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-10">
                <div className="flex -space-x-3">
                  {['SJ', 'MC', 'ER', 'AK'].map((initials, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-bold text-white border-2 border-neutral-950"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-accent-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">Trusted by 10,000+ users</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="card glow p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <Apple className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">Today's Progress</h3>
                      <p className="text-gray-400">Keep up the great work!</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Calories', value: 1450, max: 2000, color: 'bg-primary-500' },
                      { label: 'Protein', value: 65, max: 120, color: 'bg-blue-500' },
                      { label: 'Water', value: 6, max: 8, color: 'bg-cyan-500' }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-white font-medium">{item.value}/{item.max}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / item.max) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                            className={`h-full ${item.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 card p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Goal Achieved!</p>
                    <p className="text-xs text-gray-400">Daily steps completed</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 card p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">AI Tip</p>
                    <p className="text-xs text-gray-400">Add more fiber today</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/5 bg-neutral-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-display font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need for a{' '}
              <span className="text-gradient">Healthier Lifestyle</span>
            </h2>
            <p className="text-gray-400 text-lg">
              From diet tracking to AI-powered recommendations, we've got all the tools you need to succeed.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="card group hover:border-primary-500/30 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-neutral-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-accent-500/10 text-accent-400 text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Loved by <span className="text-gradient">Thousands</span>
            </h2>
            <p className="text-gray-400 text-lg">
              See what our users have to say about their NutriCare experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card"
              >
                <div className="flex items-center gap-1 text-accent-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card gradient-border text-center p-12"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center glow">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Your Health Journey?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their lives with NutriCare. 
              Get started today with our free trial.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/bmi-calculator" className="btn-secondary">
                Try BMI Calculator
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage


