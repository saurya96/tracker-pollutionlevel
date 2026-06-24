const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const { pool } = require('../config/db')

// Register Route
router.post('/register', async (req, res) => {

  try {

    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    res.json({
      success: true,
      message: 'User registered successfully'
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    })

  }

})

// Login Route
router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body

    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (users.length === 0) {

      return res.status(401).json({
        success: false,
        message: 'User not found'
      })

    }

    const user = users[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      })

    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: 'dummy-jwt-token'
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: 'Login failed'
    })

  }

})

module.exports = router