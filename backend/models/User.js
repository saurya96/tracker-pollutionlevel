const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  alertThreshold: { type: Number, default: 100 }, // AQI level for alerts
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)
