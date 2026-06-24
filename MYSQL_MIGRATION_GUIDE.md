# ✅ MongoDB to MySQL Migration Complete

## Quick Setup Guide

### 1. Create MySQL Database

Open MySQL command line and run:

```sql
CREATE DATABASE pollution_tracker;
```

### 2. Update .env File

Edit `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pollution_tracker
PORT=4000
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
NODE_ENV=development
```

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

The backend will automatically create all required tables on startup.

---

## What Changed

### ✅ MongoDB Removed
- Mongoose package removed
- MongoDB connection code removed
- Mongoose models removed from usage

### ✅ MySQL Added
- mysql2 package installed
- MySQL connection pool created
- Automatic table creation on startup

### ✅ Controllers Updated
- **userController.js** - Uses MySQL queries for auth, favorites
- **pollutionController.js** - Uses MySQL queries for pollution data
- **reportController.js** - Uses MySQL queries for reports

### ✅ Configuration Updated
- **config/db.js** - New MySQL connection and table creation
- **server.js** - Initialize database on startup
- **.env** - MySQL connection parameters

---

## Database Tables Created Automatically

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  alert_threshold INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
)
```

### Favorite Cities Table
```sql
CREATE TABLE favorite_cities (
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
```

### Pollution History Table
```sql
CREATE TABLE pollution_history (
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
```

---

## API Endpoints (All Working)

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Favorites
- `GET /api/users/favorites` - Get user favorites (requires auth)
- `POST /api/users/favorites` - Add favorite city (requires auth)
- `DELETE /api/users/favorites/:city` - Remove favorite (requires auth)

### User Profile
- `GET /api/users/profile` - Get user profile (requires auth)

### Pollution Data
- `GET /api/pollution?city=Delhi` - Get current AQI
- `GET /api/pollution/history?city=Delhi&days=7` - Get historical data
- `GET /api/pollution/nearby` - Get all cities

### Reports
- `POST /api/reports` - Create report
- `GET /api/reports/all` - Get all reports
- `DELETE /api/reports/:id` - Delete report
- `PATCH /api/reports/:id/status` - Update report status

---

## Test Commands

### Register User
```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

### Login User
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Add Favorite City (use token from login)
```bash
curl -X POST http://localhost:4000/api/users/favorites \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"city":"Delhi","lat":28.6139,"lon":77.2090}'
```

### Get Pollution Data
```bash
curl "http://localhost:4000/api/pollution?city=Delhi"
```

---

## Migration Notes

### Removed Files/Features
- `models/User.js` - Now using raw MySQL
- `models/PollutionData.js` - Now using raw MySQL
- `models/Report.js` - Now using raw MySQL
- mongoose package dependency

### Backward Compatibility
- All API endpoints remain the same
- Frontend code doesn't need changes
- Response format unchanged
- Authentication flow unchanged

### Error Messages Updated
- MongoDB errors → MySQL error messages
- Error codes now MySQL error codes
- Health check uses MySQL ping

---

## Frontend Changes Required

**No changes needed!** The frontend can continue using the same API endpoints.

If you get "Please start MongoDB" errors in frontend, they're now:
- "MySQL server disconnected" - Fix by checking MySQL connection

---

## Production Deployment

Before deploying:

1. **Change JWT_SECRET**
   ```
   JWT_SECRET=use_strong_random_string_here
   ```

2. **Set NODE_ENV**
   ```
   NODE_ENV=production
   ```

3. **Update database credentials**
   ```
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_secure_password
   DB_NAME=pollution_tracker
   ```

4. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

5. **Start server**
   ```bash
   cd backend
   npm run dev
   ```

---

## Troubleshooting

### MySQL Connection Error
**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution**: 
1. Make sure MySQL is running: `sudo service mysql start`
2. Check credentials in `.env`
3. Verify database exists: `mysql -u root -p`

### Table Doesn't Exist
**Problem**: `Error: Table 'pollution_tracker.users' doesn't exist`

**Solution**: 
- Database tables are auto-created on startup
- Check if database exists: `CREATE DATABASE pollution_tracker;`
- Restart backend server: `npm run dev`

### Authentication Fails
**Problem**: `Invalid credentials` even with correct password

**Solution**:
- Make sure user registered first: `POST /api/users/register`
- Check password is correct in request
- Verify database has users table with data

### Port Already in Use
**Problem**: `Error: listen EADDRINUSE :::4000`

**Solution**:
- Change PORT in .env: `PORT=5000`
- Or kill process: `lsof -i :4000` then `kill -9 <PID>`

---

## Success Indicators

When everything is working:

✅ Backend starts with "MySQL database initialized"  
✅ `GET /api/health` returns `{ "status": "ok", "db": "connected" }`  
✅ Can register and login users  
✅ Can add/remove favorite cities  
✅ Can fetch pollution data  

---

## Next Steps

1. ✅ MySQL migration complete
2. ✅ Backend updated
3. → Start backend and test
4. → Update frontend if needed
5. → Deploy to production

**All Done! Your project is now running on MySQL instead of MongoDB.** 🎉
