@echo off
echo Starting IT Ticket System with Browser...
echo.

REM Change to the project directory
cd /d "d:\Ticket_System"

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Start the development server in background
echo.
echo Starting development server...
echo The application will be available at: http://localhost:3000
echo.

start /b npm run dev

REM Wait for server to start (15 seconds)
echo Waiting for server to start...
timeout /t 15 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:3000

echo.
echo Department Login Credentials:
echo - Preproom Westfield: PRW1234
echo - Technical Support: TECH2024
echo - Help Desk: HELP2024
echo - Maintenance: MAINT2024
echo - Administration: ADMIN2024
echo.
echo The server is running. Close this window to stop the server.
echo.

pause