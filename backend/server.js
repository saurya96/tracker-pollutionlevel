require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const authRoutes = require('./routes/authRoutes')
const { pool, initializeDatabase } = require('./config/db')

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Simple request logger to help debug frontend <-> backend requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next()
})

// Initialize MySQL database tables on startup
const startServer = async () => {
  try {
    await initializeDatabase()
    console.log('✅ MySQL database initialized')
  } catch (err) {
    console.error('⚠️ Error initializing database:', err.message)
    console.log('Continuing with server startup...')
  }

  // Routes
  app.use('/api/pollution', require('./routes/pollutionRoutes'))
  app.use('/api/reports', require('./routes/reportRoutes'))

  app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/auth', authRoutes)
  // Health check
  app.get('/api/health', async (req, res) => {
    try {
      const connection = await pool.getConnection()
      await connection.ping()
      connection.release()
      res.json({ status: 'ok', db: 'connected' })
    } catch (error) {
      res.json({ status: 'ok', db: 'disconnected', error: error.message })
    }
  })

  // Serve frontend static when built (adjust path if deploying differently)
  if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')
    app.use(express.static(frontendDist))
    app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')))
  }

  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => console.log(`✅ Backend listening on port ${PORT}`))
}

startServer().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

module.exports = app;