
import os
import json
import requests
import sys

def analyze_failure(context_data):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print(json.dumps({"error": "Missing GEMINI_API_KEY"}))
        sys.exit(1)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    
    # Construct a prompt that forces JSON output
    prompt = f"""
    You are Agent Zero, an autonomous code quality AI.
    Analyze the following Git/CI context and determine if the code is safe to merge, needs human review, or needs an autonomous fix.
    
    CONTEXT:
    {json.dumps(context_data, indent=2)}
    
    RULES:
    1. If there are critical failures (build broke, tests failed), score < 50 and status = AUTOCORRECT.
    2. If code quality is low but passing, score 50-79 and status = NEEDS_REVIEW.
    3. If everything looks good, score >= 80 and status = MERGE_CANDIDATE.
    
    OUTPUT FORMAT:
    Return ONLY a raw JSON object (no markdown formatting) with these fields:
    - "mcs": integer (0-100)
    - "status": string ("AUTOCORRECT", "NEEDS_REVIEW", "MERGE_CANDIDATE")
    - "reasoning": string (concise explanation)
    - "suggested_fix": string (shell command or "N/A")
    """

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        
        result = response.json()
        # safely extract text
        raw_text = result['candidates'][0]['content']['parts'][0]['text']
        
        # Clean markdown code blocks if present
        clean_text = raw_text.replace("```json", "").replace("```", "").strip()
        
        # Parse and print JSON
        analysis = json.loads(clean_text)
        print(json.dumps(analysis))
        
    except Exception as e:
        # Fallback in case of AI failure
        fallback = {
            "mcs": 0,
            "status": "NEEDS_REVIEW",
            "reasoning": f"AI Analysis Failed: {str(e)}",
            "suggested_fix": "N/A"
        }
        print(json.dumps(fallback))

if __name__ == "__main__":
    # In Kestra, inputs are often passed as env vars or sys.argv
    # For this script, we'll read a JSON string from stdin or use mock data if testing
    try:
        # Kestra passes inputs via variables, we can simulate reading 'inputs' from args
        input_json = sys.argv[1] if len(sys.argv) > 1 else '{}'
        data = json.loads(input_json)
        analyze_failure(data)
    except Exception as e:
        analyze_failure({"error": f"Input parsing failed: {str(e)}"})
