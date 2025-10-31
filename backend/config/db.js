const mongoose = require('mongoose')

module.exports = {
  async connect() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pollution_tracker'
    try {
      await mongoose.connect(uri)
      console.log('✅ MongoDB connected successfully')
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message)
      console.log('⚠️  Server will run without database. Install MongoDB or check connection string.')
    }
  }
}
