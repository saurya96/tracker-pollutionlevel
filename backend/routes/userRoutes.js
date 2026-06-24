const express = require('express')
const router = express.Router()
const controller = require('../controllers/userController')
const { verifyToken } = require('../middleware/authMiddleware')

// Authentication Routes
// POST /api/users/register - User registration
router.post('/register', controller.register)

// POST /api/users/login - User login
router.post('/login', controller.login)

// Alert Routes
// POST /api/users/alerts - Set alert threshold (protected)
router.post('/alerts', verifyToken, controller.setAlert)

// GET /api/users/alerts - Get user alerts (protected)
router.get('/alerts', verifyToken, controller.getAlerts)

// Favorite Cities Routes
// GET /api/users/favorites - Get user's favorite cities (protected)
router.get('/favorites', verifyToken, controller.getFavorites)

// POST /api/users/favorites - Add favorite city (protected)
router.post('/favorites', verifyToken, controller.addFavorite)

// DELETE /api/users/favorites/:city - Remove favorite city (protected)
router.delete('/favorites/:city', verifyToken, controller.removeFavorite)

// GET /api/users/profile - Get user profile (protected)
router.get('/profile', verifyToken, controller.getProfile)

// Backward compatibility
router.post('/signup', controller.signup)

module.exports = router
