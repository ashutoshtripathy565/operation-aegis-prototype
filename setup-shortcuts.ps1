# Dynamically determine project directory and Desktop paths
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $projectDir) { $projectDir = (Get-Location).Path }

# Collect all potential Desktop paths (including OneDrive Desktop redirect)
$desktopPaths = @()
$sysDesktop = [Environment]::GetFolderPath('Desktop')
if ($sysDesktop -and (Test-Path $sysDesktop)) { $desktopPaths += $sysDesktop }

$userDesktop = "$env:USERPROFILE\Desktop"
if ($userDesktop -and (Test-Path $userDesktop) -and ($userDesktop -notin $desktopPaths)) { $desktopPaths += $userDesktop }

if ((Test-Path "D:\Lalit Charan\Desktop") -and ("D:\Lalit Charan\Desktop" -notin $desktopPaths)) {
    $desktopPaths += "D:\Lalit Charan\Desktop"
}

$wsh = New-Object -ComObject WScript.Shell

foreach ($dPath in $desktopPaths) {
    # 1. Start & Open Shortcut
    $s1 = $wsh.CreateShortcut("$dPath\Start OPERATION AEGIS.lnk")
    $s1.TargetPath = "$projectDir\start-server.bat"
    $s1.WorkingDirectory = "$projectDir"
    $s1.Description = "Start Operation Aegis and Open in Browser"
    $s1.IconLocation = "shell32.dll, 13"
    $s1.Save()

    # 2. Stop Shortcut
    $s2 = $wsh.CreateShortcut("$dPath\Stop OPERATION AEGIS.lnk")
    $s2.TargetPath = "$projectDir\stop-server.bat"
    $s2.WorkingDirectory = "$projectDir"
    $s2.Description = "Stop Operation Aegis Local Server"
    $s2.IconLocation = "shell32.dll, 131"
    $s2.Save()

    Write-Host "  [+] Shortcuts created on: $dPath" -ForegroundColor Green
}
