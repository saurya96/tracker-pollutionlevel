require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

// DB
const db = require('./config/db')
db.connect()

// Routes
app.use('/api/pollution', require('./routes/pollutionRoutes'))
app.use('/api/reports', require('./routes/reportRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Serve frontend static when built (adjust path if deploying differently)
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')
  app.use(express.static(frontendDist))
  app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')))
}

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`))
