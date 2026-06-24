const { pool } = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// User registration
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    const connection = await pool.getConnection()

    try {
      // Check if user already exists
      const [existingUser] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      )

      if (existingUser.length > 0) {
        return res.status(409).json({ error: 'Email already registered' })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Create new user
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password, alert_threshold) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, 100]
      )

      const userId = result.insertId

      // Generate JWT token
      const token = jwt.sign(
        { id: userId, email: email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      )

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: userId,
          name: name,
          email: email,
          alertThreshold: 100
        }
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Registration error:', error)
    if (error.code === 'ER_NO_REFERENCED_TABLE' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(503).json({ error: 'MySQL server disconnected. Please check database connection.' })
    }
    res.status(500).json({ error: 'Server error' })
  }
}

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const connection = await pool.getConnection()

    try {
      // Find user
      const [users] = await connection.execute(
        'SELECT id, name, email, password, alert_threshold FROM users WHERE email = ?',
        [email]
      )

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const user = users[0]

      // Check password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      )

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          alertThreshold: user.alert_threshold
        }
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Login error:', error)
    if (error.code === 'ER_NO_REFERENCED_TABLE' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(503).json({ error: 'MySQL server disconnected. Please check database connection.' })
    }
    res.status(500).json({ error: 'Server error' })
  }
}

// Set alert threshold
exports.setAlert = async (req, res) => {
  try {
    const { alertThreshold } = req.body
    const userId = req.user.id

    if (alertThreshold === undefined || alertThreshold < 0) {
      return res.status(400).json({ error: 'Valid alert threshold is required' })
    }

    const connection = await pool.getConnection()

    try {
      // Check if user exists
      const [users] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      )

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Update alert threshold
      await connection.execute(
        'UPDATE users SET alert_threshold = ? WHERE id = ?',
        [alertThreshold, userId]
      )

      res.json({
        message: 'Alert threshold updated successfully',
        alertThreshold: alertThreshold
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Set alert error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get user alerts
exports.getAlerts = async (req, res) => {
  try {
    const userId = req.user.id

    const connection = await pool.getConnection()

    try {
      const [users] = await connection.execute(
        'SELECT alert_threshold FROM users WHERE id = ?',
        [userId]
      )

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json({
        alertThreshold: users[0].alert_threshold
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Get alerts error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get user favorites
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id

    const connection = await pool.getConnection()

    try {
      const [favorites] = await connection.execute(
        `SELECT id, city_name as city, latitude as lat, longitude as lon, added_at as addedAt 
         FROM favorite_cities WHERE user_id = ? ORDER BY added_at DESC`,
        [userId]
      )

      res.json({
        favoriteCities: favorites || []
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Get favorites error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Add favorite city
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id
    const { city, lat, lon } = req.body

    if (!city) {
      return res.status(400).json({ error: 'City name is required' })
    }

    const connection = await pool.getConnection()

    try {
      // Check if user exists
      const [users] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      )

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Check if city is already favorited
      const [existing] = await connection.execute(
        'SELECT id FROM favorite_cities WHERE user_id = ? AND LOWER(city_name) = LOWER(?)',
        [userId, city]
      )

      if (existing.length > 0) {
        return res.status(400).json({ error: 'City already in favorites' })
      }

      // Add to favorites
      await connection.execute(
        'INSERT INTO favorite_cities (user_id, city_name, latitude, longitude) VALUES (?, ?, ?, ?)',
        [userId, city, lat || null, lon || null]
      )

      // Return updated favorites
      const [favorites] = await connection.execute(
        `SELECT id, city_name as city, latitude as lat, longitude as lon, added_at as addedAt 
         FROM favorite_cities WHERE user_id = ? ORDER BY added_at DESC`,
        [userId]
      )

      res.status(201).json({
        message: 'City added to favorites',
        favoriteCities: favorites
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Add favorite error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Remove favorite city
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id
    const { city } = req.params

    if (!city) {
      return res.status(400).json({ error: 'City name is required' })
    }

    const connection = await pool.getConnection()

    try {
      // Check if user exists
      const [users] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      )

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Remove from favorites
      await connection.execute(
        'DELETE FROM favorite_cities WHERE user_id = ? AND LOWER(city_name) = LOWER(?)',
        [userId, city]
      )

      // Return updated favorites
      const [favorites] = await connection.execute(
        `SELECT id, city_name as city, latitude as lat, longitude as lon, added_at as addedAt 
         FROM favorite_cities WHERE user_id = ? ORDER BY added_at DESC`,
        [userId]
      )

      res.json({
        message: 'City removed from favorites',
        favoriteCities: favorites
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Remove favorite error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id

    const connection = await pool.getConnection()

    try {
      // Get user profile
      const [users] = await connection.execute(
        'SELECT id, name, email, alert_threshold, created_at FROM users WHERE id = ?',
        [userId]
      )

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      const user = users[0]

      // Get user favorites
      const [favorites] = await connection.execute(
        `SELECT id, city_name as city, latitude as lat, longitude as lon, added_at as addedAt 
         FROM favorite_cities WHERE user_id = ? ORDER BY added_at DESC`,
        [userId]
      )

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          alertThreshold: user.alert_threshold,
          favoriteCities: favorites,
          createdAt: user.created_at
        }
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Backward compatibility
exports.signup = async (req, res) => {
  return exports.register(req, res)
}
