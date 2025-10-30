# 🎫 IT Ticket System - Universal Startup Guide

This guide will help you run the IT Ticket System on both **macOS** and **Windows 11**.

## 📋 Prerequisites

### For Both Systems:
- **Node.js** (version 18 or higher)
- **npm** (usually comes with Node.js)
- **Git** (optional, for version control)

### Installation Links:
- **Node.js**: https://nodejs.org/
- **Git**: https://git-scm.com/

---

## 🍎 macOS Instructions

### Method 1: Using Shell Scripts (Recommended)
1. **Open Terminal** (Applications → Utilities → Terminal)
2. **Navigate to project directory**:
   ```bash
   cd /path/to/Ticket_System
   ```
3. **Run one of the startup scripts**:
   - **Basic startup**:
     ```bash
     ./start-ticket-system.sh
     ```
   - **Startup with browser auto-open**:
     ```bash
     ./start-with-browser.sh
     ```

### Method 2: Using npm Commands
1. **Open Terminal**
2. **Navigate to project directory**:
   ```bash
   cd /path/to/Ticket_System
   ```
3. **Install dependencies** (first time only):
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

### Method 3: Double-Click Launch
1. **Make scripts executable** (one-time setup):
   ```bash
   chmod +x start-ticket-system.sh start-with-browser.sh
   ```
2. **Double-click** either `.sh` file in Finder
3. **Allow execution** when prompted by macOS security

---

## 🪟 Windows 11 Instructions

### Method 1: Using Batch Files (Recommended)
1. **Open File Explorer**
2. **Navigate to the project folder**
3. **Double-click one of these files**:
   - `start-ticket-system.bat` - Basic startup
   - `start-with-browser.bat` - Startup with browser auto-open
   - `LAUNCH.bat` - Alternative launcher

### Method 2: Using Command Prompt
1. **Open Command Prompt** (Win + R, type `cmd`, press Enter)
2. **Navigate to project directory**:
   ```cmd
   cd C:\path\to\Ticket_System
   ```
3. **Install dependencies** (first time only):
   ```cmd
   npm install
   ```
4. **Start the development server**:
   ```cmd
   npm run dev
   ```

### Method 3: Using PowerShell
1. **Open PowerShell** (Win + X, select "Windows PowerShell")
2. **Navigate to project directory**:
   ```powershell
   cd C:\path\to\Ticket_System
   ```
3. **Run PowerShell scripts**:
   ```powershell
   .\start-ticket-system.ps1
   # or
   .\start-with-browser.ps1
   ```

### Method 4: Using npm Scripts
1. **Open Command Prompt or PowerShell**
2. **Navigate to project directory**
3. **Use predefined npm scripts**:
   ```cmd
   npm run start-system
   # or
   npm run start-browser
   ```

---

## 🌐 Accessing the Application

Once started, the application will be available at:
**http://localhost:3000**

### Default Login Credentials:
- **Administrator**: 
  - Email: `admin@company.com`
  - Password: `admin123`
- **Operator**: 
  - Email: `operator@it.company.com`
  - Password: `operator123`

### Department Codes:
- **Preproom Westfield**: `PRW1234`
- **Technical Support**: `TECH2024` 
- **Help Desk**: `HELP2024`
- **Maintenance**: `MAINT2024`
- **Administration**: `ADMIN2024`

---

## 🛠️ Troubleshooting

### Common Issues:

#### "Command not found: node" or "Command not found: npm"
- **Solution**: Install Node.js from https://nodejs.org/
- **Mac**: You can also use Homebrew: `brew install node`
- **Windows**: Download and run the installer from nodejs.org

#### "Permission denied" (Mac)
- **Solution**: Make scripts executable:
  ```bash
  chmod +x *.sh
  ```

#### "Execution Policy" Error (Windows PowerShell)
- **Solution**: Run PowerShell as Administrator and execute:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

#### Port 3000 Already in Use
- **Solution**: Kill existing process or use different port:
  ```bash
  # Kill process on port 3000
  npx kill-port 3000
  
  # Or start on different port
  npm run dev -- --port 3001
  ```

#### Dependencies Installation Fails
- **Solution**: Clear npm cache and retry:
  ```bash
  npm cache clean --force
  npm install
  ```

---

## � Stopping the Application

### All Systems:
- **In Terminal/Command Prompt**: Press `Ctrl + C`
- **Close the terminal window** where the server is running

---

## 📁 Project Structure

```
Ticket_System/
├── 🍎 Mac Startup Files:
│   ├── start-ticket-system.sh
│   └── start-with-browser.sh
├── 🪟 Windows Startup Files:
│   ├── start-ticket-system.bat
│   ├── start-with-browser.bat
│   ├── start-ticket-system.ps1
│   ├── start-with-browser.ps1
│   └── LAUNCH.bat
├── 📚 Documentation:
│   ├── README.md
│   ├── STARTUP-GUIDE.md (this file)
│   └── .github/copilot-instructions.md
└── 💻 Application Files:
    ├── src/
    ├── package.json
    └── ...
```

---

## 🎯 Quick Start Summary

| Platform | Fastest Method |
|----------|----------------|
| **macOS** | Double-click `start-with-browser.sh` |
| **Windows 11** | Double-click `start-with-browser.bat` |
| **Any Platform** | Run `npm run dev` in terminal |

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Try running `npm install` again
4. Check that port 3000 is not being used by another application

**Happy ticket managing! 🎫✨**