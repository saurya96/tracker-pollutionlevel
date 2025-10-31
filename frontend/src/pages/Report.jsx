import React, { useState, useEffect } from 'react'
import { reportAPI } from '../api/reportAPI'

export default function Report() {
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [recentReports, setRecentReports] = useState([])
  const [token] = useState(localStorage.getItem('token'))
  const [dragActive, setDragActive] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    fetchRecentReports()
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toFixed(6))
          setLon(position.coords.longitude.toFixed(6))
        },
        (error) => {
          console.log('Location access denied:', error)
        }
      )
    }
  }

  const fetchRecentReports = async () => {
    try {
      const data = await reportAPI.getAllReports()
      setRecentReports(data.slice(0, 5)) // Show last 5 reports
    } catch (err) {
      console.error('Failed to fetch reports:', err)
    }
  }

  const showSuccessToast = (msg) => {
    setMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Simulate upload progress
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 100)

      // For demo purposes, we'll use a data URL. In production, upload to a cloud service
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setImageUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const fakeEvent = { target: { files: [file] } }
      handleImageChange(fakeEvent)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (!location || !description) {
      setError('Location and description are required')
      setLoading(false)
      return
    }

    try {
      const reportData = {
        location,
        description,
        imageUrl: imageUrl || undefined,
        lat: lat ? parseFloat(lat) : undefined,
        lon: lon ? parseFloat(lon) : undefined
      }

      await reportAPI.createReport(reportData, token)
      showSuccessToast('Report submitted successfully! Thank you for helping improve air quality awareness. 🌍')
      
      // Reset form
      setLocation('')
      setDescription('')
      setImageUrl('')
      setImagePreview(null)
      
      // Refresh reports
      fetchRecentReports()
    } catch (err) {
      setError('Failed to submit report. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const incidentTypes = [
    { icon: '🏭', label: 'Industrial Smoke', desc: 'Factories emitting visible smoke' },
    { icon: '🚗', label: 'Vehicle Emissions', desc: 'Heavy traffic pollution' },
    { icon: '🔥', label: 'Burning', desc: 'Waste or crop burning' },
    { icon: '🏗️', label: 'Construction Dust', desc: 'Construction site pollution' },
    { icon: '💨', label: 'Smog/Haze', desc: 'Visible air quality degradation' },
    { icon: '🌫️', label: 'Other', desc: 'Other pollution incidents' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in-up">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 transform hover:scale-105 transition-transform">
            <span className="text-3xl animate-bounce">✓</span>
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-sm text-green-100">{message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-500 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl animate-float">
            📝
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Report Pollution
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us build a comprehensive pollution map. Your reports make a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up transform hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">📝</span>
              Submit a Report
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center space-x-2 animate-fade-in">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">📍</span>
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="e.g., Near Central Park, Mumbai"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-400"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="mr-2">🌐</span>
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="28.6139"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="mr-2">🌐</span>
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    placeholder="77.2090"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">📄</span>
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="5"
                  placeholder="Describe what you observed... (e.g., Heavy smoke from factory, burning waste, excessive vehicle emissions)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all duration-300 group-hover:border-gray-400"
                />
              </div>

              {/* Image Upload with Drag-Drop */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">📸</span>
                  Photo Evidence (Optional)
                </label>
                <div 
                  className={`border-2 border-dashed ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 cursor-pointer relative overflow-hidden group`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="relative animate-fade-in">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                      />
                      {uploadProgress < 100 && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{uploadProgress}% uploaded</p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null)
                          setImageUrl('')
                          setUploadProgress(0)
                        }}
                        className="mt-4 px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-600 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        ✕ Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
                      <svg className="mx-auto h-16 w-16 text-gray-400 group-hover:text-blue-500 transition-colors duration-300 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-3 text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                        {dragActive ? '📥 Drop your image here' : '📸 Click or drag to upload'}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">📤</span>
                      Submit Report
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {!token && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center animate-fade-in">
                  <p className="text-sm text-gray-700">
                    💡 <span className="font-semibold">Tip:</span> <a href="/alerts" className="text-blue-600 hover:underline font-semibold">Login</a> to track your reports and receive updates
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Info & Recent Reports */}
          <div className="space-y-6">
            {/* Common Incident Types */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Common Incident Types
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {incidentTypes.map((type, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <p className="font-semibold text-gray-900 text-sm">{type.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{type.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">📋</span>
                Recent Reports
              </h2>
              {recentReports.length > 0 ? (
                <div className="space-y-4">
                  {recentReports.map((report, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-gray-900">{report.location}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          report.status === 'verified' ? 'bg-green-100 text-green-700' :
                          report.status === 'resolved' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {report.status || 'pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {report.description}
                      </p>
                      {report.date && (
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(report.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No recent reports. Be the first to report!
                </p>
              )}
            </div>

            {/* Impact Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Your Impact Matters</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <p className="font-semibold">Community-Driven</p>
                    <p className="text-sm opacity-90">Reports help authorities take action</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <p className="font-semibold">Data Collection</p>
                    <p className="text-sm opacity-90">Build comprehensive pollution maps</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <p className="font-semibold">Environmental Protection</p>
                    <p className="text-sm opacity-90">Together we create cleaner air</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
