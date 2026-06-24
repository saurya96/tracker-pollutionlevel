# 🧪 Backend API Testing Guide

## Quick Test Commands

### 1️⃣ **User Registration**
```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "Test User",
    "email": "test@example.com",
    "alertThreshold": 100
  }
}
```

---

### 2️⃣ **User Login**
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Save the token for next requests!**

---

### 3️⃣ **Get User Profile** (Protected)
```bash
curl -X GET http://localhost:4000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 4️⃣ **Add Favorite City** (Protected)
```bash
curl -X POST http://localhost:4000/api/users/favorites \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Delhi",
    "lat": 28.6139,
    "lon": 77.2090
  }'
```

---

### 5️⃣ **Get Favorite Cities** (Protected)
```bash
curl -X GET http://localhost:4000/api/users/favorites \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 6️⃣ **Remove Favorite City** (Protected)
```bash
curl -X DELETE http://localhost:4000/api/users/favorites/Delhi \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 7️⃣ **Get Pollution Data by City**
```bash
curl -X GET "http://localhost:4000/api/pollution?city=Delhi"
```

---

### 8️⃣ **Get Historical Pollution Data**
```bash
curl -X GET "http://localhost:4000/api/pollution/history?city=Delhi&days=7"
```

---

### 9️⃣ **Get Nearby Monitoring Stations**
```bash
curl -X GET http://localhost:4000/api/pollution/nearby
```

---

### 🔟 **Set Alert Threshold** (Protected)
```bash
curl -X POST http://localhost:4000/api/users/alerts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "alertThreshold": 150
  }'
```

---

### 1️⃣1️⃣ **Get Alert Settings** (Protected)
```bash
curl -X GET http://localhost:4000/api/users/alerts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 1️⃣2️⃣ **Create Pollution Report**
```bash
curl -X POST http://localhost:4000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Delhi Main Street",
    "description": "Heavy smoke pollution observed",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

---

### 1️⃣3️⃣ **Get All Reports**
```bash
curl -X GET http://localhost:4000/api/reports/all
```

---

## 📊 **Response Status Codes**

| Code | Meaning | Example |
|------|---------|---------|
| 200 | ✅ Success | GET request successful |
| 201 | ✅ Created | User registered, resource created |
| 400 | ❌ Bad Request | Missing required fields |
| 401 | ❌ Unauthorized | Invalid credentials, missing token |
| 404 | ❌ Not Found | User/resource not found |
| 409 | ❌ Conflict | Email already registered |
| 500 | ❌ Server Error | Database connection failed |
| 503 | ❌ Service Unavailable | MongoDB not running |

---

## 🎯 **Complete Features**

✅ **All 5 Features Implemented:**

| # | Feature | Status | Endpoints |
|---|---------|--------|-----------|
| 1 | API Routes | ✅ Complete | 15+ endpoints |
| 2 | Database Storage | ✅ Complete | 3 models (User, Pollution, Report) |
| 3 | User Login | ✅ Complete | Register, Login, JWT Auth |
| 4 | Favorite Cities | ✅ Complete (NEW) | Add, Remove, Get, List |
| 5 | Pollution History | ✅ Complete | 7, 14, 30 day history |

---

## 🔐 **Protected vs Public Endpoints**

### **Public Endpoints** (No auth required)
- POST /api/users/register
- POST /api/users/login
- GET /api/pollution?city=X
- GET /api/pollution/history
- GET /api/pollution/nearby
- POST /api/reports

### **Protected Endpoints** (Requires Bearer token)
- GET /api/users/profile
- GET /api/users/alerts
- POST /api/users/alerts
- GET /api/users/favorites ⭐ NEW
- POST /api/users/favorites ⭐ NEW
- DELETE /api/users/favorites/:city ⭐ NEW

---

## 📝 **Environment Variables (.env)**

```env
# MongoDB Connection (optional)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db

# Server Port
PORT=4000

# JWT Secret (Change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Skip Database (Use mock data)
SKIP_DB=true
```

---

## ✨ **New Favorite Cities Feature**

### Add to Favorites
```bash
POST /api/users/favorites
{ "city": "Delhi", "lat": 28.6139, "lon": 77.2090 }
```

### Get All Favorites
```bash
GET /api/users/favorites
```

Response:
```json
{
  "favoriteCities": [
    {
      "city": "Delhi",
      "lat": 28.6139,
      "lon": 77.2090,
      "addedAt": "2026-05-26T10:30:00Z"
    }
  ]
}
```

### Remove from Favorites
```bash
DELETE /api/users/favorites/Delhi
```

---

## 🚀 **Start Backend Server**

```bash
cd backend
npm run dev
# Backend listening on port 4000
```

