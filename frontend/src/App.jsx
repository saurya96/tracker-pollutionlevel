import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Location from './pages/Location'
import Trends from './pages/Trends'
import Alerts from './pages/Alerts'
import Report from './pages/Report'
import About from './pages/About'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Support both query-param and path-param location routes */}
        <Route path="/location" element={<Location />} />
        <Route path="/location/:id" element={<Location />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/report" element={<Report />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
