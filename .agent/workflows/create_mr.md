---
description: Create a Merge Request (MR) in Gitea/GitLab using the Sovereign Tooling.
---

# Workflow: Create Merge Request

This workflow allows the AI Agent to autonomously commit changes and open a Merge Request.

## Prerequisites
- `tools/git_manager.js` must exist.
- `GITEA_TOKEN` and `GITEA_URL` must be set in the environment.
- If using Internal CA: `GITLAB_CA_FILE` must be set.

## Steps

1. **Status Check**
   Check the current git status to verify clean state or pending changes.
   ```bash
   node tools/git_manager.js --status
   ```

2. **Stage and Commit**
   Add modified files and commit them with a semantic message.
   ```bash
   node tools/git_manager.js --add . --commit "feat: <Description of changes>"
   ```
   *Note: Be specific with `--add` if possible, e.g., `node tools/git_manager.js --add src/`*

3. **Push Branch**
   Push the current feature branch to the remote.
   ```bash
   node tools/git_manager.js --push
   ```

4. **Create Merge Request**
   Interact with the Gitea/GitLab API to open the PR/MR.
   ```bash
   node tools/git_manager.js --create-pr --title "feat: <Title>" --body "<Detailed description>"
   ```

## Rules
- **Atomic Commits:** Do not bundle unrelated changes.
- **Evidence:** Always run tests (`npm test`) before committing (Sovereign Rule #3).
