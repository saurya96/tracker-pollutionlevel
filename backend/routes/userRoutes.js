const express = require('express')
const router = express.Router()
const controller = require('../controllers/userController')
const { verifyToken } = require('../middleware/authMiddleware')

// POST /api/users/register - User registration
router.post('/register', controller.register)

// POST /api/users/login - User login
router.post('/login', controller.login)

// POST /api/users/alerts - Set alert threshold (protected)
router.post('/alerts', verifyToken, controller.setAlert)

// GET /api/users/alerts - Get user alerts (protected)
router.get('/alerts', verifyToken, controller.getAlerts)

// Backward compatibility
router.post('/signup', controller.signup)

module.exports = router
