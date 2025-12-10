# Agent Capabilities

This directory contains the autonomous capabilities of Agent Zero, powered by the Cline CLI.

## Scripts

### 1. `diagnose_error.sh`
**Purpose:** Analyzes build logs to identify root causes and suggest fixes.
**Usage:** `./diagnose_error.sh <log_file>`
**Output:** JSON object with `cause`, `fix_suggestion`, and `severity`.

### 2. `autofix_deps.sh`
**Purpose:** autonomously updates dependencies and creates a PR.
**Usage:** `./autofix_deps.sh <repo_dir>`
**Output:** Log indicating PR creation status.

## Docker Environment
The `Dockerfile` builds a custom image with:
- Node.js 20
- Python 3
- Cline CLI (mocked for now)
- Git & Utilities

## Testing
Run `python3 test_capabilities.py` to verify script execution (Dry Run).
