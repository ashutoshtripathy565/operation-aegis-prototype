@echo off
title OPERATION AEGIS - Setup & Installer
cd /d "%~dp0"

:: Ensure UTF-8 console output
chcp 65001 >nul 2>&1

echo.
echo =============================================================
echo        OPERATION AEGIS - Setup and Installation Wizard
echo =============================================================
echo.
echo This wizard will:
echo   1. Check and install Node.js (if not already installed)
echo   2. Configure PowerShell execution permissions
echo   3. Install required web dependencies (npm install)
echo   4. Verify the application build
echo   5. Place "Start" and "Stop" launcher icons on your Desktop
echo.
echo =============================================================
echo.

powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0scripts\install.ps1"

echo.
echo Press any key to close this installer window...
pause >nul
