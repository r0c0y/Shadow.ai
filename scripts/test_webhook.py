import requests
import hashlib
import hmac
import json
import sys

# Configuration
WEBHOOK_URL = "http://localhost:3000/webhook"
SECRET = "test_secret"

def create_signature(secret, payload_body):
    mac = hmac.new(secret.encode(), payload_body, hashlib.sha256)
    return "sha256=" + mac.hexdigest()

def send_test_event():
    payload = {
        "repository": {
            "full_name": "agent-zero/demo-repo",
            "name": "demo-repo"
        },
        "sender": {
            "login": "test-user"
        },
        "action": "opened",
        "pull_request": {
            "number": 1,
            "title": "Test PR from Agent Zero Script"
        }
    }
    
    payload_json = json.dumps(payload)
    payload_bytes = payload_json.encode('utf-8')
    
    signature = create_signature(SECRET, payload_bytes)
    
    headers = {
        "Content-Type": "application/json",
        "X-Hub-Signature-256": signature,
        "X-GitHub-Event": "pull_request"
    }
    
    print(f"Sending webhook to {WEBHOOK_URL}...")
    try:
        response = requests.post(WEBHOOK_URL, data=payload_bytes, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Failed to send request: {e}")

if __name__ == "__main__":
    send_test_event()
