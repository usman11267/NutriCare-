import { motion } from 'framer-motion'
import { 
  Award, 
  GraduationCap, 
  Clock, 
  Users, 
  Star, 
  MapPin, 
  Mail, 
  Phone,
  CheckCircle2,
  Calendar,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

const PortfolioPage = () => {
  const dietitian = {
    name: 'Dr. Sarah Mitchell',
    title: 'Clinical Dietitian & Nutrition Specialist',
    image: null,
    initials: 'SM',
    experience: '12+ Years',
    patients: '5000+',
    rating: 4.9,
    location: 'New York, NY',
    email: 'dr.mitchell@nutricare.com',
    phone: '+1 (555) 123-4567',
    bio: 'Dr. Sarah Mitchell is a board-certified clinical dietitian with over 12 years of experience in personalized nutrition counseling. She specializes in weight management, sports nutrition, and managing chronic conditions through dietary interventions.',
    certifications: [
      'Registered Dietitian Nutritionist (RDN)',
      'Certified Diabetes Educator (CDE)',
      'Sports Nutrition Specialist (SNS)',
      'Board Certified in Obesity Medicine'
    ],
    education: [
      { degree: 'Ph.D. in Nutritional Sciences', institution: 'Columbia University', year: '2015' },
      { degree: 'M.S. in Clinical Nutrition', institution: 'NYU', year: '2012' },
      { degree: 'B.S. in Dietetics', institution: 'Cornell University', year: '2010' }
    ],
    services: [
      { name: 'Initial Consultation', duration: '60 min', price: 'Free' },
      { name: 'Personalized Meal Plan', duration: '45 min', price: '$79' },
      { name: 'Follow-up Session', duration: '30 min', price: '$49' },
      { name: 'Weight Management Program', duration: '12 weeks', price: '$399' },
      { name: 'Sports Nutrition Package', duration: '8 weeks', price: '$299' },
      { name: 'Diabetes Management Plan', duration: '6 weeks', price: '$249' }
    ],
    specializations: [
      'Weight Loss & Management',
      'Sports & Athletic Nutrition',
      'Diabetes Management',
      'Heart Health',
      'Digestive Disorders',
      'Prenatal Nutrition'
    ]
  }

  const testimonials = [
    {
      name: 'Jennifer Adams',
      result: 'Lost 30 lbs in 4 months',
      content: 'Dr. Mitchell created a plan that actually fit my lifestyle. No extreme restrictions, just sustainable changes that worked.',
      rating: 5
    },
    {
      name: 'Robert Chen',
      result: 'Managed Type 2 Diabetes',
      content: 'My A1C levels have never been better. Dr. Mitchell\'s approach to nutrition helped me understand my condition better.',
      rating: 5
    },
    {
      name: 'Amanda Foster',
      result: 'Marathon Runner',
      content: 'The sports nutrition guidance was exactly what I needed. Improved my race times significantly!',
      rating: 5
    }
  ]

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                Board Certified Expert
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                {dietitian.name}
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                {dietitian.title}
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                {dietitian.bio}
              </p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-400" />
                  <span className="text-white font-medium">{dietitian.experience}</span>
                  <span className="text-gray-400">Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-400" />
                  <span className="text-white font-medium">{dietitian.patients}</span>
                  <span className="text-gray-400">Patients</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent-400 fill-accent-400" />
                  <span className="text-white font-medium">{dietitian.rating}</span>
                  <span className="text-gray-400">Rating</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary flex items-center gap-2">
                  Book Consultation
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href={`mailto:${dietitian.email}`} className="btn-secondary flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="w-full aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-1">
                  <div className="w-full h-full rounded-3xl bg-neutral-850 flex items-center justify-center">
                    <span className="text-8xl font-display font-bold text-gradient">
                      {dietitian.initials}
                    </span>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 right-0 card p-4"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-8 h-8 text-accent-400" />
                    <div>
                      <p className="text-sm font-bold text-white">Top Rated</p>
                      <p className="text-xs text-gray-400">2024 Best Dietitian</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-4 left-0 card p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-neutral-850 flex items-center justify-center text-xs text-white font-bold">
                          {['JA', 'RC', 'AF'][i]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">5000+ Happy</p>
                      <p className="text-xs text-gray-400">Patients</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-8 border-y border-white/5 bg-neutral-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8">
            <a href={`mailto:${dietitian.email}`} className="flex items-center gap-3 text-gray-300 hover:text-primary-400 transition-colors">
              <Mail className="w-5 h-5" />
              {dietitian.email}
            </a>
            <a href={`tel:${dietitian.phone}`} className="flex items-center gap-3 text-gray-300 hover:text-primary-400 transition-colors">
              <Phone className="w-5 h-5" />
              {dietitian.phone}
            </a>
            <span className="flex items-center gap-3 text-gray-300">
              <MapPin className="w-5 h-5" />
              {dietitian.location}
            </span>
          </div>
        </div>
      </section>

      {/* Certifications & Education */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary-400" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white">Certifications</h2>
              </div>
              <ul className="space-y-3">
                {dietitian.certifications.map((cert, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    {cert}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-accent-400" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white">Education</h2>
              </div>
              <div className="space-y-4">
                {dietitian.education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-12 h-12 rounded-lg bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-accent-400">{edu.year}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{edu.degree}</p>
                      <p className="text-sm text-gray-400">{edu.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-neutral-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
              Services
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              How I Can <span className="text-gradient">Help You</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From one-on-one consultations to comprehensive programs, choose the service that fits your needs.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietitian.services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`card group hover:border-primary-500/30 transition-all ${
                  service.price === 'Free' ? 'gradient-border' : ''
                }`}
              >
                {service.price === 'Free' && (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
                    FREE
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-white mb-2 mt-2">
                  {service.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-gradient">{service.price}</span>
                  <Link 
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-primary-500/20 text-primary-400 text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    Book Now
                    <Calendar className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-accent-500/10 text-accent-400 text-sm font-medium mb-4">
              Expertise
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Areas of <span className="text-gradient">Specialization</span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {dietitian.specializations.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-primary-500/30 transition-colors"
              >
                <span className="text-gray-300 font-medium">{spec}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-neutral-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
              Success Stories
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              What My <span className="text-gradient">Patients Say</span>
            </h2>
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
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-medium text-white">{testimonial.name}</p>
                  <p className="text-sm text-primary-400">{testimonial.result}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card gradient-border text-center p-12"
          >
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Ready to Transform Your Health?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Book your free consultation today and take the first step towards a healthier, happier you.
            </p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2">
              Schedule Free Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default PortfolioPage


