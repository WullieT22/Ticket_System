# 🚀 Quick Start - IT Ticket System

## 🎯 Fastest Way to Start (Any Platform)

### macOS:
```bash
# Double-click in Finder:
start-with-browser.sh

# Or in Terminal:
./start-with-browser.sh
```

### Windows 11:
```cmd
# Double-click in File Explorer:
start-with-browser.bat

# Or in Command Prompt:
start-with-browser.bat
```

### Universal (Any Platform):
```bash
# In Terminal/Command Prompt:
npm run dev

# Then open browser to:
http://localhost:3000
```

## 📋 All Available Startup Methods

| File | Platform | Description |
|------|----------|-------------|
| `start-with-browser.sh` | macOS | ✅ **Recommended** - Starts server + opens browser |
| `start-ticket-system.sh` | macOS | Starts server only |
| `launch.sh` | macOS/Linux | Universal launcher (auto-detects OS) |
| `start-with-browser.bat` | Windows | ✅ **Recommended** - Starts server + opens browser |
| `start-ticket-system.bat` | Windows | Starts server only |
| `start-with-browser.ps1` | Windows | PowerShell version with browser |
| `start-ticket-system.ps1` | Windows | PowerShell version server only |
| `LAUNCH.bat` | Windows | Alternative Windows launcher |

## 🔧 NPM Commands (Cross-Platform)

```bash
# Development server (keep terminal open)
npm run dev

# macOS specific
npm run start-mac              # Server only
npm run start-mac-browser      # Server + browser

# Windows specific (PowerShell)
npm run start-system           # Server only
npm run start-browser          # Server + browser

# Utility commands
npm run setup                  # Install + fix security issues
npm run clean                  # Clean install (removes node_modules)
npm run build                  # Build for production
npm run lint                   # Check code quality
```

## 🌐 Application Access

Once started, visit: **http://localhost:3000**

## 🔐 Login Info

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@company.com` | `admin123` |
| Operator | `operator@it.company.com` | `operator123` |

## 📞 Need Help?

Check the detailed **STARTUP-GUIDE.md** for troubleshooting and complete instructions.

---
**Made with ❤️ for seamless cross-platform development**
