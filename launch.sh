#!/bin/bash

# Universal IT Ticket System Launcher
# Automatically detects the operating system and runs the appropriate startup method

echo "🎫 IT Ticket System - Universal Launcher"
echo "========================================"

# Detect operating system
OS="$(uname -s)"
case "${OS}" in
    Darwin*)    
        echo "🍎 macOS detected"
        echo "🚀 Starting with macOS shell script..."
        ./start-with-browser.sh
        ;;
    Linux*)     
        echo "🐧 Linux detected"
        echo "🚀 Starting with npm..."
        npm run dev
        ;;
    CYGWIN*|MINGW32*|MSYS*|MINGW*)     
        echo "🪟 Windows detected (Git Bash/MSYS)"
        echo "🚀 Starting with npm..."
        npm run dev
        ;;
    *)          
        echo "❓ Unknown operating system: ${OS}"
        echo "🚀 Attempting to start with npm..."
        npm run dev
        ;;
esac
