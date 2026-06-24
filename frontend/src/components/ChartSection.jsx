import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { pollutionAPI } from '../api/pollutionAPI'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function ChartSection({ city, stationId }) {
  const [history, setHistory] = useState([])
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        let data
        if (city) {
          data = await pollutionAPI.getHistoricalData(city, days)
        } else if (stationId) {
          data = await pollutionAPI.getHistory(stationId, days * 24)
        }
        setHistory(data || [])
      } catch (err) {
        console.error('Error loading history:', err)
      } finally {
        setLoading(false)
      }
    }

    if (city || stationId) {
      fetchHistory()
    }
  }, [city, stationId, days])

  const chartData = {
    labels: history.map(h => {
      const date = new Date(h.timestamp || h.ts || h.created_at)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'AQI',
        data: history.map(h => h.aqi),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'PM2.5',
        data: history.map(h => h.pm25),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 15,
          font: {
            size: 13,
            weight: '600'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            label += Math.round(context.parsed.y * 10) / 10
            if (context.dataset.label === 'PM2.5') {
              label += ' µg/m³'
            }
            return label
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          },
          padding: 8
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          },
          padding: 8
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  const timeRanges = [
    { value: 7, label: '7 Days' },
    { value: 14, label: '14 Days' },
    { value: 30, label: '30 Days' }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-green-500 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center">
              <span className="text-3xl mr-3">📊</span>
              Historical Trends
            </h3>
            <p className="text-blue-100 mt-1">Track air quality changes over time</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setDays(range.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  days === range.value
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          </div>
        ) : history.length > 0 ? (
          <div className="h-80">
            <Line data={chartData} options={options} />
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">No historical data available</p>
              <p className="text-gray-400 text-sm mt-2">Data will appear once measurements are recorded</p>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {!loading && history.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Average AQI</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(history.reduce((sum, h) => sum + h.aqi, 0) / history.length)}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Average PM2.5</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(history.reduce((sum, h) => sum + h.pm25, 0) / history.length * 10) / 10} <span className="text-sm">µg/m³</span>
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Data Points</p>
              <p className="text-2xl font-bold text-purple-600">{history.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


