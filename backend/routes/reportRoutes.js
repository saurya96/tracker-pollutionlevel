const express = require('express')
const router = express.Router()
const controller = require('../controllers/reportController')
const { verifyToken, isAdmin, optionalAuth } = require('../middleware/authMiddleware')

// POST /api/report - Create new report (auth optional - anonymous reports allowed)
router.post('/', controller.createReport)

// GET /api/report/all - Get all reports
router.get('/all', controller.getAllReports)

// DELETE /api/report/:id - Delete report (admin only)
router.delete('/:id', verifyToken, isAdmin, controller.deleteReport)

// PATCH /api/report/:id/status - Update report status (admin only)
router.patch('/:id/status', verifyToken, isAdmin, controller.updateStatus)

// Backward compatibility
router.get('/', controller.listReports)

module.exports = router
