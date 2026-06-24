const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const userAPI = {
  // Register new user
  async register(name, email, password) {
    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = data?.error || data?.message || 'Registration failed'
        const err = new Error(msg)
        err.status = res.status
        throw err
      }
      return data
    } catch (error) {
      console.error('Error registering user:', error)
      throw error
    }
  },

  // Login user
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = data?.error || data?.message || 'Login failed'
        const err = new Error(msg)
        err.status = res.status
        throw err
      }
      return data
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    }
  },

  // Set alert threshold
  async setAlertThreshold(alertThreshold, token) {
    try {
      const res = await fetch(`${API_BASE}/users/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ alertThreshold })
      })
      if (!res.ok) throw new Error('Failed to set alert threshold')
      return res.json()
    } catch (error) {
      console.error('Error setting alert threshold:', error)
      throw error
    }
  },

  // Get user alerts
  async getAlerts(token) {
    try {
      const res = await fetch(`${API_BASE}/users/alerts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Failed to get alerts')
      return res.json()
    } catch (error) {
      console.error('Error getting alerts:', error)
      throw error
    }
  },

  // Backward compatibility
  async signup(email) {
    const res = await fetch(`${API_BASE}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    return res.json()
  }
}

