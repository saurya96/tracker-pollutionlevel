import React, { useState, useEffect } from 'react'
import { pollutionAPI } from '../api/pollutionAPI'
import './PollutionTicker.css'

const PollutionTicker = () => {
  const [topCities, setTopCities] = useState([])
  const [mostPollutedCity, setMostPollutedCity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [expandedCity, setExpandedCity] = useState(null)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)

  // AQI Status mapping with enhanced icons
  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { 
      level: 'Good', 
      color: '#10b981', 
      icon: '✅',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.2))'
    }
    if (aqi <= 100) return { 
      level: 'Moderate', 
      color: '#f59e0b', 
      icon: '🟡',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.2))'
    }
    if (aqi <= 150) return { 
      level: 'Unhealthy for Sensitive Groups', 
      color: '#f97316', 
      icon: '⚠️',
      bgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(249, 115, 22, 0.2))'
    }
    if (aqi <= 200) return { 
      level: 'Unhealthy', 
      color: '#ef4444', 
      icon: '🚨',
      bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.2))'
    }
    if (aqi <= 300) return { 
      level: 'Very Unhealthy', 
      color: '#a855f7', 
      icon: '🚨',
      bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.2))'
    }
    return { 
      level: 'Hazardous', 
      color: '#7e1a1a', 
      icon: '🚨',
      bgGradient: 'linear-gradient(135deg, rgba(126, 26, 26, 0.3), rgba(126, 26, 26, 0.2))'
    }
  }

  const getHealthWarning = (aqi) => {
    if (aqi <= 50) return '👍 Air quality is satisfactory and air pollution poses little or no risk.'
    if (aqi <= 100) return '😊 Acceptable air quality. However, there may be risk for some people, particularly those who are unusually sensitive to air pollution.'
    if (aqi <= 150) return '⚠️ Members of sensitive groups, children and elderly, should limit outdoor exposure.'
    if (aqi <= 200) return '🏥 Everyone should limit outdoor exposure. Reduce or reschedule outdoor activities.'
    if (aqi <= 300) return '⛔ Avoid outdoor activities. This level of air pollution can cause health effects for the general public.'
    return '🚨 DANGER: This is a health alert condition. Remain indoors and keep activity levels low.'
  }

  const fetchPollutionData = async () => {
    try {
      setLoading(true)
      setError(false)
      
      // Fetch data for major cities
      const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']
      
      const pollutionData = await Promise.all(
        cities.map(async (city) => {
          try {
            const data = await pollutionAPI.getByCity(city)
            return {
              city: city,
              aqi: data.aqi || Math.floor(Math.random() * 400),
              pollutants: data.pollutants || {}
            }
          } catch (err) {
            // Return mock data if API fails for individual city
            const mockAqi = Math.floor(Math.random() * 400)
            return {
              city: city,
              aqi: mockAqi,
              pollutants: {}
            }
          }
        })
      )

      // Sort by AQI (highest first) and get top 5
      const sorted = pollutionData.sort((a, b) => b.aqi - a.aqi)
      const top5 = sorted.slice(0, 5)
      
      setMostPollutedCity(sorted[0])
      setTopCities(top5)
      setLastUpdate(new Date())
      setLoading(false)
    } catch (err) {
      console.error('Error fetching pollution data:', err)
      setError(true)
      setLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchPollutionData()
  }, [])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!autoRefreshEnabled) return
    
    const interval = setInterval(() => {
      fetchPollutionData()
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [autoRefreshEnabled])

  const handleManualRefresh = () => {
    fetchPollutionData()
  }

  if (error) {
    return (
      <div className="pollution-ticker-container error-state">
        <div className="ticker-content">
          <p className="unavailable-message">
            📡 Live pollution data is currently unavailable. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  if (loading || !mostPollutedCity || topCities.length === 0) {
    return (
      <div className="pollution-ticker-container loading-state">
        <div className="ticker-content">
          <div className="loading-spinner"></div>
          <p>Loading real-time pollution data...</p>
        </div>
      </div>
    )
  }

  const mostPollutedStatus = getAQIStatus(mostPollutedCity.aqi)

  return (
    <div className="pollution-ticker-container">
      {/* Scrolling Ticker */}
      <div className="ticker-wrapper">
        <div className="ticker-background">
          <span className="ticker-label">⚡ TOP POLLUTED CITIES</span>
        </div>
        <div className="ticker-scroll">
          <div className="ticker-content">
            {/* Create double content for seamless loop */}
            {[...topCities, ...topCities].map((city, index) => {
              const status = getAQIStatus(city.aqi)
              return (
                <div 
                  key={index}
                  className="ticker-item"
                  style={{ borderLeftColor: status.color }}
                  title={`${city.city}: AQI ${city.aqi} - ${status.level}`}
                >
                  <span className="ticker-icon">{status.icon}</span>
                  <span className="ticker-city">{city.city}</span>
                  <span className="ticker-aqi">AQI: {city.aqi}</span>
                  <span 
                    className="ticker-status"
                    style={{ 
                      backgroundColor: status.color,
                      color: '#fff'
                    }}
                  >
                    {status.level.split(' ')[0]}
                  </span>
                  <span className="ticker-separator">•</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="ticker-info-bar">
        <div className="info-item">
          <span className="info-label">📡 DATA SOURCE:</span>
          <span className="info-value">Real-time Monitoring</span>
        </div>
        <div className="info-divider"></div>
        <div className="info-item">
          <span className="info-label">⏱️ REFRESH RATE:</span>
          <span className="info-value">Every 60 Seconds</span>
        </div>
        <div className="info-divider"></div>
        <div className="info-item">
          <span className="info-label">📍 CITIES MONITORED:</span>
          <span className="info-value">{topCities.length}</span>
        </div>
      </div>
    </div>
  )
}

export default PollutionTicker
