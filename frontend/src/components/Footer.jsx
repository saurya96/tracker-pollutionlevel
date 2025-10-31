import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [hoveredSocial, setHoveredSocial] = useState(null)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Trends', path: '/trends' },
    { name: 'Alerts', path: '/alerts' },
    { name: 'Report', path: '/report' },
    { name: 'About', path: '/about' },
  ]

  const resources = [
    { name: 'AQI Guide', icon: '📖' },
    { name: 'Health Tips', icon: '💊' },
    { name: 'API Docs', icon: '🔧' },
    { name: 'FAQ', icon: '❓' },
  ]

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', color: 'hover:bg-blue-400', link: '#' },
    { name: 'Facebook', icon: '📘', color: 'hover:bg-blue-600', link: '#' },
    { name: 'Instagram', icon: '📸', color: 'hover:bg-pink-500', link: '#' },
    { name: 'LinkedIn', icon: '💼', color: 'hover:bg-blue-700', link: '#' },
    { name: 'GitHub', icon: '⚙️', color: 'hover:bg-gray-800', link: '#' },
  ]

  const stats = [
    { value: '50K+', label: 'Active Users', icon: '👥' },
    { value: '100+', label: 'Cities Covered', icon: '🏙️' },
    { value: '1M+', label: 'Data Points', icon: '📊' },
    { value: '24/7', label: 'Monitoring', icon: '⏰' },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Stats Bar */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="text-center transform hover:scale-110 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-4xl mb-2 group-hover:animate-bounce">{stat.icon}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent group-hover:from-green-400 group-hover:to-blue-400 transition-all">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-2xl transform group-hover:rotate-12 transition-transform duration-300">
                🌍
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  AirWatch
                </h3>
                <p className="text-xs text-gray-400">Pollution Tracker</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering communities with real-time air quality data. Together, we can breathe better.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  onMouseEnter={() => setHoveredSocial(social.name)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  className={`w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg transform hover:scale-125 transition-all duration-300 ${social.color} hover:text-white relative group`}
                  title={social.name}
                >
                  {social.icon}
                  {hoveredSocial === social.name && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-fade-in">
                      {social.name}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center">
              <span className="mr-2">🔗</span>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center">
              <span className="mr-2">📚</span>
              Resources
            </h4>
            <ul className="space-y-2">
              {resources.map((resource, idx) => (
                <li key={idx}>
                  <button className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="mr-2 text-lg group-hover:scale-125 transition-transform">
                      {resource.icon}
                    </span>
                    {resource.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center">
              <span className="mr-2">📧</span>
              Stay Updated
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Get air quality alerts and updates delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all duration-300"
                  disabled={subscribed}
                />
                {subscribed && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-xl animate-bounce">
                    ✓
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {subscribed ? '✓ Subscribed!' : 'Subscribe'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400 flex items-center space-x-4">
              <span className="flex items-center">
                <span className="mr-2">©</span>
                2025 AirWatch. All rights reserved.
              </span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center">
                Made by Aashika Singh <span className="mx-1 text-red-500 animate-pulse">❤️</span> for a cleaner planet
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </button>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white text-xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-300 animate-bounce-slow z-50 group"
          title="Back to top"
        >
          <span className="group-hover:animate-pulse">↑</span>
        </button>
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-size-200 animate-gradient"></div>
    </footer>
  )
}
