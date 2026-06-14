@echo off
chcp 65001 >nul
color 0A
title HACKER BROWSER — Nova Tab Installer

echo.
echo  ╔══════════════════════════════════════════════════╗
echo  ║     HACKER BROWSER — Nova Tab Extension          ║
echo  ║     Chrome Extension Installer v3.0              ║
echo  ╚══════════════════════════════════════════════════╝
echo.

:: ── Detect Chrome ────────────────────────────────────────
set CHROME_PATH=
if exist "%PROGRAMFILES%\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH="%PROGRAMFILES%\Google\Chrome\Application\chrome.exe"
) else if exist "%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH="%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
)

if "%CHROME_PATH%"=="" (
    color 0C
    echo  [ERROR] Google Chrome not found on this PC.
    echo  Please install Chrome first: https://www.google.com/chrome
    echo.
    pause
    exit /b 1
)

echo  [OK] Chrome found at: %CHROME_PATH%
echo.

:: ── Copy extension files ─────────────────────────────────
set INSTALL_DIR=%LOCALAPPDATA%\HackerBrowser\nova-tab

echo  [..] Copying extension files...
if not exist "%LOCALAPPDATA%\HackerBrowser" mkdir "%LOCALAPPDATA%\HackerBrowser"
xcopy /E /I /Y /Q "%~dp0nova-tab" "%INSTALL_DIR%" >nul 2>&1

if errorlevel 1 (
    color 0C
    echo  [ERROR] Could not copy files. Try running as Administrator.
    pause
    exit /b 1
)

echo  [OK] Extension installed to:
echo       %INSTALL_DIR%
echo.

:: ── Show instructions ────────────────────────────────────
echo  ╔══════════════════════════════════════════════════╗
echo  ║   FINAL STEPS  (takes 30 seconds)                ║
echo  ╠══════════════════════════════════════════════════╣
echo  ║                                                  ║
echo  ║  Chrome will open to the Extensions page.        ║
echo  ║                                                  ║
echo  ║  STEP 1 ► Toggle ON "Developer mode"             ║
echo  ║           (top-right corner of the page)         ║
echo  ║                                                  ║
echo  ║  STEP 2 ► Click "Load unpacked"                  ║
echo  ║           (top-left button)                      ║
echo  ║                                                  ║
echo  ║  STEP 3 ► Navigate to this folder and click OK:  ║
echo  ║                                                  ║
echo  ║    %INSTALL_DIR%
echo  ║                                                  ║
echo  ║  STEP 4 ► Open a New Tab  — enjoy!               ║
echo  ║                                                  ║
echo  ╚══════════════════════════════════════════════════╝
echo.

:: Copy the install path to clipboard for convenience
echo %INSTALL_DIR% | clip
echo  [OK] Install path copied to clipboard  (Ctrl+V to paste in folder picker)
echo.

echo  Press any key to open Chrome Extensions page...
pause >nul

start "" %CHROME_PATH% "chrome://extensions/"

echo.
echo  [DONE] Chrome opened. Follow the 4 steps above.
echo         Press any key to close this window.
pause >nul
