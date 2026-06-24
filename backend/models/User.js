const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  alertThreshold: { type: Number, default: 100 }, // AQI level for alerts
  favoriteCities: [
    {
      city: { type: String, required: true },
      lat: { type: Number },
      lon: { type: Number },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Index for quick lookups
UserSchema.index({ email: 1 })
UserSchema.index({ 'favoriteCities.city': 1 })

module.exports = mongoose.model('User', UserSchema)
