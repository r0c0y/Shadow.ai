
# Agent Zero (Hackathon Submission)

**The Autonomous Code Architect**

Agent Zero is a Chrome Extension + Dashboard suite that brings agentic AI directly into your GitHub workflow. It doesn't just "chat"—it orchestrates deep analysis, security scanning, and autonomous refactoring using Kestra pipelines and Cline agents.

## 🚀 Features

### 1. **Chrome Extension (The "Eyes")**
- **Ghost Mode**: Invisible UI until you select code or press `Cmd+E`.
- **MCS Badge**: Real-time "Merge Candidate Score" injected into every PR header.
- **Deep Analysis**: Understanding of logic, not just syntax.
- **Interactive PR Reviews**: Trigger Kestra workflows directly from GitHub comments.

### 2. **Kestra Orchestration (The "Brain")**
- **Event-Driven**: We use Kestra to manage stateful, long-running agent workflows.
- **Parallel Execution**: Runs SAST scans and Logic checks simultaneously.
- **Resilience**: Automatic retries for API failures.

### 3. **Cline CLI Integration (The "Hands")**
- **Autonomous Refactoring**: Agent Zero spins up a Cline agent to perform complex refactors (e.g., "Migrate this file to TypeScript").
- **Sandboxed Execution**: Changes are verified locally before being pushed back to the PR.

---

## 🛠️ Tech Stack

**Frontend Extension**
- React 18
- TailwindCSS (Premium Dark Mode)
- Manifest V3 (Side Panel API)

**Dashboard / API**
- Next.js 14
- MongoDB (Mongoose)
- NextAuth.js (GitHub & Credential Auth)

**Orchestration & AI**
- **Kestra**: Workflow Engine
- **Cline**: Autonomous Coding Agent
- **Gemini Pro**: Logic Analysis
- **Groq**: High-speed Inference

---

## 📦 Installation (Local)

### 1. Clone the Repo
```bash
git clone https://github.com/your-repo/agent-zero.git
cd agent-zero
```

### 2. Install Dependencies
```bash
# Dashboard
cd dashboard
npm install

# Extension
cd ../chrome-extension
npm install
```

### 3. Build Extension
```bash
cd chrome-extension
npm run build
# Load 'dist' folder in chrome://extensions (Enable Developer Mode)
```

### 4. Run Dashboard
```bash
cd ../dashboard
npm run dev
# Open http://localhost:3000
```

---

## 🏆 Hackathon Tracks

### **The Infinity Build Award (Cline)**
We use Cline as our **Worker Agent**. When a user requests an "Auto-Fix" on GitHub, Agent Zero triggers a Kestra flow that spins up a Cline instance to apply the fix autonomously.

### **The Wakanda Data Award (Kestra)**
Kestra is our **Central Nervous System**. It aggregates data from GitHub, our AI models, and user preferences to calculate the **MCS Score** and orchestrate complex multi-step workflows like PR Analysis.

### **The Stormbreaker Deployment Award (Vercel)**
Our entire Dashboard and API Gateway are optimized for **Vercel** deployment (Next.js), ensuring global availability and fast edge responses.

---

## 📜 License
MIT
