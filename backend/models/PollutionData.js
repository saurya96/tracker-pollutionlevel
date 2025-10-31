const mongoose = require('mongoose')

const PollutionDataSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },
  aqi: { type: Number, required: true },
  pm25: { type: Number, required: true },
  pm10: { type: Number, required: true },
  no2: { type: Number, required: true },
  so2: { type: Number, required: true },
  co: { type: Number, required: true },
  o3: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  // Additional fields for compatibility
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number] }
  },
  source: { type: String, default: 'OpenAQ' }
})

PollutionDataSchema.index({ city: 1, timestamp: -1 })
PollutionDataSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('PollutionData', PollutionDataSchema)
