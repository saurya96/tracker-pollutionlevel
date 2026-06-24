import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pollutionAPI } from '../api/pollutionAPI'
import MapView from '../components/MapView'
import PollutionTicker from '../components/PollutionTicker'

export default function Home() {
  const [searchCity, setSearchCity] = useState('')
  const [nearbyStations, setNearbyStations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredCity, setHoveredCity] = useState(null)
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [expandedCity, setExpandedCity] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [sortBy, setSortBy] = useState('aqi') // 'aqi' or 'alphabetical'
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    pollutionAPI.getNearby()
      .then(data => {
        setNearbyStations(data)
        setIsLoading(false)
        setLastUpdated(new Date())
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      pollutionAPI.getNearby()
        .then(data => {
          setNearbyStations(data)
          setLastUpdated(new Date())
        })
        .catch(err => console.error(err))
    }, 5 * 60 * 1000) // 5 minutes
    return () => clearInterval(interval)
  }, [autoRefresh])

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favoriteCities')
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  const toggleFavorite = (cityName) => {
    const updated = favorites.includes(cityName)
      ? favorites.filter(c => c !== cityName)
      : [...favorites, cityName]
    setFavorites(updated)
    localStorage.setItem('favoriteCities', JSON.stringify(updated))
  }

  const handleRefresh = () => {
    setIsLoading(true)
    pollutionAPI.getNearby()
      .then(data => {
        setNearbyStations(data)
        setLastUpdated(new Date())
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }

  const getSortedStations = () => {
    const sorted = [...nearbyStations]
    if (sortBy === 'aqi') {
      return sorted.sort((a, b) => b.aqi - a.aqi)
    } else {
      return sorted.sort((a, b) => a.city.localeCompare(b.city))
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchCity.trim()) {
      navigate(`/location?city=${encodeURIComponent(searchCity.trim())}`)
    }
  }

  const popularCities = [
    { name: 'Delhi', icon: '🏛️', description: 'National Capital' },
    { name: 'Mumbai', icon: '🌆', description: 'Financial Hub' },
    { name: 'Bangalore', icon: '💻', description: 'Tech City' },
    { name: 'Chennai', icon: '🏖️', description: 'Coastal Metro' },
    { name: 'Kolkata', icon: '🎭', description: 'Cultural Capital' },
    { name: 'Hyderabad', icon: '🕌', description: 'Pearl City' },
  ]

  const allCities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
                     'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur']

  const filteredSuggestions = searchCity.trim() 
    ? allCities.filter(city => city.toLowerCase().includes(searchCity.toLowerCase()))
    : []

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'bg-green-500'
    if (aqi <= 100) return 'bg-yellow-500'
    if (aqi <= 150) return 'bg-orange-500'
    if (aqi <= 200) return 'bg-red-500'
    if (aqi <= 300) return 'bg-purple-600'
    return 'bg-red-900'
  }

  const getAQIGradient = (aqi) => {
    if (aqi <= 50) return 'from-green-400 to-green-600'
    if (aqi <= 100) return 'from-yellow-400 to-yellow-600'
    if (aqi <= 150) return 'from-orange-400 to-orange-600'
    if (aqi <= 200) return 'from-red-400 to-red-600'
    if (aqi <= 300) return 'from-purple-500 to-purple-700'
    return 'from-red-800 to-red-950'
  }

  const getAQILabel = (aqi) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Satisfactory'
    if (aqi <= 150) return 'Moderately Polluted'
    if (aqi <= 200) return 'Poor'
    if (aqi <= 300) return 'Very Poor'
    return 'Severe'
  }

  const getHealthRecommendation = (aqi) => {
    if (aqi <= 50) return '✅ Air quality is good. Enjoy outdoor activities!'
    if (aqi <= 100) return '🙂 Air quality is satisfactory. Sensitive people should limit outdoor exposure.'
    if (aqi <= 150) return '⚠️ Air quality is poor. Avoid prolonged outdoor activities.'
    if (aqi <= 200) return '🚨 Unhealthy air quality. Wear an N95 mask if going out.'
    if (aqi <= 300) return '🔴 Very unhealthy. Stay indoors, use air purifier.'
    return '🆘 Hazardous conditions. Emergency measures recommended.'
  }

  const getAQIRiskLevel = (aqi) => {
    if (aqi <= 50) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' }
    if (aqi <= 100) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    if (aqi <= 150) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-50' }
    if (aqi <= 200) return { level: 'Very High', color: 'text-red-600', bg: 'bg-red-50' }
    if (aqi <= 300) return { level: 'Severe', color: 'text-purple-600', bg: 'bg-purple-50' }
    return { level: 'Critical', color: 'text-red-900', bg: 'bg-red-100' }
  }

  const worstCity = nearbyStations.length > 0 ? nearbyStations.reduce((prev, current) => prev.aqi > current.aqi ? prev : current) : null
  const bestCity = nearbyStations.length > 0 ? nearbyStations.reduce((prev, current) => prev.aqi < current.aqi ? prev : current) : null
  const avgAQI = nearbyStations.length > 0 ? Math.round(nearbyStations.reduce((sum, s) => sum + s.aqi, 0) / nearbyStations.length) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Pollution Ticker Alert */}
      <PollutionTicker />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Breathe Safe, Live Better
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 mt-2">
                Real-Time Air Quality Monitoring
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Track pollution levels in your city. Get health recommendations. Stay informed.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 animate-slide-up">
              <div className="relative group">
                <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform group-hover:scale-[1.02]">
                  <div className="pl-6 pr-4">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => {
                      setSearchCity(e.target.value)
                      setShowSearchSuggestions(true)
                    }}
                    onFocus={() => setShowSearchSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                    placeholder="Search for your city... (e.g., Delhi, Mumbai)"
                    className="flex-1 py-5 px-2 text-lg outline-none"
                  />
                  <button
                    type="submit"
                    className="px-8 py-5 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold hover:from-blue-700 hover:to-green-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Search
                  </button>
                </div>

                {/* Search Suggestions Dropdown */}
                {showSearchSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fade-in">
                    {filteredSuggestions.map((city, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSearchCity(city)
                          setShowSearchSuggestions(false)
                          navigate(`/location?city=${encodeURIComponent(city)}`)
                        }}
                        className="w-full px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 flex items-center space-x-3 group/item"
                      >
                        <span className="text-2xl group-hover/item:scale-125 transition-transform">📍</span>
                        <span className="text-gray-700 font-medium group-hover/item:text-blue-600">{city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Popular Cities */}
            <div className="mb-16">
              <p className="text-gray-500 mb-4 font-medium">Popular Cities</p>
              <div className="flex flex-wrap justify-center gap-3">
                {popularCities.map((city, idx) => (
                  <button
                    key={city.name}
                    onClick={() => navigate(`/location?city=${city.name}`)}
                    onMouseEnter={() => setHoveredCity(city.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                    className="group px-6 py-3 bg-white rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 hover:border-blue-500 relative overflow-hidden"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-2">
                      <span className="text-2xl transform group-hover:scale-125 transition-transform duration-300">{city.icon}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                          {city.name}
                        </span>
                        {hoveredCity === city.name && (
                          <span className="text-xs text-gray-500 animate-fade-in">{city.description}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AQI Statistics Dashboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Average AQI */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Average AQI</p>
                <p className="text-4xl font-bold mt-2">{avgAQI}</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                📊
              </div>
            </div>
          </div>

          {/* Best City */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Best Air Quality</p>
                <p className="text-2xl font-bold mt-2">{bestCity?.city || 'N/A'}</p>
                <p className="text-green-200 text-sm mt-1">AQI: {bestCity?.aqi}</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                ✨
              </div>
            </div>
          </div>

          {/* Worst City */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Worst Air Quality</p>
                <p className="text-2xl font-bold mt-2">{worstCity?.city || 'N/A'}</p>
                <p className="text-red-200 text-sm mt-1">AQI: {worstCity?.aqi}</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                ⚠️
              </div>
            </div>
          </div>

          {/* Total Stations */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Monitoring Stations</p>
                <p className="text-4xl font-bold mt-2">{nearbyStations.length}</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                📡
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live AQI Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">
                Live Air Quality Index
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Auto Refresh Toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  autoRefresh
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className={autoRefresh ? 'animate-spin' : ''}>🔄</span>
                {autoRefresh ? 'Auto-refresh: On' : 'Auto-refresh: Off'}
              </button>

              {/* Manual Refresh */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <span className={isLoading ? 'animate-spin' : ''}>↻</span>
                Refresh
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="aqi">Sort by AQI (High to Low)</option>
                <option value="alphabetical">Sort Alphabetically</option>
              </select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : nearbyStations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No data available. Try searching for a city!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {getSortedStations().map((station, idx) => {
              const isExpanded = expandedCity === station.city
              const riskInfo = getAQIRiskLevel(station.aqi)
              const isFavorite = favorites.includes(station.city)
              
              return (
                <div
                  key={idx}
                  className="group"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer relative"
                    onClick={() => setExpandedCity(isExpanded ? null : station.city)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${getAQIGradient(station.aqi)}`}></div>
                    
                    <div className="p-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative">
                        {/* Header with Favorite Button */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{station.city}</h3>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${riskInfo.bg} ${riskInfo.color}`}>
                                {getAQILabel(station.aqi)}
                              </span>
                              <span className={`text-xs font-semibold px-2 py-1 rounded text-gray-600 bg-gray-100`}>
                                Risk: {riskInfo.level}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(station.city)
                              }}
                              className="text-2xl transition-transform hover:scale-125 transform duration-200"
                            >
                              {isFavorite ? '❤️' : '🤍'}
                            </button>
                            <div className={`text-4xl font-bold px-3 py-2 rounded-xl bg-gradient-to-br ${getAQIGradient(station.aqi)} text-white shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                              {station.aqi}
                            </div>
                          </div>
                        </div>
                        
                        {/* Pollutant Mini-Grid */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="bg-gray-50 rounded-lg p-2 text-center group-hover:bg-blue-50 transition-colors">
                            <div className="text-xs text-gray-500 font-medium">PM2.5</div>
                            <div className="text-sm font-bold text-gray-700">{station.pm25}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 text-center group-hover:bg-green-50 transition-colors">
                            <div className="text-xs text-gray-500 font-medium">PM10</div>
                            <div className="text-sm font-bold text-gray-700">{station.pm10}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 text-center group-hover:bg-purple-50 transition-colors">
                            <div className="text-xs text-gray-500 font-medium">NO₂</div>
                            <div className="text-sm font-bold text-gray-700">{station.no2}</div>
                          </div>
                        </div>

                        {/* Expandable Content */}
                        {isExpanded && (
                          <div className="border-t pt-4 mt-4 animate-fade-in space-y-3">
                            {/* Health Recommendation */}
                            <div className={`p-3 rounded-lg text-sm font-medium ${riskInfo.bg}`}>
                              {getHealthRecommendation(station.aqi)}
                            </div>

                            {/* Progress Bars */}
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-xs font-medium mb-1">
                                  <span>PM2.5 Level</span>
                                  <span className="text-gray-600">{Math.round((station.pm25 / 500) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((station.pm25 / 500) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs font-medium mb-1">
                                  <span>PM10 Level</span>
                                  <span className="text-gray-600">{Math.round((station.pm10 / 500) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((station.pm10 / 500) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            {/* View Full Details Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/location?city=${station.city}`)
                              }}
                              className="w-full py-2 px-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                            >
                              View Detailed Analysis →
                            </button>
                          </div>
                        )}
                        
                        {!isExpanded && (
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              Updated {new Date(station.timestamp).toLocaleTimeString()}
                            </div>
                            <span className="text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to expand
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Interactive Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-green-500">
            <h2 className="text-2xl font-bold text-white">Interactive Pollution Map</h2>
            <p className="text-blue-100 mt-1">Click on markers to view detailed information</p>
          </div>
          <div className="h-[500px]">
            <MapView />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Our Platform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Data</h3>
            <p className="text-gray-600">Get up-to-date air quality information from monitoring stations across India</p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Health Recommendations</h3>
            <p className="text-gray-600">Receive personalized health advice based on current pollution levels</p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Alerts</h3>
            <p className="text-gray-600">Set thresholds and get notified when air quality changes in your area</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Ahead of Air Pollution
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users monitoring air quality in their cities
          </p>
          <button
            onClick={() => navigate('/report')}
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Report Pollution in Your Area
          </button>
        </div>
      </section>
    </div>
  )
}


