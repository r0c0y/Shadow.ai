# Stage 2: Data Aggregation & Decision Logic

## Goal
Implement the core intelligence of Agent Zero: aggregating data from various sources (CodeRabbit, Vercel, Tests) and calculating the Merge Confidence Score (M.C.S.).

## 1. M.C.S. Calculation Script (`scripts/calculate_mcs.py`)
- **Inputs:** `data.json` containing:
  - `coderabbit`: status, summary
  - `vercel`: deployment status, url
  - `codecov`: coverage %
  - `shadow_agent`: analysis result
- **Logic:**
  - Base Score: 0
  - +40 for CodeRabbit Approval
  - +30 for Vercel Success
  - +20 for High Test Coverage (>80%)
  - +10 for Clean Shadow Agent Audit
  - -20 for Critical Build Failed
- **Output:** JSON with `{ "mcs": int, "status": "MERGE_CANDIDATE" | "AUTOCORRECT" | "NEEDS_REVIEW" }`

## 2. Kestra Integration
- **New Flow Tasks:**
  - `fetch_vercel_status`: HTTP Request to Vercel API (Mocked for now)
  - `fetch_code_quality`: Parsing CodeRabbit/Codecov inputs (Mocked)
  - `run_mcs_calculation`: Python script task running `calculate_mcs.py`
  - `decision_switch`: Switch case based on MCS status.

## 3. Mock Data for Testing
- Create `tests/mock_data/happy_path.json` (MCS 100)
- Create `tests/mock_data/broken_build.json` (MCS 10)
