import json
import sys
import os

def calculate_mcs(data_path):
    """
    Calculates the Merge Confidence Score (MCS) based on aggregated data.
    """
    try:
        with open(data_path, 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Data file not found at {data_path}")
        sys.exit(1)

    score = 0
    max_score = 100
    breakdown = []

    # 1. CodeRabbit Review (Weight: 40%)
    # Assumes CodeRabbit provides a specific status or score
    cr_status = data.get('coderabbit', {}).get('status', 'unknown')
    if cr_status == 'approvable':
        score += 40
        breakdown.append("CodeRabbit: +40 (Approvable)")
    elif cr_status == 'changes_requested':
        score += 0
        breakdown.append("CodeRabbit: +0 (Changes Requested)")
    else:
        score += 20 # Neutral/Unknown
        breakdown.append("CodeRabbit: +20 (Neutral/Unknown)")

    # 2. Vercel Build Status (Weight: 30%)
    vercel_status = data.get('vercel', {}).get('status', 'unknown')
    if vercel_status == 'ready' or vercel_status == 'succeeded':
        score += 30
        breakdown.append("Vercel: +30 (Build Succeeded)")
    elif vercel_status == 'error' or vercel_status == 'failed':
        score += 0
        breakdown.append("Vercel: +0 (Build Failed)")
        # Critical failure penalizes heavily
        score = max(0, score - 20) 
        breakdown.append("Penalty: -20 (Critical Build Failure)")
    else:
        score += 10
        breakdown.append(f"Vercel: +10 (Status: {vercel_status})")

    # 3. Test Coverage (Weight: 20%)
    coverage = data.get('codecov', {}).get('coverage', 0)
    # Simple linear scaling: 0% cov = 0 pts, 100% cov = 20 pts
    cov_points = min(20, int(coverage * 0.2)) 
    score += cov_points
    breakdown.append(f"Coverage: +{cov_points} ({coverage}%)")

    # 4. Agent Zero Shadow Analysis (Weight: 10%)
    # If Shadow Agent found no critical issues
    shadow_issues = data.get('shadow_agent', {}).get('critical_issues', 0)
    if shadow_issues == 0:
        score += 10
        breakdown.append("Shadow Agent: +10 (No Critical Issues)")
    else:
        score += 0
        breakdown.append(f"Shadow Agent: +0 ({shadow_issues} Critical Issues)")

    # Normalize
    score = min(max_score, max(0, score))

    result = {
        "mcs": score,
        "breakdown": breakdown,
        "status": "MERGE_CANDIDATE" if score >= 80 else "NEEDS_REVIEW" if score >= 50 else "AUTOCORRECT"
    }

    print(json.dumps(result, indent=2))
    
    # Also write to output file if needed by Kestra
    # output_file = os.environ.get('KESTRA_OUTPUT_FILE') ...

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python calculate_mcs.py <data.json>")
        sys.exit(1)
    
    calculate_mcs(sys.argv[1])
