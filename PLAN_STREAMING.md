# Streaming & Long Context Fixes

## Goal Description
Enable real-time token streaming from the browser-side WebSocket to the Bridge Server. This addresses the user's report of "disabled streaming" and helps mitigate "No Result" errors for long contexts by providing immediate feedback (resetting timeouts).

## Proposed Changes

### [MODIFY] [automation_driver.js](file:///src/test_3/src/automation_driver.js)
1.  **Implement Delta Calculation:** Track the `lastIndex` or `lastLength` of the accumulated content.
2.  **Stream Deltas:** When new content arrives (longer than `accumulated`), slice the new segment and send it via `window[callbackId](chunk)`.
3.  **Reset Silence on ANY Activity:** Ensure `resetSilence()` is called on *any* WebSocket message (including pings or status updates) to prevent timeouts during long "thinking" periods (Though `ping` usually happens every 3s, so this might be redundant, but safe).

## Verification Plan

### Automated Tests
1.  **Streaming Verification**: Run `test/stress_runner.js`.
    -   It already checks for output.
    -   I will manually verify the logs to see "RX Len" updates incrementing, indicating streaming.
2.  **Manual Verification**:
    -   The user can observe the "Test 5" output effectively streaming in the console if I enable `process.stdout.write` in the runner (which it already does).

### Regression Testing
-   Rerun `test/archivist_reproduction.test.js` to ensure no regression in saving logic.
