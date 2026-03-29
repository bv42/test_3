# Stability Fixes Implementation Plan

## Goal Description
Fix stability issues identified in the latest release:
1.  **Archivist Crash**: `ReferenceError: lastUserMsg is not defined` when saving conversations.
2.  **WebSocket Instability**: Premature EOF due to aggressive silence detection (2s) and session closure.

## User Review Required
> [!IMPORTANT]
> Increasing the silence timeout from 2s to 15s may slightly delay the completion signal for short responses, but is necessary for stability with slower models.

## Proposed Changes

### Source Code

#### [MODIFY] [bridge_server.js](file:///src/test_3/src/bridge_server.js)
-   Fix block-scoping issue in `saveConversation` function. Move `lastUserMsg` declaration to a wider scope so it is accessible during deduplication checks.

#### [MODIFY] [automation_driver.js](file:///src/test_3/src/automation_driver.js)
-   Increase `resetSilence` timeout from `2000ms` to `15000ms` (15s).
-   Increase or remove the hard 30s watchdog timeout in `executeQuery`. Set it to 60s or rely on silence detection.

## Verification Plan

### Automated Tests
1.  **Archivist Reproduction Test**: Create `test/archivist_reproduction.test.js` to simulate the exact condition causing the `ReferenceError`.
    ```bash
    npx jest test/archivist_reproduction.test.js
    ```
2.  **Integration Stress Test**: Run the existing stress runner to ensure no regression and improved stability.
    ```bash
    node test/stress_runner.js
    ```
