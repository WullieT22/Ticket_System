#!/bin/bash

# IT Ticket System - Cross-Platform Setup Script
# This script prepares the project to run on both Mac and Windows

echo "🔧 Setting up IT Ticket System for cross-platform use..."
echo "======================================================="

# Make all shell scripts executable (Mac/Linux)
echo "📁 Making shell scripts executable..."
chmod +x *.sh 2>/dev/null || echo "Note: chmod not available (likely Windows)"

# Check if Node.js is installed
if command -v node &> /dev/null; then
    echo "✅ Node.js version: $(node --version)"
else
    echo "❌ Node.js not found. Please install from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    echo "✅ npm version: $(npm --version)"
else
    echo "❌ npm not found. Please install Node.js which includes npm"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Fix security vulnerabilities
echo ""
echo "🔒 Fixing security vulnerabilities..."
npm audit fix --force

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo ""
    echo "📝 Creating .gitignore file..."
    cat > .gitignore << EOL
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.tgz
*.tar.gz

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/

# OS
Thumbs.db
*.log
EOL
    echo "✅ .gitignore created"
fi

echo ""
echo "🎉 Setup complete! Your project is ready for both Mac and Windows."
echo ""
echo "📋 Quick Start Options:"
echo "   macOS:    ./start-with-browser.sh"
echo "   Windows:  start-with-browser.bat"
echo "   Any:      npm run dev"
echo ""
echo "📚 See QUICKSTART.md for all available startup methods"
echo "📖 See STARTUP-GUIDE.md for detailed instructions"
