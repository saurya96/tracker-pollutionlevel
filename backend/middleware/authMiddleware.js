const jwt = require('jsonwebtoken')

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' })
  }
}

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ error: 'Access denied. Admin only.' })
  }
}

// Backward compatibility - simple middleware that passes through
exports.simpleAuth = (req, res, next) => {
  // TODO: check JWT or session token
  next()
}

