#!/bin/bash
# debug_init.sh - Initialize Chromium with CDP for Automation

# Detect Chromium binary (adjust if your distro uses a different name)
if command -v chromium &> /dev/null; then
    CHROME_BIN="chromium"
elif command -v chromium-browser &> /dev/null; then
    CHROME_BIN="chromium-browser"
else
    echo "Error: Chromium not found in PATH."
    exit 1
fi

# Use a local directory for the profile to keep it isolated/persistent
PROFILE_DIR="$HOME/.cache/gitlab_automation_profile"
mkdir -p "$PROFILE_DIR"

echo "[Info] Launching $CHROME_BIN with DevTools Protocol on port 9222..."

# Launch flags:
# --remote-debugging-port=9222 : The critical bridge
# --no-first-run : Skips the "Welcome to Chromium" splash
# --user-data-dir : Keeps cookies/login session separate from your main browsing
nohup "$CHROME_BIN" \
  --remote-debugging-port=9222 \
  --user-data-dir="$PROFILE_DIR" \
  --no-first-run \
  --no-default-browser-check \
  --window-position=0,0 \
  --window-size=1280,1024 \
  > /dev/null 2>&1 &

echo "[Info] Browser launched in background."
echo "[Action Required] Please switch to the new window and log in to GitLab."