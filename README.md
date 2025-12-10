# Agent Zero 🤖

**The Autonomous "Shadow Maintainer" for your Repository.**

Agent Zero sits between your code and your CI/CD. It listens for events, thinks about code quality (Merge Confidence Score), and autonomously fixes broken builds.

## 📂 Repository Structure

- **`infrastructure/`**: Docker Compose setup for Kestra (Orchestrator) and MongoDB.
- **`webhook-receiver/`**: High-performance Rust (Axum) server to ingest GitHub events.
- **`flows/`**: Kestra YAML definitions defining the "Brain" logic.
- **`agent-capabilities/`**: Docker environment for the "Hands" (Cline CLI + Tools).
- **`dashboard/`**: Next.js "Mission Control" UI for real-time monitoring.
- **`scripts/`**: Utilities for deployment (`deploy_flows.sh`) and testing.

## 🚀 Quick Start

1.  **Start Infrastructure:** `cd infrastructure && docker-compose up -d`
2.  **Start Receiver:** `cd webhook-receiver && cargo run`
3.  **Start Dashboard:** `cd dashboard && npm run start`

## 📚 Documentation
(Located in Artifacts)

- **[Final Project Report](../.gemini/antigravity/brain/97f3ccb8-d90c-455b-a026-d49db52117a5/final_report.md)**: Executive summary, features, and architecture.
- **[Walkthrough Guide](../.gemini/antigravity/brain/97f3ccb8-d90c-455b-a026-d49db52117a5/walkthrough.md)**: Detailed step-by-step usage and enabling real Autonomous Mode.
- **[Roadmap V1.0](../.gemini/antigravity/brain/97f3ccb8-d90c-455b-a026-d49db52117a5/ROADMAP.md)**: The plan for Hardening, Security, and Real Intelligence.

---
*Generated for Agentic Coding Hackathon 2024*
