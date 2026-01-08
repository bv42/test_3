@echo off
REM debug_init.bat - Initializes Chrome Debugging for DevTools Integration

set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
REM Use a generic name for the profile folder
set PROFILE_DIR="%LOCALAPPDATA%\Google\Chrome_DevTools_Profile"

if not exist %PROFILE_DIR% mkdir %PROFILE_DIR%

echo [Info] Initializing DevTools Protocol (CDP) on port 9222...
echo [Info] Waiting for browser session...

start "" %CHROME_PATH% ^
  --remote-debugging-port=9222 ^
  --user-data-dir=%PROFILE_DIR% ^
  --no-first-run ^
  --no-default-browser-check ^
  --window-position=5000,5000

echo [Info] Session ready. Ensure you are authenticated in the target environment.
timeout /t 3