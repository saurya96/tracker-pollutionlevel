const express = require('express')
const router = express.Router()
const controller = require('../controllers/pollutionController')

// GET /api/pollution?city=Delhi - Get current pollution data by city
router.get('/', controller.getPollutionByCity)

// GET /api/pollution/history?city=Delhi&days=7 - Get historical data
router.get('/history', controller.getHistoricalData)

// GET /api/pollution/nearby - Get nearby monitoring stations
router.get('/nearby', controller.getNearby)

// POST /api/pollution/add - Add pollution data (admin only)
router.post('/add', controller.addPollutionData)

// Backward compatibility routes
// GET /api/pollution/:id
router.get('/:id', controller.getById)
// GET /api/pollution/:id/history
router.get('/:id/history', controller.getHistory)

module.exports = router
