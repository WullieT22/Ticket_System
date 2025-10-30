#!/bin/bash

# IT Ticket System - Mac Application Launcher
# This creates a proper macOS app bundle that can be double-clicked

echo "🎫 Creating IT Ticket System Mac App..."
echo "======================================="

# Create the app bundle structure
APP_NAME="IT Ticket System"
APP_BUNDLE="${APP_NAME}.app"
APP_DIR="$APP_BUNDLE/Contents"
MACOS_DIR="$APP_DIR/MacOS"
RESOURCES_DIR="$APP_DIR/Resources"

# Remove existing app bundle if it exists
if [ -d "$APP_BUNDLE" ]; then
    echo "🗑️  Removing existing app bundle..."
    rm -rf "$APP_BUNDLE"
fi

# Create directory structure
echo "📁 Creating app bundle structure..."
mkdir -p "$MACOS_DIR"
mkdir -p "$RESOURCES_DIR"

# Create the Info.plist file
echo "📝 Creating Info.plist..."
cat > "$APP_DIR/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>IT Ticket System</string>
    <key>CFBundleIdentifier</key>
    <string>com.company.it-ticket-system</string>
    <key>CFBundleName</key>
    <string>IT Ticket System</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.9</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

# Create the executable script
echo "⚙️  Creating executable script..."
cat > "$MACOS_DIR/IT Ticket System" << 'EOF'
#!/bin/bash

# Get the directory where the app bundle is located
APP_PATH="$(dirname "$(dirname "$(dirname "$0")")")"
PROJECT_DIR="$(dirname "$APP_PATH")"

# Change to the project directory
cd "$PROJECT_DIR"

# Source the main startup script
if [ -f "start-with-browser.sh" ]; then
    ./start-with-browser.sh
else
    echo "❌ Error: start-with-browser.sh not found in $PROJECT_DIR"
    echo "Please run this app from the Ticket_System directory"
    read -p "Press Enter to exit..."
    exit 1
fi
EOF

# Make the executable script actually executable
chmod +x "$MACOS_DIR/IT Ticket System"

# Create an icon (optional - using emoji as icon)
echo "🎨 Creating app icon..."
echo "🎫" > "$RESOURCES_DIR/icon.txt"

echo ""
echo "✅ Mac app bundle created successfully!"
echo "📱 App location: $APP_BUNDLE"
echo ""
echo "🚀 How to use:"
echo "   1. Double-click '$APP_BUNDLE' to launch"
echo "   2. Or drag it to Applications folder"
echo "   3. Or create alias on Desktop/Dock"
echo ""
echo "🎉 Your IT Ticket System is now a proper Mac app!"