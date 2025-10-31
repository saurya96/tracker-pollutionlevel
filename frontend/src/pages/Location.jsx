import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { pollutionAPI } from '../api/pollutionAPI'
import ChartSection from '../components/ChartSection'

export default function Location() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const city = searchParams.get('city') || 'Delhi'
  
  const [pollutionData, setPollutionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await pollutionAPI.getByCity(city)
        setPollutionData(data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch pollution data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [city])

  const getAQIGradient = (aqi) => {
    if (aqi <= 50) return 'from-green-400 to-green-600'
    if (aqi <= 100) return 'from-yellow-400 to-yellow-600'
    if (aqi <= 150) return 'from-orange-400 to-orange-600'
    if (aqi <= 200) return 'from-red-400 to-red-600'
    if (aqi <= 300) return 'from-purple-400 to-purple-600'
    return 'from-red-800 to-red-950'
  }

  const pollutantInfo = {
    pm25: { name: 'PM2.5', desc: 'Fine Particulate Matter', unit: 'µg/m³', icon: '🔬' },
    pm10: { name: 'PM10', desc: 'Coarse Particulate Matter', unit: 'µg/m³', icon: '💨' },
    no2: { name: 'NO₂', desc: 'Nitrogen Dioxide', unit: 'ppb', icon: '🏭' },
    so2: { name: 'SO₂', desc: 'Sulfur Dioxide', unit: 'ppb', icon: '⚗️' },
    co: { name: 'CO', desc: 'Carbon Monoxide', unit: 'ppm', icon: '🚗' },
    o3: { name: 'O₃', desc: 'Ozone', unit: 'ppb', icon: '☀️' },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading air quality data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Home</span>
        </button>

        {/* City Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{city}</h1>
          <p className="text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Last updated: {new Date(pollutionData?.timestamp).toLocaleString()}
          </p>
        </div>

        {/* AQI Hero Card */}
        <div className={`mb-8 rounded-3xl shadow-2xl overflow-hidden animate-slide-up bg-gradient-to-r ${getAQIGradient(pollutionData?.aqi)}`}>
          <div className="p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <p className="text-xl md:text-2xl font-semibold mb-2 opacity-90">Air Quality Index</p>
                <h2 className="text-7xl md:text-8xl font-bold mb-4">{pollutionData?.aqi || 'N/A'}</h2>
                <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm px-6 py-2 rounded-full">
                  <p className="text-2xl font-bold">{pollutionData?.category || 'Unknown'}</p>
                </div>
              </div>
              <div className="max-w-md">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Health Impact
                  </h3>
                  <p className="mb-4 text-sm opacity-90">{pollutionData?.healthImplication}</p>
                  <div className="pt-3">
                    <p className="text-sm font-semibold mb-1">Recommendation:</p>
                    <p className="text-sm opacity-90">{pollutionData?.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pollutants Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-3xl mr-3">🔬</span>
            Pollutant Levels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pollutionData?.pollutants && Object.entries(pollutionData.pollutants).map(([key, value]) => {
              const info = pollutantInfo[key] || { name: key.toUpperCase(), desc: '', unit: '', icon: '📊' }
              return (
                <div key={key} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-3xl mb-2">{info.icon}</p>
                      <p className="text-sm font-semibold text-gray-700">{info.name}</p>
                      <p className="text-xs text-gray-500">{info.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">{value?.toFixed(1) || 'N/A'}</p>
                      <p className="text-xs text-gray-500 mt-1">{info.unit}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Historical Chart */}
        <ChartSection city={city} />

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <h4 className="text-xl font-bold mb-3">💡 Did You Know?</h4>
            <p className="text-blue-100">
              PM2.5 particles are so small that they can penetrate deep into your lungs and even enter your bloodstream. 
              Regular monitoring helps you make informed decisions about outdoor activities.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <h4 className="text-xl font-bold mb-3">🌱 Take Action</h4>
            <p className="text-green-100">
              Help improve air quality by using public transport, planting trees, and reporting pollution sources. 
              Every small action counts toward cleaner air for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


