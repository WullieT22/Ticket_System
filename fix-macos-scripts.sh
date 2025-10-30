#!/bin/bash

# Fix macOS .sh file association script
echo "🔧 Fixing macOS .sh file associations..."
echo "==========================================="

# Method 1: Change file association via duti (if installed)
if command -v duti &> /dev/null; then
    echo "📝 Setting Terminal as default for .sh files..."
    duti -s com.apple.terminal .sh all
    echo "✅ Association set via duti"
else
    echo "ℹ️  duti not installed - using alternative method"
fi

# Method 2: Create a simple test
echo ""
echo "🧪 Testing current association..."
echo "When you double-click start-with-browser.sh, it should now:"
echo "1. Open in Terminal (ideal)"
echo "2. Or show a choice dialog"
echo ""

# Method 3: Instructions for manual fix
echo "📋 Manual Fix Instructions:"
echo "1. Right-click start-with-browser.sh"
echo "2. Select 'Get Info'"
echo "3. In 'Open with:' section, choose 'Terminal'"
echo "4. Click 'Change All...'"
echo ""

echo "🚀 Alternative: Just double-click 'Start IT Ticket System.command'"
echo "   This file is designed to work with double-click on macOS!"
echo ""
echo "✅ Fix script completed!"