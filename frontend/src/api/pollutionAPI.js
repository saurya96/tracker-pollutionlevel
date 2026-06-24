const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const pollutionAPI = {
  // Get pollution data by city
  async getByCity(city) {
    try {
      const res = await fetch(`${API_BASE}/pollution?city=${encodeURIComponent(city)}`)
      if (!res.ok) throw new Error('Failed to fetch pollution data')
      return res.json()
    } catch (error) {
      console.error('Error fetching pollution data:', error)
      throw error
    }
  },

  // Get historical data
  async getHistoricalData(city, days = 7) {
    try {
      const res = await fetch(`${API_BASE}/pollution/history?city=${encodeURIComponent(city)}&days=${days}`)
      if (!res.ok) throw new Error('Failed to fetch historical data')
      return res.json()
    } catch (error) {
      console.error('Error fetching historical data:', error)
      throw error
    }
  },

  // Get nearby stations
  async getNearby({ lat, lon, radius } = {}) {
    try {
      const res = await fetch(`${API_BASE}/pollution/nearby`)
      if (!res.ok) throw new Error('Failed to fetch nearby stations')
      return res.json()
    } catch (error) {
      console.error('Error fetching nearby stations:', error)
      throw error
    }
  },

  // Add pollution data (admin only)
  async addData(data, token) {
    try {
      const res = await fetch(`${API_BASE}/pollution/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to add pollution data')
      return res.json()
    } catch (error) {
      console.error('Error adding pollution data:', error)
      throw error
    }
  },

  // Backward compatibility
  async getById(id) {
    const res = await fetch(`${API_BASE}/pollution/${id}`)
    return res.json()
  },

  async getHistory(id, hours = 24) {
    const res = await fetch(`${API_BASE}/pollution/${id}/history?hours=${hours}`)
    return res.json()
  }
}

