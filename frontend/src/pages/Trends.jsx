import React, { useState, useEffect } from 'react'
import { pollutionAPI } from '../api/pollutionAPI'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Trends() {
  const [selectedCity, setSelectedCity] = useState('Delhi')
  const [timeRange, setTimeRange] = useState('7')
  const [historicalData, setHistoricalData] = useState([])
  const [loading, setLoading] = useState(true)
  const [comparisonCities, setComparisonCities] = useState(['Delhi', 'Mumbai', 'Bangalore'])
  const [showComparison, setShowComparison] = useState(false)

  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad']

  useEffect(() => {
    fetchHistoricalData()
  }, [selectedCity, timeRange])

  const fetchHistoricalData = async () => {
    setLoading(true)
    try {
      const data = await pollutionAPI.getHistoricalData(selectedCity, parseInt(timeRange))
      setHistoricalData(data)
    } catch (err) {
      console.error('Failed to fetch historical data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#00e400'
    if (aqi <= 100) return '#ffff00'
    if (aqi <= 150) return '#ff7e00'
    if (aqi <= 200) return '#ff0000'
    if (aqi <= 300) return '#8f3f97'
    return '#7e0023'
  }

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
    if (aqi <= 200) return 'Unhealthy'
    if (aqi <= 300) return 'Very Unhealthy'
    return 'Hazardous'
  }

  // Chart data for historical AQI
  const chartData = {
    labels: historicalData.map(d => new Date(d.created_at || d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'AQI',
        data: historicalData.map(d => d.aqi),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: historicalData.map(d => getAQIColor(d.aqi)),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            const aqi = context.parsed.y
            return `AQI: ${aqi} (${getAQICategory(aqi)})`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return value
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  // Pollutant breakdown chart
  const pollutantData = historicalData.length > 0 ? {
    labels: ['PM2.5', 'PM10', 'NO₂', 'SO₂', 'CO', 'O₃'],
    datasets: [
      {
        label: 'Average Concentration',
        data: [
          historicalData.reduce((sum, d) => sum + (parseFloat(d.pm25) || 0), 0) / historicalData.length,
          historicalData.reduce((sum, d) => sum + (parseFloat(d.pm10) || 0), 0) / historicalData.length,
          historicalData.reduce((sum, d) => sum + (parseFloat(d.no2) || 0), 0) / historicalData.length,
          historicalData.reduce((sum, d) => sum + (parseFloat(d.so2) || 0), 0) / historicalData.length,
          historicalData.reduce((sum, d) => sum + (parseFloat(d.co) || 0), 0) / historicalData.length,
          historicalData.reduce((sum, d) => sum + (parseFloat(d.o3) || 0), 0) / historicalData.length,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(168, 85, 247, 0.7)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(249, 115, 22)',
          'rgb(234, 179, 8)',
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  } : null

  const pollutantOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(2)} µg/m³`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  const avgAQI = historicalData.length > 0
    ? Math.round(historicalData.reduce((sum, d) => sum + d.aqi, 0) / historicalData.length)
    : 0

  const maxAQI = historicalData.length > 0
    ? Math.max(...historicalData.map(d => d.aqi))
    : 0

  const minAQI = historicalData.length > 0
    ? Math.min(...historicalData.map(d => d.aqi))
    : 0

  const goodDays = historicalData.filter(d => d.aqi <= 50).length
  const moderateDays = historicalData.filter(d => d.aqi > 50 && d.aqi <= 100).length
  const unhealthyDays = historicalData.filter(d => d.aqi > 100).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-500 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl animate-float">
            📈
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Air Quality Trends
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analyze historical data and track air quality patterns over time
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span className="mr-2">🏙️</span>
                Select City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-400 cursor-pointer"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Time Range Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span className="mr-2">📅</span>
                Time Period
              </label>
              <div className="flex space-x-2">
                {['7', '14', '30'].map(days => (
                  <button
                    key={days}
                    onClick={() => setTimeRange(days)}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                      timeRange === days
                        ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-semibold">Average AQI</span>
              <span className="text-3xl">📊</span>
            </div>
            <div className={`text-4xl font-bold mb-2`} style={{ color: getAQIColor(avgAQI) }}>
              {avgAQI}
            </div>
            <div className="text-sm text-gray-500">{getAQICategory(avgAQI)}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-semibold">Peak AQI</span>
              <span className="text-3xl">⚠️</span>
            </div>
            <div className={`text-4xl font-bold mb-2`} style={{ color: getAQIColor(maxAQI) }}>
              {maxAQI}
            </div>
            <div className="text-sm text-gray-500">Highest recorded</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-semibold">Best AQI</span>
              <span className="text-3xl">✅</span>
            </div>
            <div className={`text-4xl font-bold mb-2`} style={{ color: getAQIColor(minAQI) }}>
              {minAQI}
            </div>
            <div className="text-sm text-gray-500">Lowest recorded</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-semibold">Good Days</span>
              <span className="text-3xl">🌟</span>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {goodDays}
            </div>
            <div className="text-sm text-gray-500">AQI ≤ 50</div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-slide-up-delay">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-3 text-3xl">📉</span>
              AQI Trend - {selectedCity}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Good</span>
              <div className="w-3 h-3 rounded-full bg-yellow-500 ml-3"></div>
              <span>Moderate</span>
              <div className="w-3 h-3 rounded-full bg-red-500 ml-3"></div>
              <span>Unhealthy</span>
            </div>
          </div>
          
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pollutant Breakdown */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3 text-3xl">🧪</span>
              Pollutant Breakdown
            </h2>
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : pollutantData ? (
              <div className="h-80">
                <Bar data={pollutantData} options={pollutantOptions} />
              </div>
            ) : null}
          </div>

          {/* Air Quality Distribution */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up-delay">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3 text-3xl">📊</span>
              Air Quality Distribution
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="font-semibold text-gray-700">Good Days</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{goodDays}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                    style={{ width: `${(goodDays / historicalData.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {((goodDays / historicalData.length) * 100).toFixed(1)}% of days
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="font-semibold text-gray-700">Moderate Days</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{moderateDays}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-1000"
                    style={{ width: `${(moderateDays / historicalData.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {((moderateDays / historicalData.length) * 100).toFixed(1)}% of days
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="font-semibold text-gray-700">Unhealthy Days</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{unhealthyDays}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-1000"
                    style={{ width: `${(unhealthyDays / historicalData.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {((unhealthyDays / historicalData.length) * 100).toFixed(1)}% of days
                </p>
              </div>

              {/* Summary Card */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border-2 border-blue-200">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Insight
                </h3>
                <p className="text-sm text-gray-700">
                  {goodDays > moderateDays + unhealthyDays 
                    ? `Great news! ${selectedCity} had mostly good air quality over the past ${timeRange} days.`
                    : unhealthyDays > goodDays
                    ? `Air quality in ${selectedCity} needs improvement. Consider checking pollution sources.`
                    : `${selectedCity} had mixed air quality conditions. Stay informed and take precautions when needed.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
