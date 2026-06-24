import React, { useState, useEffect } from 'react'
import { userAPI } from '../api/userAPI'

export default function Alerts() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  
  // Alert settings
  const [alertThreshold, setAlertThreshold] = useState(100)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [serviceStatus, setServiceStatus] = useState({ api: 'unknown', db: 'unknown' })

  const API_BASE = import.meta.env.VITE_API_URL || '/api'

  useEffect(() => {
    // Check backend and DB status
    fetch(`${API_BASE}/health`)
      .then(r => r.json())
      .then(({ status, db }) => setServiceStatus({ api: status, db }))
      .catch(() => setServiceStatus({ api: 'down', db: 'unknown' }))

    if (token) {
      setIsLoggedIn(true)
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      fetchAlertSettings()
    }
  }, [token])

  const fetchAlertSettings = async () => {
    try {
      const data = await userAPI.getAlerts(token)
      setAlertThreshold(data.alertThreshold)
    } catch (err) {
      console.error('Failed to fetch alert settings:', err)
    }
  }

  const showSuccessToast = (msg) => {
    setMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const data = await userAPI.login(loginEmail, loginPassword)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      setIsLoggedIn(true)
      setAlertThreshold(data.user.alertThreshold)
      showSuccessToast('Login successful! 🎉')
    } catch (err) {
      setError('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const data = await userAPI.register(registerName, registerEmail, registerPassword)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      setIsLoggedIn(true)
      setAlertThreshold(data.user.alertThreshold)
      showSuccessToast('Registration successful! Welcome aboard! 🎉')
    } catch (err) {
      if (err?.status === 409) {
        setError('Email already registered. Try logging in instead.')
      } else if (err?.status === 503) {
        setError('Service unavailable. Please start MongoDB and try again.')
      } else {
        setError(err?.message || 'Registration failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAlert = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    setSaveSuccess(false)

    try {
      await userAPI.setAlertThreshold(alertThreshold, token)
      setSaveSuccess(true)
      showSuccessToast('Alert threshold updated successfully! 🔔')
    } catch (err) {
      setError('Failed to update alert threshold.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setIsLoggedIn(false)
    setLoginEmail('')
    setLoginPassword('')
    setMessage('Logged out successfully')
  }

  const getAQILevelInfo = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: 'bg-green-500', textColor: 'text-green-700' }
    if (aqi <= 100) return { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700' }
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', textColor: 'text-orange-700' }
    if (aqi <= 200) return { level: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-700' }
    if (aqi <= 300) return { level: 'Very Unhealthy', color: 'bg-purple-600', textColor: 'text-purple-700' }
    return { level: 'Hazardous', color: 'bg-red-900', textColor: 'text-red-900' }
  }

  const currentLevel = getAQILevelInfo(alertThreshold)

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Service Status Banner */}
        {(serviceStatus.api !== 'ok' || serviceStatus.db !== 'connected') && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="p-4 rounded-xl border bg-yellow-50 border-yellow-200 text-yellow-800">
              <div className="font-semibold mb-1">Service Notice</div>
              <div className="text-sm">
                Backend: <strong>{serviceStatus.api}</strong> • Database: <strong>{serviceStatus.db}</strong>.
                {serviceStatus.db !== 'connected' && (
                  <>
                    {' '}Authentication features require MongoDB. Please start MongoDB locally or set MONGODB_URI, then retry.
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-20 right-4 z-50 animate-fade-in-up">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3">
              <span className="text-2xl">✓</span>
              <span className="font-semibold">{message}</span>
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl animate-bounce-slow">
              🔔
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Alert Settings</h1>
            <p className="text-gray-600">Login or register to manage your air quality alerts</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex mb-6 bg-gray-200 rounded-xl p-1 animate-slide-up">
            <button
              onClick={() => setShowLogin(true)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 transform ${
                showLogin 
                  ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg scale-105' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 transform ${
                !showLogin 
                  ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg scale-105' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up-delay">
            {error && (
              <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center space-x-2 animate-fade-in">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {showLogin ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="mr-2">📧</span>
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-400"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="mr-2">🔒</span>
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10">{loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : 'Login'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="mr-2">👤</span>
                    Name
                  </label>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-400"
                    placeholder="John Doe"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="mr-2">📧</span>
                    Email
                  </label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Register'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in-up">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 transform hover:scale-105 transition-transform">
            <span className="text-2xl animate-bounce">✓</span>
            <span className="font-semibold">{message}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl animate-float">
            🔔
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Alert Settings</h1>
          <p className="text-gray-600">Manage your air quality notifications</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-slide-up transform hover:shadow-2xl transition-all duration-300">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600 flex items-center">
                  <span className="mr-1">📧</span>
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Alert Threshold Setting */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-slide-up-delay transform hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-3xl mr-3 animate-pulse-slow">🔔</span>
            Alert Threshold
          </h2>
          
          <form onSubmit={handleUpdateAlert}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Notify me when AQI exceeds:
              </label>
              
              {/* Enhanced Slider */}
              <div className="relative mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      value={alertThreshold}
                      onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                      className="w-full h-4 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 via-red-400 via-purple-500 to-red-900 rounded-full appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, 
                          #00e400 0%, #00e400 10%, 
                          #ffff00 10%, #ffff00 20%, 
                          #ff7e00 20%, #ff7e00 30%, 
                          #ff0000 30%, #ff0000 40%, 
                          #8f3f97 40%, #8f3f97 60%, 
                          #7e0023 60%, #7e0023 100%)`
                      }}
                    />
                  </div>
                  <div className={`px-8 py-4 bg-gradient-to-br ${currentLevel.color.replace('bg-', 'from-')} ${currentLevel.color.replace('bg-', 'to-')}-600 text-white rounded-2xl font-bold text-3xl min-w-[120px] text-center shadow-lg transform hover:scale-110 transition-all duration-300`}>
                    {alertThreshold}
                  </div>
                </div>
                
                {/* AQI Level Markers */}
                <div className="mt-3 flex justify-between text-xs text-gray-500 px-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                  <span>150</span>
                  <span>200</span>
                  <span>300</span>
                  <span>500</span>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
                <div className="flex items-start space-x-3">
                  <div className={`text-3xl ${saveSuccess ? 'animate-bounce' : ''}`}>
                    {saveSuccess ? '✓' : 'ℹ️'}
                  </div>
                  <div className="flex-1">
                    <p className={`text-lg font-bold mb-2 ${currentLevel.textColor}`}>
                      Current Level: {currentLevel.level}
                    </p>
                    <p className="text-sm text-gray-600">
                      You will receive notifications when the air quality in your monitored cities exceeds <span className="font-bold text-gray-900">{alertThreshold} AQI</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    Update Alert Threshold
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>
        </div>

        {/* AQI Reference Guide */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AQI Reference Guide</h2>
          <div className="space-y-3">
            {[
              { range: '0-50', level: 'Good', color: 'bg-green-500', desc: 'Air quality is satisfactory' },
              { range: '51-100', level: 'Moderate', color: 'bg-yellow-500', desc: 'Acceptable for most people' },
              { range: '101-150', level: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', desc: 'Sensitive groups may experience health effects' },
              { range: '151-200', level: 'Unhealthy', color: 'bg-red-500', desc: 'Everyone may begin to experience health effects' },
              { range: '201-300', level: 'Very Unhealthy', color: 'bg-purple-600', desc: 'Health alert: everyone may experience serious effects' },
              { range: '301+', level: 'Hazardous', color: 'bg-red-900', desc: 'Emergency conditions: entire population affected' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-16 h-12 ${item.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                  {item.range}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.level}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
