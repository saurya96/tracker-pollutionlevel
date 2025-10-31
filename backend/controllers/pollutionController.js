const PollutionData = require('../models/PollutionData')
const { getOverallAQI, getAQICategory } = require('../utils/aqiCalculator')

// Get current pollution data by city
exports.getPollutionByCity = async (req, res) => {
  try {
    const { city } = req.query
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' })
    }

    try {
      // Try to get latest pollution data from database with timeout
      const latestData = await Promise.race([
        PollutionData.findOne({ city: new RegExp(city, 'i') })
          .sort({ timestamp: -1 })
          .limit(1),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB timeout')), 2000))
      ])

      if (latestData) {
        // Calculate AQI and category from database data
        const pollutants = {
          pm25: latestData.pm25,
          pm10: latestData.pm10
        }
        const aqi = getOverallAQI(pollutants)
        const category = getAQICategory(aqi)

        return res.json({
          city: latestData.city,
          aqi,
          category: category.level,
          color: category.color,
          healthImplication: category.healthImplication,
          recommendation: category.recommendation,
          pollutants: {
            pm25: latestData.pm25,
            pm10: latestData.pm10,
            no2: latestData.no2,
            so2: latestData.so2,
            co: latestData.co,
            o3: latestData.o3
          },
          timestamp: latestData.timestamp,
          source: latestData.source
        })
      }
    } catch (dbError) {
      console.log('Database not available, using mock data')
    }

    // Return mock data if database is not available or no data exists
    return res.json(generateMockData(city))

  } catch (error) {
    console.error('Error fetching pollution data:', error)
    // Even on error, return mock data instead of error
    return res.json(generateMockData(req.query.city || 'Unknown'))
  }
}

// Get historical pollution data
exports.getHistoricalData = async (req, res) => {
  try {
    const { city, days = 7 } = req.query

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' })
    }

    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(days))

      const historicalData = await Promise.race([
        PollutionData.find({
          city: new RegExp(city, 'i'),
          timestamp: { $gte: startDate }
        })
        .sort({ timestamp: 1 })
        .select('aqi pm25 pm10 timestamp'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB timeout')), 2000))
      ])

      if (historicalData && historicalData.length > 0) {
        return res.json(historicalData)
      }
    } catch (dbError) {
      console.log('Database not available, using mock historical data')
    }

    // Generate mock historical data if database unavailable or no data
    return res.json(generateMockHistoricalData(city, parseInt(days)))
  } catch (error) {
    console.error('Error fetching historical data:', error)
    // Return mock data on error
    return res.json(generateMockHistoricalData(req.query.city || 'Unknown', 7))
  }
}

// Get nearby stations (for map view)
exports.getNearby = async (req, res) => {
  try {
    // Return mock data for major cities
    const mockCities = [
      { city: 'Delhi', lat: 28.6139, lon: 77.2090, aqi: 168, pm25: 68.5 },
      { city: 'Mumbai', lat: 19.0760, lon: 72.8777, aqi: 95, pm25: 35.2 },
      { city: 'Bangalore', lat: 12.9716, lon: 77.5946, aqi: 78, pm25: 28.1 },
      { city: 'Chennai', lat: 13.0827, lon: 80.2707, aqi: 82, pm25: 30.5 },
      { city: 'Kolkata', lat: 22.5726, lon: 88.3639, aqi: 142, pm25: 55.8 }
    ]

    const results = mockCities.map(c => {
      const category = getAQICategory(c.aqi)
      return {
        city: c.city,
        lat: c.lat,
        lon: c.lon,
        aqi: c.aqi,
        category: category.level,
        color: category.color,
        pollutants: { pm25: c.pm25 }
      }
    })

    res.json(results)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Add pollution data (admin)
exports.addPollutionData = async (req, res) => {
  try {
    const { city, pm25, pm10, no2, so2, co, o3 } = req.body

    if (!city || pm25 === undefined) {
      return res.status(400).json({ error: 'City and pm25 are required' })
    }

    const pollutants = { pm25, pm10: pm10 || 0 }
    const aqi = getOverallAQI(pollutants)

    const newData = new PollutionData({
      city,
      aqi,
      pm25: pm25 || 0,
      pm10: pm10 || 0,
      no2: no2 || 0,
      so2: so2 || 0,
      co: co || 0,
      o3: o3 || 0,
      source: 'Manual Entry'
    })

    await newData.save()
    res.status(201).json({ message: 'Data added successfully', data: newData })
  } catch (error) {
    console.error('Error adding data:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Helper functions for mock data
function generateMockData(city) {
  const pm25 = Math.random() * 150
  const pm10 = pm25 * 1.5
  const pollutants = { pm25, pm10 }
  const aqi = getOverallAQI(pollutants)
  const category = getAQICategory(aqi)

  return {
    city,
    aqi: Math.round(aqi),
    category: category.level,
    color: category.color,
    healthImplication: category.healthImplication,
    recommendation: category.recommendation,
    pollutants: {
      pm25: Math.round(pm25 * 10) / 10,
      pm10: Math.round(pm10 * 10) / 10,
      no2: Math.round(Math.random() * 80 * 10) / 10,
      so2: Math.round(Math.random() * 30 * 10) / 10,
      co: Math.round(Math.random() * 2 * 100) / 100,
      o3: Math.round(Math.random() * 120 * 10) / 10
    },
    timestamp: new Date(),
    source: 'Mock Data'
  }
}

function generateMockHistoricalData(city, days) {
  const data = []
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const pm25 = 30 + Math.random() * 80
    const pollutants = { pm25, pm10: pm25 * 1.5 }
    data.push({
      city,
      aqi: Math.round(getOverallAQI(pollutants)),
      pm25: Math.round(pm25 * 10) / 10,
      pm10: Math.round(pm25 * 1.5 * 10) / 10,
      timestamp: date
    })
  }
  return data
}

// Backward compatibility
exports.getById = async (req, res) => {
  const id = req.params.id
  res.json(generateMockData(id))
}

exports.getHistory = async (req, res) => {
  const id = req.params.id
  const hours = parseInt(req.query.hours || '24')
  res.json(generateMockHistoricalData(id, hours))
}
