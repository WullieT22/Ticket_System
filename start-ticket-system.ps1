# IT Ticket System Startup Script
# This script automatically starts the IT ticket system development server

Write-Host "Starting IT Ticket System..." -ForegroundColor Green
Write-Host ""

# Change to the project directory
Set-Location "d:\Ticket_System"

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Display startup information
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "The application will be available at: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Department Login Credentials:" -ForegroundColor Yellow
Write-Host "- Preproom Westfield: PRW1234" -ForegroundColor White
Write-Host "- Technical Support: TECH2024" -ForegroundColor White
Write-Host "- Help Desk: HELP2024" -ForegroundColor White
Write-Host "- Maintenance: MAINT2024" -ForegroundColor White
Write-Host "- Administration: ADMIN2024" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Start the development server
npm run dev

# Keep the window open if there's an error
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "The server stopped with an error." -ForegroundColor Red
    Read-Host "Press Enter to exit"
}