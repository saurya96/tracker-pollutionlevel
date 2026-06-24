const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pollution_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Initialize database tables
const initializeDatabase = async () => {
  const connection = await pool.getConnection()
  
  try {
    // Create Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        alert_threshold INT DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `)

    // Create Favorite Cities table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS favorite_cities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        city_name VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_city (user_id, city_name),
        INDEX idx_user_id (user_id)
      )
    `)

    // Create Pollution History table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS pollution_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        city VARCHAR(255) NOT NULL,
        aqi INT NOT NULL,
        pm25 DECIMAL(8, 2),
        pm10 DECIMAL(8, 2),
        no2 DECIMAL(8, 2),
        so2 DECIMAL(8, 2),
        co DECIMAL(8, 2),
        o3 DECIMAL(8, 2),
        temperature DECIMAL(5, 2),
        humidity INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_city (city),
        INDEX idx_created_at (created_at),
        INDEX idx_city_created_at (city, created_at)
      )
    `)

    // Create Reports table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        imageUrl LONGTEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at),
        INDEX idx_user_id (user_id)
      )
    `)

    console.log('✅ MySQL database initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing database:', error.message)
  } finally {
    connection.release()
  }
}

module.exports = {
  pool,
  initializeDatabase
}
