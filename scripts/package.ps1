# OPERATION AEGIS - Distribution Packaging Script
[CmdletBinding()]
param (
    [switch]$IncludeNodeModules = $false
)

$projectDir = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$projectDir\package.json")) {
    $projectDir = (Get-Location).Path
}

$desktopPath = [Environment]::GetFolderPath('Desktop')
$zipName = if ($IncludeNodeModules) { "OPERATION_AEGIS_Offline_Full.zip" } else { "OPERATION_AEGIS_Setup_Package.zip" }
$zipDestination = "$desktopPath\$zipName"

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "    OPERATION AEGIS - Create Distribution Package (.zip)    " -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

# Remove old zip if exists
if (Test-Path $zipDestination) {
    Write-Host "  [*] Removing previous zip package..." -ForegroundColor DarkGray
    Remove-Item -Path $zipDestination -Force
}

# Temporary staging folder
$stagingDir = "$env:TEMP\OPERATION_AEGIS_PACKAGE"
if (Test-Path $stagingDir) {
    Remove-Item -Path $stagingDir -Recurse -Force
}
New-Item -ItemType Directory -Path $stagingDir | Out-Null

Write-Host "  [*] Gathering project files into clean staging area..." -ForegroundColor Cyan

# List of items to copy
$itemsToCopy = @(
    "src",
    "dist",
    "scripts",
    "package.json",
    "package-lock.json",
    "vite.config.js",
    "index.html",
    "SETUP.bat",
    "start-server.bat",
    "stop-server.bat",
    "setup-shortcuts.ps1",
    "README.md",
    "REDESIGN_GUIDE.md",
    "SECURITY.md"
)

if ($IncludeNodeModules -and (Test-Path "$projectDir\node_modules")) {
    $itemsToCopy += "node_modules"
}

foreach ($item in $itemsToCopy) {
    $srcPath = "$projectDir\$item"
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination "$stagingDir\$item" -Recurse -Force
    }
}

Write-Host "  [*] Compressing archive to: $zipDestination" -ForegroundColor Cyan
Write-Host "      (This may take a moment)..." -ForegroundColor DarkGray

Compress-Archive -Path "$stagingDir\*" -DestinationPath $zipDestination -CompressionLevel Optimal -Force

# Clean up staging
Remove-Item -Path $stagingDir -Recurse -Force

if ((Test-Path "D:\Lalit Charan\Desktop") -and ("$desktopPath" -ne "D:\Lalit Charan\Desktop")) {
    Copy-Item $zipDestination "D:\Lalit Charan\Desktop\$zipName" -Force -ErrorAction SilentlyContinue
}

$zipSizeMb = [math]::Round((Get-Item $zipDestination).Length / 1MB, 2)

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Green
Write-Host "  Package Created Successfully!" -ForegroundColor Green
Write-Host "=============================================================" -ForegroundColor Green
Write-Host "  Location: $zipDestination" -ForegroundColor White
if (Test-Path "D:\Lalit Charan\Desktop\$zipName") {
    Write-Host "  Also copied to: D:\Lalit Charan\Desktop\$zipName" -ForegroundColor White
}
Write-Host "  File Size: $zipSizeMb MB" -ForegroundColor White
Write-Host ""
Write-Host "You can now send this ZIP file to any Windows device." -ForegroundColor Cyan
Write-Host "The recipient only needs to extract it and double-click SETUP.bat!" -ForegroundColor Cyan
Write-Host ""
