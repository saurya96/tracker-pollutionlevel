import React from 'react'

export default function About() {
  const features = [
    {
      icon: '🌍',
      title: 'Real-Time Monitoring',
      description: 'Access live air quality data from monitoring stations across India'
    },
    {
      icon: '📊',
      title: 'Historical Data',
      description: 'View trends and patterns in air quality over time'
    },
    {
      icon: '🔔',
      title: 'Custom Alerts',
      description: 'Set personalized AQI thresholds and receive notifications'
    },
    {
      icon: '📝',
      title: 'Community Reports',
      description: 'Submit and view pollution incident reports in your area'
    },
    {
      icon: '💡',
      title: 'Health Recommendations',
      description: 'Get actionable advice based on current air quality levels'
    },
    {
      icon: '🗺️',
      title: 'Interactive Maps',
      description: 'Explore pollution levels across different locations'
    }
  ]

  const dataSources = [
    {
      name: 'OpenAQ',
      description: 'Open-source platform aggregating air quality data from public sources worldwide',
      url: 'https://openaq.org'
    },
    {
      name: 'EPA Standards',
      description: 'US Environmental Protection Agency AQI calculation methodology',
      url: 'https://www.epa.gov'
    },
    {
      name: 'Community Reports',
      description: 'User-submitted pollution incidents and observations',
      url: null
    }
  ]

  const team = [
    {
      role: 'Project Lead',
      name: 'AirWatch Team',
      description: 'Dedicated to making air quality data accessible to everyone'
    }
  ]

  const aqiBreakpoints = [
    { range: '0-50', level: 'Good', color: 'bg-green-500' },
    { range: '51-100', level: 'Moderate', color: 'bg-yellow-500' },
    { range: '101-150', level: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500' },
    { range: '151-200', level: 'Unhealthy', color: 'bg-red-500' },
    { range: '201-300', level: 'Very Unhealthy', color: 'bg-purple-600' },
    { range: '301+', level: 'Hazardous', color: 'bg-red-900' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">About AirWatch</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            A comprehensive platform for monitoring air quality, understanding health impacts, 
            and taking action for cleaner air in our communities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
            We believe everyone deserves to breathe clean air. AirWatch democratizes access to air quality 
            information, empowering individuals and communities to make informed decisions about their health 
            and environment. By combining real-time data, scientific analysis, and community engagement, 
            we're building a movement for cleaner air across India.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Methodology</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AQI Calculation</h3>
              <p className="text-gray-700 mb-4">
                We calculate the Air Quality Index (AQI) using the US EPA standard methodology, which considers 
                multiple pollutants including PM2.5, PM10, NO₂, SO₂, CO, and O₃. The overall AQI is determined 
                by the highest value among all measured pollutants.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">AQI Categories:</h4>
                <div className="space-y-2">
                  {aqiBreakpoints.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className={`w-24 h-10 ${item.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                        {item.range}
                      </div>
                      <span className="text-gray-700 font-medium">{item.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Collection</h3>
              <p className="text-gray-700">
                Data is collected from multiple sources including government monitoring stations, 
                community sensors, and verified third-party providers. All data points are validated 
                and timestamped to ensure accuracy and reliability.
              </p>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Sources</h2>
          <div className="space-y-4">
            {dataSources.map((source, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{source.name}</h3>
                    <p className="text-gray-700">{source.description}</p>
                  </div>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      Visit →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">⚡</span>
                Frontend
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  React 18 - Modern UI framework
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Vite - Fast build tool
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Tailwind CSS - Utility-first styling
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Leaflet - Interactive maps
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Chart.js - Data visualization
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🔧</span>
                Backend
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Node.js + Express - Server framework
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  MongoDB - Database
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  JWT - Secure authentication
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Bcrypt - Password encryption
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  REST API - Data endpoints
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Team</h2>
          <div className="max-w-2xl mx-auto">
            {team.map((member, idx) => (
              <div key={idx} className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white">
                  🌍
                </div>
                <p className="text-sm text-blue-600 font-semibold mb-1">{member.role}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Get Involved</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                💬
              </div>
              <h3 className="text-xl font-bold mb-2">Contribute Data</h3>
              <p className="text-blue-100">
                Submit pollution reports and help build comprehensive air quality maps
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                🤝
              </div>
              <h3 className="text-xl font-bold mb-2">Partner With Us</h3>
              <p className="text-blue-100">
                Organizations and researchers interested in collaboration
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                📧
              </div>
              <h3 className="text-xl font-bold mb-2">Contact Us</h3>
              <p className="text-blue-100">
                Questions, feedback, or suggestions? We'd love to hear from you
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ Disclaimer</h3>
          <p className="text-yellow-800 text-sm">
            The information provided on this platform is for general informational purposes only. 
            While we strive to keep the information accurate and up-to-date, we make no representations 
            or warranties of any kind about the completeness, accuracy, or reliability of the data. 
            For critical health decisions, please consult official government sources and healthcare professionals.
          </p>
        </div>
      </div>
    </div>
  )
}
