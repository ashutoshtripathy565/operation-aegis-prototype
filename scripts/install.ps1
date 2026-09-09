# OPERATION AEGIS - Universal Windows Setup Script
[CmdletBinding()]
param (
    [switch]$AutoLaunch = $false,
    [switch]$SkipNpm = $false
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "       OPERATION AEGIS - Automated Setup & Installer        " -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

$projectDir = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$projectDir\package.json")) {
    $projectDir = (Get-Location).Path
}

Set-Location -Path $projectDir

# Step 1: Detect Node.js
Write-Host "[1/5] Checking for Node.js and npm..." -ForegroundColor Yellow

function Refresh-Path {
    $machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
    $extraPaths = "C:\Program Files\nodejs;$env:APPDATA\npm;$env:LOCALAPPDATA\Programs\node"
    $env:Path = "$machinePath;$userPath;$extraPaths;$env:Path"
}

Refresh-Path

$nodeInstalled = $false
try {
    $nodeVer = & node -v 2>$null
    if ($nodeVer) {
        $nodeInstalled = $true
        Write-Host "  [+] Found Node.js: $nodeVer" -ForegroundColor Green
    }
} catch {}

if (-not $nodeInstalled) {
    if (Test-Path "C:\Program Files\nodejs\node.exe") {
        $nodeInstalled = $true
        Refresh-Path
        $nodeVer = & node -v
        Write-Host "  [+] Located Node.js at C:\Program Files\nodejs: $nodeVer" -ForegroundColor Green
    }
}

# If Node.js is not found, install it automatically
if (-not $nodeInstalled) {
    Write-Host "  [!] Node.js not found. Installing Node.js LTS..." -ForegroundColor Yellow
    
    $winget = Get-Command winget.exe -ErrorAction SilentlyContinue
    if ($winget) {
        Write-Host "  [*] Using Windows Package Manager (winget)..." -ForegroundColor Cyan
        & winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements --silent
    } else {
        Write-Host "  [*] Downloading Node.js LTS MSI installer directly..." -ForegroundColor Cyan
        $msiUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi"
        $msiDest = "$env:TEMP\node-installer.msi"
        try {
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            Invoke-WebRequest -Uri $msiUrl -OutFile $msiDest -UseBasicParsing
            Write-Host "  [*] Running installer (quiet mode)..." -ForegroundColor Cyan
            Start-Process msiexec.exe -ArgumentList "/i `"$msiDest`" /passive /norestart" -Wait
        } catch {
            Write-Host "  [-] Automatic download failed: $_" -ForegroundColor Red
            Write-Host "  [!] Please manually install Node.js LTS from: https://nodejs.org" -ForegroundColor Yellow
            Read-Host "Press Enter to exit..."
            exit 1
        }
    }

    # Refresh PATH and verify install
    Refresh-Path
    try {
        $nodeVer = & node -v 2>$null
        if ($nodeVer) {
            Write-Host "  [+] Node.js installed successfully: $nodeVer" -ForegroundColor Green
        } else {
            Write-Host "  [-] Node was installed but terminal restart may be required." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  [-] Could not verify Node.js in current session." -ForegroundColor Yellow
    }
}

# Step 2: Configure PowerShell Execution Policy
Write-Host ""
Write-Host "[2/5] Configuring PowerShell script execution policy..." -ForegroundColor Yellow
try {
    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force -ErrorAction SilentlyContinue
    Write-Host "  [+] Execution policy set to RemoteSigned for CurrentUser." -ForegroundColor Green
} catch {
    Write-Host "  [*] Skipping policy change (process bypass active)." -ForegroundColor DarkGray
}

# Step 3: Install project dependencies
Write-Host ""
Write-Host "[3/5] Checking project dependencies (node_modules)..." -ForegroundColor Yellow

if (-not $SkipNpm) {
    if (-not (Test-Path "$projectDir\node_modules")) {
        Write-Host "  [*] Installing dependencies via npm install (this may take 1-2 minutes)..." -ForegroundColor Cyan
        & npm.cmd install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [+] Dependencies installed successfully." -ForegroundColor Green
        } else {
            Write-Host "  [-] Warning: npm install reported warnings or errors." -ForegroundColor Yellow
        }
    } else {
        Write-Host "  [+] Dependencies are already present in node_modules." -ForegroundColor Green
    }
}

# Step 4: Verify production build
Write-Host ""
Write-Host "[4/5] Verifying application build..." -ForegroundColor Yellow
try {
    & npm.cmd run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [+] Application build verified successfully (dist/ is ready)." -ForegroundColor Green
    }
} catch {
    Write-Host "  [*] Build check bypassed." -ForegroundColor DarkGray
}

# Step 5: Create Desktop Shortcuts
Write-Host ""
Write-Host "[5/5] Creating Desktop shortcuts..." -ForegroundColor Yellow
& powershell -ExecutionPolicy Bypass -File "$PSScriptRoot\create-shortcuts.ps1"

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Green
Write-Host "        OPERATION AEGIS is fully set up and ready!          " -ForegroundColor Green
Write-Host "=============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "You now have two shortcuts on your Desktop:" -ForegroundColor White
Write-Host "  1. 'Start OPERATION AEGIS'  -> Starts server & opens website in browser" -ForegroundColor Cyan
Write-Host "  2. 'Stop OPERATION AEGIS'   -> Stops server and frees up port 5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "To redesign or edit the website, see REDESIGN_GUIDE.md!" -ForegroundColor Magenta
Write-Host ""

if ($AutoLaunch) {
    Start-Process "$projectDir\start-server.bat"
} else {
    $ans = Read-Host "Would you like to launch the website now? (Y/N)"
    if ($ans -match "^[Yy]") {
        Start-Process "$projectDir\start-server.bat"
    }
}
