@echo off
title Stop OPERATION AEGIS
cd /d "%~dp0"

echo ===================================================
echo   Stopping OPERATION AEGIS Server...
echo ===================================================
echo.

powershell -NoProfile -Command ^
  "$connections = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue;" ^
  "if ($connections) {" ^
  "  foreach ($c in $connections) { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue };" ^
  "  Write-Host '  [+] Stopped server process listening on port 5173' -ForegroundColor Green;" ^
  "} else {" ^
  "  Write-Host '  [*] No active server found running on port 5173.' -ForegroundColor Yellow;" ^
  "};" ^
  "Get-Process cmd -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like '*OPERATION AEGIS Server*' } | Stop-Process -Force -ErrorAction SilentlyContinue;"

echo.
echo ===================================================
echo   Server successfully stopped!
echo ===================================================
ping 127.0.0.1 -n 3 >nul
