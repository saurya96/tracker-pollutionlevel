# 🚀 Backend Features - Complete Setup Guide

## ✅ All Backend Features Implemented

### 1. **API Routes** ✅

#### **Pollution Routes** (`/api/pollution`)
```
GET  /api/pollution?city=Delhi              # Get current pollution data
GET  /api/pollution/history?city=Delhi&days=7  # Get historical data
GET  /api/pollution/nearby                  # Get nearby monitoring stations
POST /api/pollution/add                     # Add pollution data (admin)
```

#### **User Routes** (`/api/users`)
```
POST /api/users/register                    # Register new user
POST /api/users/login                       # Login user
GET  /api/users/profile                     # Get user profile (protected)
GET  /api/users/alerts                      # Get alert threshold (protected)
POST /api/users/alerts                      # Set alert threshold (protected)
GET  /api/users/favorites                   # Get favorite cities (protected)
POST /api/users/favorites                   # Add favorite city (protected)
DELETE /api/users/favorites/:city           # Remove favorite city (protected)
```

#### **Report Routes** (`/api/reports`)
```
POST /api/reports                           # Create pollution report
GET  /api/reports/all                       # Get all reports
GET  /api/reports                           # List reports
DELETE /api/reports/:id                     # Delete report (admin)
PATCH /api/reports/:id/status               # Update report status (admin)
```

---

### 2. **Database Storage** ✅

#### **MongoDB Collections**

**User Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  alertThreshold: Number (default: 100),
  favoriteCities: [
    {
      city: String,
      lat: Number,
      lon: Number,
      addedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**PollutionData Collection**
```javascript
{
  _id: ObjectId,
  city: String (indexed),
  aqi: Number,
  pm25: Number,
  pm10: Number,
  no2: Number,
  so2: Number,
  co: Number,
  o3: Number,
  timestamp: Date (indexed),
  location: {
    type: "Point",
    coordinates: [longitude, latitude]  // GeoJSON
  },
  source: String
}
```

**Report Collection**
```javascript
{
  _id: ObjectId,
  userId: String,
  location: String,
  description: String,
  imageUrl: String,
  date: Date,
  coordinates: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  status: String (enum: pending, verified, resolved)
}
```

---

### 3. **User Login** ✅

#### **Registration Endpoint**
```bash
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "alertThreshold": 100
  }
}
```

#### **Login Endpoint**
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "alertThreshold": 100
  }
}
```

#### **Authentication**
- ✅ **Password Hashing**: bcryptjs (salt rounds: 10)
- ✅ **JWT Tokens**: 7-day expiration
- ✅ **Token Verification**: Bearer token in Authorization header
- ✅ **Protected Routes**: verifyToken middleware

```bash
# Include token in requests
Authorization: Bearer <your_jwt_token>
```

---

### 4. **Favorite Cities** ✅ (NEW)

#### **Get Favorite Cities**
```bash
GET /api/users/favorites
Authorization: Bearer <token>
```

**Response:**
```json
{
  "favoriteCities": [
    {
      "city": "Delhi",
      "lat": 28.6139,
      "lon": 77.2090,
      "addedAt": "2026-05-26T10:30:00Z"
    },
    {
      "city": "Mumbai",
      "lat": 19.0760,
      "lon": 72.8777,
      "addedAt": "2026-05-26T10:35:00Z"
    }
  ]
}
```

#### **Add Favorite City**
```bash
POST /api/users/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "city": "Bangalore",
  "lat": 12.9716,
  "lon": 77.5946
}
```

**Response:**
```json
{
  "message": "City added to favorites",
  "favoriteCities": [...]
}
```

#### **Remove Favorite City**
```bash
DELETE /api/users/favorites/Delhi
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "City removed from favorites",
  "favoriteCities": [...]
}
```

#### **Features**
- ✅ Multiple favorites per user
- ✅ Duplicate check (prevents adding same city twice)
- ✅ Timestamp tracking (addedAt)
- ✅ Coordinates storage for maps
- ✅ Case-insensitive matching

---

### 5. **Pollution History** ✅

#### **Get Historical Data**
```bash
GET /api/pollution/history?city=Delhi&days=7
```

**Response:**
```json
[
  {
    "city": "Delhi",
    "aqi": 165,
    "pm25": 65.3,
    "pm10": 98.0,
    "timestamp": "2026-05-26T10:00:00Z"
  },
  {
    "city": "Delhi",
    "aqi": 172,
    "pm25": 68.5,
    "pm10": 102.8,
    "timestamp": "2026-05-25T10:00:00Z"
  }
  ...
]
```

#### **Features**
- ✅ Time-range filtering (days parameter)
- ✅ Chronological ordering
- ✅ Multiple pollutants tracked
- ✅ Indexed queries for performance
- ✅ Mock data fallback if DB unavailable

#### **Get Nearby Stations**
```bash
GET /api/pollution/nearby
```

**Response:**
```json
[
  {
    "city": "Delhi",
    "lat": 28.6139,
    "lon": 77.2090,
    "aqi": 168,
    "pm25": 68.5,
    "pm10": 105.2,
    "no2": 65.3,
    "timestamp": "2026-05-26T18:05:00Z",
    "source": "Mock Data"
  },
  ...
]
```

---

## 🔐 **Authentication & Security**

### **Middleware Chain**
```
verifyToken    → Extracts & validates JWT token
isAdmin        → Checks user admin status
optionalAuth   → Optional authentication
```

### **Environment Variables** (.env)
```env
# MongoDB connection (optional - uses mock data if not set)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pollution-tracker

