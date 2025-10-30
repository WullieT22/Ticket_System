@echo off
title IT Ticket System Launcher

echo.
echo  ===============================================
echo      IT TICKET SYSTEM - QUICK LAUNCHER
echo  ===============================================
echo.
echo  Choose how you want to start the system:
echo.
echo  [1] Start with Browser (Recommended)
echo  [2] Start Server Only  
echo  [3] Create Desktop Shortcut
echo  [4] Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto browser
if "%choice%"=="2" goto server
if "%choice%"=="3" goto shortcut
if "%choice%"=="4" goto exit
goto invalid

:browser
echo.
echo Starting with browser...
call start-with-browser.bat
goto end

:server
echo.
echo Starting server only...
call start-ticket-system.bat
goto end

:shortcut
echo.
echo Creating desktop shortcut...
powershell -ExecutionPolicy Bypass -File create-desktop-shortcut.ps1
goto end

:invalid
echo.
echo Invalid choice. Please try again.
echo.
pause
cls
goto start

:exit
echo.
echo Goodbye!
timeout /t 2 /nobreak >nul
goto end

:end