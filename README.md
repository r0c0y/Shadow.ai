# Agent Zero: The Autonomous Code Architect 🦸‍♂️

[![Hackathon Submission](https://img.shields.io/badge/AI%20Agents%20Assemble-Submission-emerald?style=for-the-badge)](https://github.com/r0c0y/Shadow.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat&logo=vercel)](https://shadow-ai-dashboard.vercel.app)

> **Agent Zero** is a Chrome Extension + Dashboard suite that brings agentic AI directly into your GitHub workflow. It doesn't just "chat"—it orchestrates deep analysis, security scanning, and autonomous refactoring using **Kestra pipelines** and **Cline agents**.

---

## 🔗 Links

- **Live Dashboard**: [https://shadow-ai-dashboard.vercel.app](https://shadow-ai-dashboard.vercel.app)
- **Chrome Extension**: [Download & Install Guide](./chrome-extension/README.md)
- **Demo Video**: [YouTube Link Here](https://youtube.com)
- **Documentation**: [Full Docs](./agent-zero/dashboard/app/docs)

---

## 🏆 Hackathon Tracks & Implementation Details

### 1. **The Infinity Build Award (Cline CLI)** 🛠️
> *Your project must use Cline CLI to build capabilities... demonstrating complete, working automation.*

**Our Implementation:**
Agent Zero uses Cline as its **"Hands"**. When a user identifies an issue (e.g., deprecated code) via our Chrome Extension:
1.  **The Trigger**: User clicks "Auto-Fix" on a GitHub PR.
2.  **The Brain**: Kestra triggers a `cline-refactor` flow.
3.  **The Action**: We spin up a **Cline Agent** in a sandboxed Docker container.
4.  **The Autonomy**: Cline autonomously:
    *   Reads the file structure (`fs.list_dir`).
    *   Understands the context (`read_file`).
    *   Plans the refactor (Chain-of-Thought).
    *   Executes the change (`write_to_file`).
    *   Verifies the fix by running tests (`run_command`).
5.  **The Result**: If successful, Cline pushes the commit back to the PR.

**Relevant Code**:
- [`/flows/agent_zero_lite.yml`](./agent-zero/flows/agent_zero_lite.yml) (See `cline_task` definition)
- [Cline Docs](./agent-zero/dashboard/app/docs/cline/page.tsx)

---

### 2. **The Wakanda Data Award (Kestra)** ⚡
> *Your project must use Kestra's built-in AI Agent to summarise data... and make decisions.*

**Our Implementation:**
Kestra is the **"Central Nervous System"** of Agent Zero. It orchestrates the complex logic that a simple Chrome Extension cannot handle.
1.  **Event Ingestion**: Receives webhooks from GitHub (PR opened, Comment added).
2.  **Parallel Processing**: Spins up parallel tasks:
    *   **SAST Scan**: Runs a security script.
    *   **Logic Analysis**: Uses Gemini Pro to understand the *intent* of the PR.
3.  **Decision Making**:
    *   If `security_score < 50`: **BLOCK** the PR and alert Slack.
    *   If `complexity > 80` AND `tests_missing`: **TRIGGER** a Cline agent to write tests.
    *   If `safe`: Auto-approve via GitHub API.
4.  **MCS Score**: Kestra aggregates all this data into a single "Merge Candidate Score" (MCS) which extends back to the user's browser.

**Relevant Code**:
- [`/flows/interactive-pr-fix.yaml`](./agent-zero/infrastructure/kestra/flows/interactive-pr-fix.yaml)
- [Kestra Architecture](./agent-zero/dashboard/app/docs/kestra/page.tsx)

---

### 3. **The Stormbreaker Deployment Award (Vercel)** 🌪️
> *Your project must be deployed on Vercel.*

**Our Implementation:**
The **Mission Control Dashboard** is a Next.js 14 application deployed on Vercel. It serves as:
- **API Gateway**: Handling requests from the Chrome Extension.
- **User Interface**: For configuring integration settings (Slack/Email) and viewing detailed audit logs.
- **Webhook Receiver**: For real-time updates from Kestra.

**Relevant Code**:
- [`/dashboard`](./agent-zero/dashboard)

---

## 🛠️ Architecture

```mermaid
graph TD
    User[Chrome Extension] -->|Auth & Intent| Dashboard[Next.js Dashboard (Vercel)]
    Dashboard -->|Trigger| Kestra[Kestra Orchestrator]
    
    subgraph "Kestra Workflow"
        Kestra -->|Parallel| Security[SAST Scan]
        Kestra -->|Parallel| Logic[Gemini Analysis]
        Security & Logic --> Decision{Decision Engine}
        Decision -->|Fix Needed| Cline[Cline Agent (Docker)]
        Decision -->|Alert| Slack[Slack/Email]
    end
    
    Cline -->|Push Commit| GitHub[GitHub Repo]
    Kestra -->|Update Score| Dashboard
    Dashboard -->|Live Update| User
```

## 🚀 Getting Started

### 1. Clone & Setup
```bash
git clone https://github.com/r0c0y/Shadow.ai.git
cd agent-zero
```

### 2. Run with Docker (Recommended)
This spins up the Dashboard, MongoDB, and Kestra.
```bash
docker-compose up --build
```

### 3. Load Chrome Extension
1. Go to `chrome://extensions/`
2. Enable **Developer Mode**.
3. Click **Load Unpacked**.
4. Select `agent-zero/chrome-extension/dist`.

### 4. Configure
- Visit `http://localhost:3000` (or your Vercel URL).
- Sign in with GitHub.
- Go to **Settings** to add your Slack Webhook and OpenAI/Gemini Keys.

---

## 🧪 Tech Stack

- **Frontend**: React (Extension), Next.js (Dashboard), TailwindCSS.
- **Backend**: Next.js API Routes, MongoDB (Mongoose).
- **Orchestration**: Kestra (Docker/Kubernetes).
- **AI Agents**: Cline (CLI), Gemini Pro, Groq (Llama-3).
- **Auth**: NextAuth.js (GitHub OAuth).

---

*Built with ❤️ for the AI Agents Assemble Hackathon.*
