import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { pollutionAPI } from '../api/pollutionAPI'

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapView() {
  const [stations, setStations] = useState([])

  useEffect(() => {
    pollutionAPI.getNearby({ lat: 40.75, lon: -73.97, radius: 50 })
      .then(setStations)
      .catch(err => console.error('Error loading stations:', err))
  }, [])

  return (
    <MapContainer center={[40.75, -73.97]} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {stations.map(s => (
        <Marker key={s.id} position={[s.lat, s.lon]}>
          <Popup>
            {s.name} - AQI {s.aqi}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
