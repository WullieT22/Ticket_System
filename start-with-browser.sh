#!/bin/bash

# IT Ticket System - Mac Startup Script with Browser Launch
# This script starts the IT Ticket System and opens it in the default browser

echo "🎫 Starting IT Ticket System with Browser..."
echo "==============================================="

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the correct project directory"
    echo "Please run this script from the Ticket_System directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js first: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install npm (usually comes with Node.js)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
    echo ""
fi

# Start the development server in background
echo "🚀 Starting development server..."
echo "📍 The application will be available at: http://localhost:3000"
echo ""

# Start the server in background
npm run dev &
SERVER_PID=$!

# Wait a moment for the server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server started successfully!"
    echo "🌐 Opening browser..."
    
    # Open the application in the default browser
    open http://localhost:3000
    
    echo ""
    echo "==============================================="
    echo "💡 Tips:"
    echo "   - Press Ctrl+C to stop the server"
    echo "   - Any code changes will auto-reload the page"
    echo "   - Server is running in the background"
    echo "==============================================="
    echo ""
    echo "✋ Press Ctrl+C to stop the server..."
    
    # Wait for the background process
    wait $SERVER_PID
else
    echo "❌ Error: Failed to start the server"
    exit 1
fi
