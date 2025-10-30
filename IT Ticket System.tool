#!/bin/bash

# IT Ticket System Launcher - macOS Terminal Tool
echo "🎫 IT Ticket System Launcher"
echo "============================"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📂 Working directory: $SCRIPT_DIR"

# Check if we have the main script
if [ ! -f "start-with-browser.sh" ]; then
    echo "❌ Error: start-with-browser.sh not found!"
    echo "Make sure this launcher is in the Ticket_System folder"
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ Found start-with-browser.sh"
echo "🚀 Starting IT Ticket System..."
echo ""

# Execute the main script
./start-with-browser.sh

echo ""
echo "🏁 Script finished. Press Enter to close this window..."
read