# Server port
PORT=4000

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Skip DB (for testing without MongoDB)
SKIP_DB=true
```

### **Security Features**
- ✅ Password hashing with bcryptjs
- ✅ JWT token expiration (7 days)
- ✅ Protected routes with token verification
- ✅ Environment variables for secrets
- ✅ Error handling without exposing internals

---

## 📊 **Data Models Overview**

### **User Model**
- Authentication (register, login)
- Alert thresholds
- **Favorite cities** (NEW)
- Profile management

### **PollutionData Model**
- Current pollution readings
- Historical data
- Pollutant measurements
- Geospatial indexing

### **Report Model**
- User reports
- Location tracking
- Status management (pending, verified, resolved)
- Admin moderation

---

## 🚀 **Starting the Backend**

### **Option 1: With Mock Data (No MongoDB needed)**
```bash
cd backend
SKIP_DB=true npm run dev
# Backend running on port 4000
```

### **Option 2: With MongoDB**
```bash
# Set MONGODB_URI in .env
cd backend
npm run dev
# Backend running on port 4000
```

### **Production Build**
```bash
cd backend
npm install
NODE_ENV=production npm start
```

---

## ✅ **Feature Checklist**

| Feature | Status | Endpoint | Auth |
|---------|--------|----------|------|
| User Registration | ✅ | POST /api/users/register | No |
| User Login | ✅ | POST /api/users/login | No |
| Get Profile | ✅ | GET /api/users/profile | Yes |
| Set Alerts | ✅ | POST /api/users/alerts | Yes |
| Get Alerts | ✅ | GET /api/users/alerts | Yes |
| Add Favorite | ✅ | POST /api/users/favorites | Yes |
| Remove Favorite | ✅ | DELETE /api/users/favorites/:city | Yes |
| Get Favorites | ✅ | GET /api/users/favorites | Yes |
| Get Pollution | ✅ | GET /api/pollution?city=X | No |
| Get History | ✅ | GET /api/pollution/history | No |
| Get Nearby | ✅ | GET /api/pollution/nearby | No |
| Create Report | ✅ | POST /api/reports | No |
| Get Reports | ✅ | GET /api/reports/all | No |
| Delete Report | ✅ | DELETE /api/reports/:id | Admin |
| Update Status | ✅ | PATCH /api/reports/:id/status | Admin |

---

## 💡 **Usage Examples**

### **Complete User Flow**

1. **Register**
```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure123"
  }'
```

2. **Login**
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123"
  }'
# Returns: { token: "...", user: {...} }
```

3. **Add Favorite City**
```bash
curl -X POST http://localhost:4000/api/users/favorites \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Delhi",
    "lat": 28.6139,
    "lon": 77.2090
  }'
```

4. **Get Favorites**
```bash
curl -X GET http://localhost:4000/api/users/favorites \
  -H "Authorization: Bearer <token>"
```

5. **Get Pollution Data**
```bash
curl -X GET "http://localhost:4000/api/pollution?city=Delhi"
```

---

## 📝 **Notes**

- All protected endpoints require Bearer token in Authorization header
- Favorite cities are indexed for fast queries
- Pollution data supports both database and mock data
- Historical queries are paginated
- Admin operations require isAdmin flag in token

---

## 🎯 **Next Steps**

1. ✅ Connect Real Pollution APIs (OpenWeather, IQAir, WAQI)
2. ✅ Add Email Notifications
3. ✅ Implement Advanced Analytics
4. ✅ Add Caching Layer (Redis)
5. ✅ Create Admin Dashboard

