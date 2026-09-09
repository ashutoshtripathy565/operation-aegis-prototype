@echo off
title OPERATION AEGIS Server
cd /d "%~dp0"

:: Ensure Node.js is in PATH
set "PATH=C:\Program Files\nodejs;%PATH%"

:: Check if server is already running on port 5173
netstat -ano | findstr ":5173 " | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ===================================================
    echo   OPERATION AEGIS is already running!
    echo ===================================================
    echo Opening browser at http://localhost:5173 ...
    start http://localhost:5173
    ping 127.0.0.1 -n 3 >nul
    exit /b 0
)

echo ===================================================
echo   Starting OPERATION AEGIS (Decision Support System)
echo ===================================================
echo.
echo Server starting at http://localhost:5173
echo Your browser will open automatically once ready.
echo.
echo [!] Keep this window open while using the website.
echo [!] To STOP the server, close this window or double-click
echo     the "Stop OPERATION AEGIS" desktop icon.
echo.
echo ===================================================
echo.

npm.cmd run dev -- --open
