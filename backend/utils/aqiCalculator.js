// Minimal AQI conversions (US EPA) — implement complete formula when needed
// AQI Calculator based on US EPA standards

// PM2.5 AQI Calculation
function calculatePM25AQI(pm25) {
  const breakpoints = [
    [0.0, 12.0, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 350.4, 301, 400],
    [350.5, 500.4, 401, 500]
  ]
  return calculateAQI(pm25, breakpoints)
}

// PM10 AQI Calculation
function calculatePM10AQI(pm10) {
  const breakpoints = [
    [0, 54, 0, 50],
    [55, 154, 51, 100],
    [155, 254, 101, 150],
    [255, 354, 151, 200],
    [355, 424, 201, 300],
    [425, 504, 301, 400],
    [505, 604, 401, 500]
  ]
  return calculateAQI(pm10, breakpoints)
}

// Generic AQI calculation function
function calculateAQI(concentration, breakpoints) {
  for (let [cLow, cHigh, iLow, iHigh] of breakpoints) {
    if (concentration >= cLow && concentration <= cHigh) {
      return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (concentration - cLow) + iLow)
    }
  }
  return concentration < 0 ? 0 : 500
}

// Get overall AQI (maximum of all pollutants)
function getOverallAQI(pollutants) {
  const aqis = []
  
  if (pollutants.pm25) aqis.push(calculatePM25AQI(pollutants.pm25))
  if (pollutants.pm10) aqis.push(calculatePM10AQI(pollutants.pm10))
  
  return aqis.length > 0 ? Math.max(...aqis) : 0
}

// Get AQI category and health information
function getAQICategory(aqi) {
  if (aqi <= 50) {
    return {
      level: 'Good',
      color: '#00e400',
      healthImplication: 'Air quality is satisfactory, and air pollution poses little or no risk.',
      cautionaryStatement: 'None',
      recommendation: 'Enjoy your usual outdoor activities.'
    }
  } else if (aqi <= 100) {
    return {
      level: 'Moderate',
      color: '#ffff00',
      healthImplication: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
      cautionaryStatement: 'Unusually sensitive people should consider limiting prolonged outdoor exertion.',
      recommendation: 'Sensitive individuals should consider reducing prolonged outdoor activities.'
    }
  } else if (aqi <= 150) {
    return {
      level: 'Unhealthy for Sensitive Groups',
      color: '#ff7e00',
      healthImplication: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
      cautionaryStatement: 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.',
      recommendation: 'Sensitive groups should reduce prolonged or heavy outdoor exertion.'
    }
  } else if (aqi <= 200) {
    return {
      level: 'Unhealthy',
      color: '#ff0000',
      healthImplication: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.',
      cautionaryStatement: 'Active children and adults, and people with respiratory disease, should avoid prolonged outdoor exertion; everyone else should limit prolonged outdoor exertion.',
      recommendation: 'Everyone should avoid prolonged outdoor exertion. Sensitive groups should avoid all outdoor exertion.'
    }
  } else if (aqi <= 300) {
    return {
      level: 'Very Unhealthy',
      color: '#8f3f97',
      healthImplication: 'Health alert: The risk of health effects is increased for everyone.',
      cautionaryStatement: 'Active children and adults, and people with respiratory disease, should avoid all outdoor exertion; everyone else should limit outdoor exertion.',
      recommendation: 'Everyone should avoid all outdoor exertion.'
    }
  } else {
    return {
      level: 'Hazardous',
      color: '#7e0023',
      healthImplication: 'Health warning of emergency conditions: everyone is more likely to be affected.',
      cautionaryStatement: 'Everyone should avoid all outdoor exertion.',
      recommendation: 'Everyone should remain indoors and keep activity levels low.'
    }
  }
}

module.exports = {
  calculatePM25AQI,
  calculatePM10AQI,
  getOverallAQI,
  getAQICategory,
  calculateAQI
}

