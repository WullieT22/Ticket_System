#!/bin/bash

# IT Ticket System - Mac Startup Script with Browser Launch
# This script starts the IT Ticket System and opens it in the default browser
# The .command extension makes it double-clickable on macOS

echo "🎫 Starting IT Ticket System with Browser..."
echo "==============================================="

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the correct project directory"
    echo "Please run this script from the Ticket_System directory"
    echo "Current directory: $(pwd)"
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js first: https://nodejs.org/"
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install npm (usually comes with Node.js)"
    read -p "Press Enter to exit..."
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
        read -p "Press Enter to exit..."
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
    echo ""
fi

# Start the development server in background
echo "🚀 Starting development server..."
echo "📍 The application will be available at: http://localhost:3000 (or next available port)"
echo ""

# Start the server in background and capture output
npm run dev > server_output.tmp 2>&1 &
SERVER_PID=$!

# Wait a moment for the server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server started successfully!"
    
    # Try to detect the actual port from the output
    ACTUAL_PORT=3000
    if grep -q "trying 3001 instead" server_output.tmp 2>/dev/null; then
        ACTUAL_PORT=3001
        echo "📍 Server is running on port 3001 (3000 was in use)"
    elif grep -q "trying 3002 instead" server_output.tmp 2>/dev/null; then
        ACTUAL_PORT=3002
        echo "📍 Server is running on port 3002"
    else
        echo "📍 Server is running on port 3000"
    fi
    
    echo "🌐 Opening browser at http://localhost:$ACTUAL_PORT..."
    
    # Open the application in the default browser with the correct port
    open "http://localhost:$ACTUAL_PORT"
    
    echo ""
    echo "==============================================="
    echo "💡 Tips:"
    echo "   - Press Ctrl+C to stop the server"
    echo "   - Any code changes will auto-reload the page"
    echo "   - Close this window to stop the server"
    echo "==============================================="
    echo ""
    echo "✋ Press Enter to stop the server or close this window..."
    
    # Wait for user input or the background process to end
    read -t 1 dummy 2>/dev/null
    while kill -0 $SERVER_PID 2>/dev/null; do
        read -t 1 dummy 2>/dev/null
        if [ $? -eq 0 ]; then
            break
        fi
    done
    
    # Clean shutdown
    echo "🛑 Stopping server..."
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
    
    # Clean up temporary files
    rm -f server_output.tmp
    echo "✅ Server stopped"
else
    echo "❌ Error: Failed to start the server"
    read -p "Press Enter to exit..."
    exit 1
fi