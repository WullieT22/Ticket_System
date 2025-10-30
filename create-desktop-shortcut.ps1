# Create Desktop Shortcut for IT Ticket System
# This script creates a desktop shortcut to easily launch the IT ticket system

$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "IT Ticket System.lnk"
$targetPath = "d:\Ticket_System\start-with-browser.bat"

# Create shortcut
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetPath
$shortcut.WorkingDirectory = "d:\Ticket_System"
$shortcut.Description = "Start IT Ticket System"
$shortcut.IconLocation = "shell32.dll,13"  # Computer icon
$shortcut.Save()

Write-Host "Desktop shortcut created successfully!" -ForegroundColor Green
Write-Host "Shortcut location: $shortcutPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now double-click 'IT Ticket System' on your desktop to start the application." -ForegroundColor Yellow

Read-Host "Press Enter to exit"