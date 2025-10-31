const Report = require('../models/Report')
const mongoose = require('mongoose')

// Create new pollution report
exports.createReport = async (req, res) => {
  try {
    const { location, description, imageUrl, lat, lon } = req.body
    const userId = req.user ? req.user.id : null

    if (!location || !description) {
      return res.status(400).json({ error: 'Location and description are required' })
    }

    const reportData = {
      userId,
      location,
      description,
      imageUrl,
      status: 'pending'
    }

    // Add coordinates if provided
    if (lat !== undefined && lon !== undefined) {
      reportData.coordinates = {
        type: 'Point',
        coordinates: [lon, lat]
      }
    }

    const newReport = new Report(reportData)

    // If MongoDB is connected, save normally. If not, return a mock success
    if (mongoose.connection.readyState === 1) {
      await newReport.save()
      return res.status(201).json({
        message: 'Report submitted successfully',
        report: {
          id: newReport._id,
          location: newReport.location,
          description: newReport.description,
          imageUrl: newReport.imageUrl,
          status: newReport.status,
          date: newReport.date
        }
      })
    }

    // If DB not available, return a mock created response so frontend can work offline
    console.log('Database not available, returning mock report response')
    return res.status(201).json({
      message: 'Report submitted (mock)',
      report: {
        id: `mock-${Date.now()}`,
        location: reportData.location,
        description: reportData.description,
        imageUrl: reportData.imageUrl,
        status: reportData.status,
        date: new Date()
      }
    })
  } catch (error) {
    console.error('Create report error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ date: -1 })
      .limit(100)
      .populate('userId', 'name email')

    res.json(reports)
  } catch (error) {
    console.error('Get reports error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Delete report (admin only)
exports.deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id

    const report = await Report.findById(reportId)
    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    await Report.findByIdAndDelete(reportId)

    res.json({ message: 'Report deleted successfully' })
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

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    )

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    res.json({
      message: 'Report status updated',
      report
    })
  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Backward compatibility
exports.listReports = async (req, res) => {
  return exports.getAllReports(req, res)
}

