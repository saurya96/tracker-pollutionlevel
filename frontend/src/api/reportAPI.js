const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const reportAPI = {
  // Create new report (token optional - anonymous reports allowed)
  async createReport({ location, description, imageUrl, lat, lon }, token) {
    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      
      // Add authorization header only if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

  const res = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ location, description, imageUrl, lat, lon })
      })
      if (!res.ok) throw new Error('Failed to create report')
      return res.json()
    } catch (error) {
      console.error('Error creating report:', error)
      throw error
    }
  },

  // Get all reports
  async getAllReports() {
    try {
  const res = await fetch(`${API_BASE}/reports/all`)
      if (!res.ok) throw new Error('Failed to fetch reports')
      return res.json()
    } catch (error) {
      console.error('Error fetching reports:', error)
      throw error
    }
  },

  // Delete report (admin only)
  async deleteReport(reportId, token) {
    try {
  const res = await fetch(`${API_BASE}/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Failed to delete report')
      return res.json()
    } catch (error) {
      console.error('Error deleting report:', error)
      throw error
    }
  },

  // Update report status (admin only)
  async updateStatus(reportId, status, token) {
    try {
  const res = await fetch(`${API_BASE}/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error('Failed to update status')
      return res.json()
    } catch (error) {
      console.error('Error updating status:', error)
      throw error
    }
  },

  // Backward compatibility
  async listReports() {
    const res = await fetch(`${API_BASE}/reports`)
    return res.json()
  }
}

