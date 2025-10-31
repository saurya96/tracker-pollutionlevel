const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// User registration
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      alertThreshold: 100 // Default threshold
    })

    await newUser.save()

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        alertThreshold: newUser.alertThreshold
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
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

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        alertThreshold: user.alertThreshold
      }
    })
  } catch (error) {
    console.error('Login error:', error)
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

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    user.alertThreshold = alertThreshold
    await user.save()

    res.json({
      message: 'Alert threshold updated successfully',
      alertThreshold: user.alertThreshold
    })
  } catch (error) {
    console.error('Set alert error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get user alerts
exports.getAlerts = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId).select('alertThreshold')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      alertThreshold: user.alertThreshold
    })
  } catch (error) {
    console.error('Get alerts error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Backward compatibility
exports.signup = async (req, res) => {
  return exports.register(req, res)
}

