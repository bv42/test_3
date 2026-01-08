# GitLab UI Automation Harness

This utility provides a local API gateway for development tools to interact with the GitLab web interface. It allows approved IDE plugins (e.g., internal accessibility checkers or coding assistants) to communicate with the GitLab instance using the developer's active browser session.

## Architecture
This tool uses the **Chrome DevTools Protocol (CDP)** to reuse an authenticated browser session. This avoids the need to store static Personal Access Tokens (PATs) on disk, complying with the "Session Reuse" security policy.

## Prerequisites
1.  **Node.js** (LTS Version)
2.  **Google Chrome** (Enterprise Managed)

## Usage Guide

### 1. Initialize Debug Environment
Run the provided batch script to start Chrome with the remote debugging port enabled. This allows the automation harness to attach to your session.

```bash
.\debug_init.bat