@echo off
chcp 65001 >nul
color 0B
title HACKER BROWSER — Create Shareable Package

echo.
echo  ╔══════════════════════════════════════════════════╗
echo  ║  Creating shareable ZIP package...               ║
echo  ╚══════════════════════════════════════════════════╝
echo.

set OUT_FILE=%~dp0HackerBrowser-NovaTab.zip

:: Remove old zip if exists
if exist "%OUT_FILE%" del /F /Q "%OUT_FILE%"

echo  [..] Zipping extension files...

powershell -NoProfile -Command ^
  "Compress-Archive -Path '%~dp0nova-tab', '%~dp0INSTALL.bat' -DestinationPath '%OUT_FILE%' -CompressionLevel Optimal"

if errorlevel 1 (
    color 0C
    echo  [ERROR] Failed to create ZIP. Make sure PowerShell is available.
    pause
    exit /b 1
)

echo  [OK] Package ready:
echo       %OUT_FILE%
echo.
echo  ─────────────────────────────────────────────────
echo  Share  HackerBrowser-NovaTab.zip  with anyone.
echo.
echo  The recipient just needs to:
echo    1. Extract the ZIP
echo    2. Double-click  INSTALL.bat
echo    3. Follow the 4 on-screen steps
echo  ─────────────────────────────────────────────────
echo.

:: Open folder so user can grab the file
explorer /select,"%OUT_FILE%"

pause
