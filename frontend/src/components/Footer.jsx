import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [hoveredSocial, setHoveredSocial] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [theme, setTheme] = useState('light')

  const year = useMemo(() => new Date().getFullYear(), [])

  useEffect(() => {
    // Theme init
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    document.documentElement.classList.toggle('dark', saved === 'dark')
  }, [])

  const validateEmail = (val) => {
    // Simple RFC5322-ish email validation
    const re = /^(?:[a-zA-Z0-9_'^&\/+-])+(?:\.(?:[a-zA-Z0-9_'^&\/+-])+)*@(?:(?:[a-zA-Z0-9-])+\.)+[a-zA-Z]{2,}$/
    return re.test(String(val).trim())
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    setEmailError('')
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    // Simulate subscribe success
    setSubscribed(true)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
    setTimeout(() => {
      setSubscribed(false)
      setEmail('')
    }, 3000)
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
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
    { name: 'Twitter / X', icon: '𝕏', color: 'hover:bg-blue-500/20', link: 'https://twitter.com/' },
    { name: 'LinkedIn', icon: 'in', color: 'hover:bg-blue-600/20', link: 'https://www.linkedin.com/' },
    { name: 'Instagram', icon: '◎', color: 'hover:bg-pink-500/20', link: 'https://www.instagram.com/' },
    { name: 'GitHub', icon: '{}', color: 'hover:bg-gray-600/20', link: 'https://github.com/' },
  ]

  const stats = [
    { value: '50K+', label: 'Active Users', icon: '👥' },
    { value: '100+', label: 'Cities Covered', icon: '🏙️' },
    { value: '1M+', label: 'Data Points', icon: '📊' },
    { value: '24/7', label: 'Monitoring', icon: '⏰' },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white dark:from-gray-950 dark:via-black dark:to-gray-950">
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3">
            <span className="text-xl">✓</span>
            <span className="font-semibold">Subscribed successfully</span>
          </div>
        </div>
      )}
      {/* Stats Bar */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center rounded-xl p-4 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className="text-3xl mb-1 opacity-80 group-hover:opacity-100">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-300 mt-1">{stat.label}</div>
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
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm border border-white/10"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
              <a
                href="mailto:hello@example.com"
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm border border-white/10"
                aria-label="Contact us"
              >
                ✉️ Contact
              </a>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredSocial(social.name)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  aria-label={social.name}
                  className={`w-10 h-10 rounded-full bg-white/10 text-white/90 flex items-center justify-center text-sm transform hover:scale-110 transition-all duration-300 ${social.color} relative group border border-white/10`}
                  title={social.name}
                >
                  <span className="font-bold tracking-tight">{social.icon}</span>
                  {hoveredSocial === social.name && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-fade-in border border-white/10">
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
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) setEmailError('')
                  }}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2.5 bg-gray-800/80 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-500 transition-all duration-300 ${emailError ? 'border-red-500' : 'border-gray-700'}`}
                  disabled={subscribed}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
                {subscribed && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-xl animate-bounce">
                    ✓
                  </span>
                )}
              </div>
              {emailError && (
                <p id="email-error" className="text-xs text-red-400">{emailError}</p>
              )}
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
                {year} AirWatch. All rights reserved.
              </span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center">
                Made by Aashika Singh <span className="mx-1 text-red-500 animate-pulse">❤️</span> for a cleaner planet
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</Link>
              <a href="mailto:hello@example.com" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a>
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
