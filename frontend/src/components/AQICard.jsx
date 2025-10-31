import React, { useEffect, useState } from 'react'
import { pollutionAPI } from '../api/pollutionAPI'

export default function AQICard({ stationId }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!stationId) return
    pollutionAPI.getById(stationId)
      .then(setData)
      .catch(err => console.error('Error loading station:', err))
  }, [stationId])

  if (!data) return <div>Loading...</div>
  return (
    <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
      <h2>{data.name}</h2>
      <p>AQI: {data.aqi}</p>
      <p>PM2.5: {data.pollutants?.pm25}</p>
    </div>
  )
}
