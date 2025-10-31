#!/bin/bash
# Quick start script for pollution tracker

echo "🚀 Starting Pollution Tracker..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  Warning: MongoDB doesn't appear to be running"
    echo "   Install MongoDB: sudo apt install mongodb"
    echo "   Start MongoDB: sudo systemctl start mongodb"
    echo ""
fi

# Start backend
echo "📡 Starting backend server..."
cd backend
npm install --silent
node server.js &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Start frontend
echo "🎨 Starting frontend dev server..."
cd frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Servers started!"
echo "   Backend:  http://localhost:4000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
