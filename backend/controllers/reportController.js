const { pool } = require('../config/db')

// Create new pollution report
exports.createReport = async (req, res) => {
  try {
    const { location, description, imageUrl, lat, lon } = req.body
    const userId = req.user ? req.user.id : null

    if (!location || !description) {
      return res.status(400).json({ error: 'Location and description are required' })
    }

    const connection = await pool.getConnection()

    try {
      // Insert into reports table
      const [result] = await connection.execute(
        `INSERT INTO reports (user_id, location, description, imageUrl, latitude, longitude, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [userId, location, description, imageUrl || null, lat || null, lon || null]
      )

      const reportId = result.insertId

      res.status(201).json({
        message: 'Report submitted successfully',
        report: {
          id: reportId,
          location: location,
          description: description,
          imageUrl: imageUrl || null,
          latitude: lat,
          longitude: lon,
          status: 'pending',
          created_at: new Date()
        }
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Create report error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const connection = await pool.getConnection()

    try {
      const [reports] = await connection.execute(
        `SELECT id, user_id, location, description, imageUrl, latitude, longitude, status, created_at, updated_at
         FROM reports
         ORDER BY created_at DESC
         LIMIT 100`
      )

      res.json(reports || [])
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Get reports error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Delete report (admin only)
exports.deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id

    const connection = await pool.getConnection()

    try {
      const [result] = await connection.execute(
        `DELETE FROM reports WHERE id = ?`,
        [reportId]
      )

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Report not found' })
      }

      res.json({ message: 'Report deleted successfully' })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Delete report error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Update report status (admin only)
exports.updateStatus = async (req, res) => {
  try {
    const reportId = req.params.id
    const { status } = req.body

    if (!['pending', 'verified', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const connection = await pool.getConnection()

    try {
      const [result] = await connection.execute(
        `UPDATE reports SET status = ? WHERE id = ?`,
        [status, reportId]
      )

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Report not found' })
      }

      res.json({
        message: 'Report status updated',
        status: status
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Backward compatibility
exports.listReports = async (req, res) => {
  return exports.getAllReports(req, res)
}

