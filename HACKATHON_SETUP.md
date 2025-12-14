# 🏆 Hackathon Setup Guide: Enabling "God Mode"

You have created a new GitHub account. Now we connect it to Agent Zero so it can **actually fix code and push it live**.

## Phase 1: GitHub Setup (5 Minutes)

### 1. Create the Target Repo
1.  Log in to your **New GitHub Account**.
2.  Click the **+** icon (top right) -> **New repository**.
3.  Repo Name: `vulnerable-app`.
4.  Visibility: **Public** (easier for demos) or Private.
5.  **Initialize with a README**: Check this box.
6.  Click **Create repository**.
7.  You now have `your-new-username/vulnerable-app`.

### 2. Get the "Keys to the Castle" (PAT)
Agent Zero needs permission to write to this repo.
1.  Click your Profile Icon -> **Settings**.
2.  Scroll down to **Developer Settings** (bottom left).
3.  Click **Personal access tokens** -> **Tokens (classic)**.
4.  Click **Generate new token (classic)**.
5.  **Note**: "Agent Zero Demo".
6.  **Scopes** (Check these boxes):
    -   [x] `repo` (Full control of private repositories)
    -   [x] `workflow` (Update GitHub Action workflows)
7.  Click **Generate token**.
8.  **COPY THIS TOKEN IMMEDIATELY.** (Starts with `ghp_...`).

---

## Phase 2: Agent Configuration (2 Minutes)

We need to tell the local Agent your secrets.

### 1. Open `.env`
In your project folder (`agent-shadow/agent-zero/.env`), add these lines:

```bash
# Existing
GEMINI_API_KEY=AIzaSy...

# NEW (Fill these in)
GITHUB_USERNAME=your-new-username
GITHUB_PAT=ghp_your_generated_token_here
```

### 2. Restart Infrastructure
Since we changed `.env`, we must restart Docker for Kestra to see it.

```bash
cd infrastructure
docker-compose down
docker-compose up -d
```

---

## Phase 3: The Live Demo (Showtime)

Now, when you trigger the agent, it will:
1.  **Analyze** the code using Gemini.
2.  **Fix** the code using Cline.
3.  **PUSH** a new branch (`agent-fix-autocorrect-...`) to your fork on GitHub.

### How to Trigger
```bash
# In terminal
curl -X POST http://localhost:8080/api/v1/executions/webhook/com.agentzero/github-events/github-trigger \
-H "Content-Type: application/json" \
-d '{"repository": {"full_name": "your-new-username/vulnerable-app"}, "sender": {"login": "demo-user"}}'
```

### What to Show the Judges
1.  Show the **Mission Control Dashboard** (`localhost:3000`) lighting up.
2.  Switch to your **GitHub Repo** in the browser.
3.  Refresh the "Branches" or "Pull Requests" tab.
4.  **Boom!** A new branch just appeared, authored by Agent Zero. 🪄
