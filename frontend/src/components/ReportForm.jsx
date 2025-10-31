import React, { useState } from 'react'
import { reportAPI } from '../api/reportAPI'

export default function ReportForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      // TODO: capture user location or let user pick on map
      const coords = [-73.97, 40.75]
      await reportAPI.createReport({ title, description, location: { type: 'Point', coordinates: coords } })
      alert('Report submitted!')
      setTitle('')
      setDescription('')
    } catch (err) {
      setError('Failed to submit report. Please try again.')
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      {error && <div style={{ color: 'red', padding: '0.5rem', background: '#fee' }}>{error}</div>}
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <button type="submit">Submit Report</button>
    </form>
  )
}
