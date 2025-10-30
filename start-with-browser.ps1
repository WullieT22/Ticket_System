# IT Ticket System Startup Script with Browser Launch
# This script automatically starts the IT ticket system and opens it in your default browser

Write-Host "Starting IT Ticket System with Browser..." -ForegroundColor Green
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

# Start the development server in background
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "The application will be available at: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Cyan

# Start npm in background job
$job = Start-Job -ScriptBlock { 
    Set-Location "d:\Ticket_System"
    npm run dev 
}

# Wait for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Open browser
Write-Host "Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

# Display login credentials
Write-Host ""
Write-Host "Department Login Credentials:" -ForegroundColor Yellow
Write-Host "- Preproom Westfield: PRW1234" -ForegroundColor White
Write-Host "- Technical Support: TECH2024" -ForegroundColor White
Write-Host "- Help Desk: HELP2024" -ForegroundColor White
Write-Host "- Maintenance: MAINT2024" -ForegroundColor White
Write-Host "- Administration: ADMIN2024" -ForegroundColor White
Write-Host ""
Write-Host "The server is running in the background." -ForegroundColor Green
Write-Host "Close this window or press Ctrl+C to stop the server." -ForegroundColor Red
Write-Host ""

# Wait for user input to stop
try {
    Read-Host "Press Enter to stop the server"
} finally {
    # Stop the background job
    Stop-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -ErrorAction SilentlyContinue
    Write-Host "Server stopped." -ForegroundColor Red
}