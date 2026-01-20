# GEMINI.md - Sovereign Project Context

> **Warning:** This file dictates the operational standards for this project. All AI Agents must read this before modifying code.

## 1. Core Philosophy
* **Zero Trust:** Never disable SSL. Never log tokens.
* **Stream First:** Never buffer payloads > 1MB in RAM.
* **Evidence Based:** Code changes require a passing `jest` test.

## 2. Testing Standards
* **Time Travel:** Use `jest.useFakeTimers()` for all socket timeouts.
* **No Mocks (Network):** Use `mock-socket` or VCR cassettes for wire protocol tests.
* **Golden Masters:** Use Snapshot testing for `conversations/` output.

## 3. Tool Documentation: Gitea Manager
* **Script:** `tools/git_manager.js`
* **Env Vars:**
    * `GITEA_TOKEN`: API Token
    * `GITEA_URL`: Base URL (default: https://gitea.example.com)
    * `GITLAB_CA_FILE`: (Optional) Path to internal CA .pem file for TLS verification.
* **Usage:**
    ```bash
    # Internal CA
    export GITLAB_CA_FILE="/etc/pki/internal-ca.pem"
    node tools/git_manager.js --create-pr --title "Fix: Security Hardening"
    ```

## 4. Known "Gravity Wells" (Do Not Repeat)
* **Markdown Escaping:** Do not attempt to parse Markdown in the bridge. It fails on split chunks. Pass raw bytes.
* **Stateless Logging:** The client retries requests. Deduplicate logs using SHA-256 hashes of the prompt.
