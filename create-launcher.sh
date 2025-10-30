#!/bin/bash

# Create a standalone launcher that definitely works on macOS
echo "🚀 Creating Standalone IT Ticket System Launcher..."
echo "=================================================="

# Create a simple executable script with .tool extension (Terminal recognizes this)
cat > "IT Ticket System.tool" << 'EOF'
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
EOF

# Make it executable
chmod +x "IT Ticket System.tool"

echo "✅ Created: IT Ticket System.tool"
echo ""
echo "🎯 How to use:"
echo "1. Double-click 'IT Ticket System.tool'"
echo "2. Should open in Terminal and run automatically"
echo ""
echo "📝 If it still opens in text editor:"
echo "1. Right-click the .tool file"
echo "2. Choose 'Open With' → 'Terminal'"
echo "3. Check 'Always Open With' if available"
echo ""
echo "🎉 Launcher created successfully!"