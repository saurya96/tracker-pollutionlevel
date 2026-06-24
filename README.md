# Pollution Tracker

This repository contains a frontend (Vite + React) and a backend (Express + Mongoose) for tracking pollution data and user reports.

Structure:
- frontend/: React app built with Vite
- backend/: Express server with Mongoose models

To run locally:

Frontend:
1. cd frontend
2. npm install
3. npm run dev

Backend:
1. cd backend
2. npm install
3. Create a .env with MONGODB_URI if you want persistence
4. npm start
# Pollution Tracker

This repository contains the Pollution Tracker project (frontend + backend).

Structure:
- `frontend/` — Vite + React frontend
- `backend/` — Express + Mongoose backend

How to run (dev):

1. Frontend
   - cd frontend
   - npm install
   - npm run dev

2. Backend
   - cd backend
   - npm install
   - set `MONGODB_URI` in `.env`
   - npm run dev

I will initialize a git repo here and create an initial commit when you confirm.# Pollution Tracker

A full-stack web application for real-time air quality monitoring with interactive maps, historical trends, and community reporting.

## 🌟 Features

- **Real-time Map** - Interactive Leaflet map showing pollution stations
- **Station Details** - AQI cards with pollutant breakdowns
- **Historical Charts** - 24-hour PM2.5 trends using Chart.js
- **Community Reports** - User-submitted incident reporting
- **Responsive Design** - Mobile-friendly React frontend

## 📂 Structure

```
pollution-tracker/
├── backend/          # Node.js + Express + MongoDB
├── frontend/         # React + Vite
└── start.sh          # Quick start script
```

## 🚀 Quick Start

### Option 1: Automated (Linux/Mac)

```bash
cd pollution-tracker
./start.sh
```

### Option 2: Manual

1. **Install MongoDB** (optional - backend will run without it):
```bash
sudo apt install mongodb
sudo systemctl start mongodb
```

2. **Start Backend**:
```bash
cd backend
npm install
npm run dev
```

3. **Start Frontend** (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

4. **Open Browser**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000/api/health

## 📡 API Endpoints

- `GET /api/pollution/nearby?lat=&lon=&radius=` - Get nearby stations
- `GET /api/pollution/:id` - Get station details
- `GET /api/pollution/:id/history?hours=24` - Get historical data
- `POST /api/reports` - Submit community report
- `POST /api/users/signup` - User signup

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- CORS enabled

**Frontend:**
- React 18
- Vite (dev server + build)
- React Router (navigation)
- Leaflet (maps)
- Chart.js (charts)

## 📝 Environment Variables

**Backend** (`backend/.env`):
```
MONGODB_URI=mongodb://localhost:27017/pollution_tracker
PORT=4000
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:4000/api
```

## 🔧 Development

- Backend runs on port **4000** with hot reload via nodemon
- Frontend runs on port **5173** with Vite HMR
- API proxy configured in `vite.config.js`

## 🚢 Deployment

**Frontend (Vercel):**
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

**Backend (Render/Railway):**
- Set `MONGODB_URI` environment variable
- Deploy with `npm start`

## ⚠️ Notes

- Mock data is used for station readings (replace with real API in production)
- MongoDB is optional for development (backend gracefully handles missing DB)
- Update security dependencies: `npm audit fix`

## 📦 Next Steps

- [ ] Integrate real pollution API (OpenAQ, PurpleAir)
- [ ] Add user authentication (JWT)
- [ ] Implement push notifications
- [ ] Add data caching layer (Redis)
- [ ] Deploy to production
