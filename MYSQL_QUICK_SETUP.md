# Quick Setup - MySQL Migration

## Status: ✅ COMPLETE

Backend is running on **http://localhost:4000**

---

## Step 1: Create MySQL Database

```bash
mysql -u root

# In MySQL shell:
CREATE DATABASE pollution_tracker;
EXIT;
```

## Step 2: Configure Environment

Edit `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=              # (leave blank if no password)
DB_NAME=pollution_tracker
PORT=4000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Step 3: Start Backend

```bash
cd backend
npm install                # (already done if mysql2 installed)
npm run dev
```

**Expected output:**
```
✅ MySQL database initialized
✅ Backend listening on port 4000
```

## Step 4: Test It

```bash
# Health check
curl http://localhost:4000/api/health

# Get pollution data
curl "http://localhost:4000/api/pollution?city=Delhi"

# Register user
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## Quick Reference

| Item | Details |
|------|---------|
| **Database** | MySQL (pollution_tracker) |
| **Driver** | mysql2 ^3.6.5 |
| **Backend Port** | 4000 |
| **Authentication** | JWT (7 days) |
| **Password Hashing** | bcryptjs (10 rounds) |
| **Status** | ✅ Running |

---

## Tables Created Automatically

- ✅ `users` - User accounts
- ✅ `favorite_cities` - Favorite cities per user
- ✅ `pollution_history` - Pollution data over time

---

## API Endpoints

**No authentication:**
- `GET /api/pollution?city=Delhi` - Get AQI
- `GET /api/pollution/nearby` - Get all cities
- `GET /api/pollution/history?city=Delhi&days=7` - Historical data

**With JWT token:**
- `POST /api/users/register` - New account
- `POST /api/users/login` - Login & get token
- `GET /api/users/profile` - User info
- `GET /api/users/favorites` - Saved cities
- `POST /api/users/favorites` - Add favorite
- `DELETE /api/users/favorites/:city` - Remove favorite

---

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- MySQL server not running: `sudo service mysql start`
- Wrong password in .env
- User 'root' doesn't exist

### "Port 4000 already in use"
- Kill existing process: `lsof -i :4000` then `kill -9 <PID>`
- Or use different port: Change `PORT=5000` in .env

### "Table 'pollution_tracker.users' doesn't exist"
- Database not created: Run `CREATE DATABASE pollution_tracker;` in MySQL
- Or backend will create tables on startup

### Backend starts but MySQL disconnected
- This is OK! Backend works with mock data
- Connect MySQL and restart for real data
- All endpoints still work

---

## Frontend Integration

**No changes needed!** React frontend works as-is:
- Same API endpoints
- Same response format
- No code changes required

```javascript
// This still works perfectly
const response = await axios.post('http://localhost:4000/api/users/register', {
  name: 'John',
  email: 'john@example.com',
  password: 'password123'
})
```

---

## What Changed

### ❌ Removed
- mongoose package
- MongoDB connection
- MONGODB_URI environment variable

### ✅ Added
- mysql2 package
- MySQL connection pool
- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME variables

### ✅ Converted
- User authentication (now MySQL queries)
- Favorite cities (now MySQL tables)
- Pollution data (now MySQL queries)
- Error handling (MySQL-specific)

---

## File Summary

```
✅ backend/config/db.js
   → MySQL connection & table creation

✅ backend/controllers/userController.js
   → User auth & favorites (MySQL queries)

✅ backend/controllers/pollutionController.js
   → Pollution data (MySQL queries)

✅ backend/controllers/reportController.js
   → Reports (MySQL queries)

✅ backend/server.js
   → Initialization & health check

✅ backend/.env
   → MySQL configuration
```

---

## That's It! 🎉

**Your pollution tracker is now using MySQL!**

1. ✅ Create database
2. ✅ Configure .env
3. ✅ Run `npm run dev`
4. ✅ Backend ready at http://localhost:4000
5. ✅ Frontend works unchanged

**Start here:**
```bash
cd backend && npm run dev
```

For detailed info, see: **MONGODB_TO_MYSQL_MIGRATION.md**
