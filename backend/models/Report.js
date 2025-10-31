const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
  // Make userId optional to allow anonymous reports
  userId: { type: String },
  location: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  date: { type: Date, default: Date.now },
  // Additional fields
  // Use GeoJSON-style `coordinates` to match controller output
  coordinates: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number] }
  },
  status: { type: String, enum: ['pending', 'verified', 'resolved'], default: 'pending' }
})

ReportSchema.index({ coordinates: '2dsphere' })
module.exports = mongoose.model('Report', ReportSchema)
