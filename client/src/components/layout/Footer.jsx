import { Link } from 'react-router-dom'
import { Apple, Heart, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', path: '/#features' },
      { name: 'BMI Calculator', path: '/bmi-calculator' },
      { name: 'AI Assistant', path: '/#ai' },
      { name: 'Pricing', path: '/#pricing' },
    ],
    company: [
      { name: 'About Us', path: '/portfolio' },
      { name: 'Our Team', path: '/portfolio#team' },
      { name: 'Careers', path: '/careers' },
      { name: 'Contact', path: '/contact' },
    ],
    resources: [
      { name: 'Blog', path: '/blog' },
      { name: 'Nutrition Guide', path: '/guide' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Support', path: '/support' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
    ],
  }

  return (
    <footer className="relative z-10 mt-auto border-t border-white/5 bg-neutral-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Nutri<span className="text-primary-400">Care</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Your personal nutrition partner. Get expert dietitian consultation and AI-powered diet recommendations.
            </p>
            <div className="space-y-2">
              <a href="mailto:hello@nutricare.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors">
                <Mail className="w-4 h-4" />
                hello@nutricare.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors">
                <Phone className="w-4 h-4" />
                +1 (234) 567-890
              </a>
              <p className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                New York, NY, USA
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} NutriCare. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for a healthier world
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


