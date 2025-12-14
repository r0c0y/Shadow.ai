#!/bin/bash

# Configuration
KESTRA_VERSION="1.1.8"
KESTRA_PLUGINS_PATH="./plugins"

echo "🚀 Starting Agent Zero (Lite Mode)..."

# Download Kestra JAR if not present
if [ ! -f "kestra" ]; then
    echo "⬇️  Downloading Kestra..."
    curl -L "https://github.com/kestra-io/kestra/releases/download/v$KESTRA_VERSION/kestra-$KESTRA_VERSION" -o kestra
    chmod +x kestra
fi

echo "📦 Installing Python dependencies..."
python3 -m pip install requests || echo "⚠️  Pip install failed, ensure requests is installed."

# Startup Cleanup
pkill -f "kestra server" || true
rm -f data/*.lock

# Install Kestra Plugins (Force resolve)
echo "🔌 Installing Kestra Plugins..."
./kestra plugins install io.kestra.plugin:plugin-script-python:LATEST || ./kestra plugins install io.kestra.plugin:plugin-script-python:RELEASE
./kestra plugins install io.kestra.plugin:plugin-script-shell:LATEST || ./kestra plugins install io.kestra.plugin:plugin-script-shell:RELEASE

# Set Environment Variables (Secrets)
# Placeholder values for security. Users should set these in their environment.
export KESTRA_SECRET_JIRA_DOMAIN=${KESTRA_SECRET_JIRA_DOMAIN:-"your-domain.atlassian.net"}
export KESTRA_SECRET_JIRA_USER=${KESTRA_SECRET_JIRA_USER:-"user@example.com"}
export KESTRA_SECRET_JIRA_TOKEN=${KESTRA_SECRET_JIRA_TOKEN:-"your-jira-token"} 
export KESTRA_SECRET_JIRA_PROJECT_KEY=${KESTRA_SECRET_JIRA_PROJECT_KEY:-"SEC"}
export KESTRA_SECRET_GROQ_API_KEY=${KESTRA_SECRET_GROQ_API_KEY:-"gsk_your_groq_api_key"}

# Disable Auth via Env Vars (Stronger than config file)
export KESTRA_SERVER_BASIC_AUTH_ENABLED=false
export MICRONAUT_SECURITY_ENABLED=false

# Start Kestra Server
echo "✅ Kestra Server handling on port 8080"
./kestra server local &
KESTRA_PID=$!

echo "Waiting for Kestra to be ready..."
until curl -s -o /dev/null http://localhost:8080/api/v1/flows/search; do
    echo "Processing..."
    sleep 2
done
echo "✅ Agent Zero Lite is READY!"

# Import Flow (Now that server is up)
echo "🔄 Importing Flow..."
if [ -f "flows/agent_zero_lite.yml" ]; then
    ./kestra flow update flows/agent_zero_lite.yml com.agentzero agent_zero_lite
else
    echo "⚠️ Flow file not found: flows/agent_zero_lite.yml"
fi

echo "---------------------------------------------------"
echo "URL: http://localhost:8080"
echo "---------------------------------------------------"

# Start Dashboard if not running (simple check)
if ! lsof -i:3000 > /dev/null; then
    echo "🚀 Starting Mission Control Dashboard..."
    # Ensure npm is found (add common paths)
    export PATH=$PATH:/usr/local/bin:/opt/homebrew/bin
    cd dashboard && npm run dev &
    cd ..
    echo "📊 Dashboard: http://localhost:3000"
else
    echo "📊 Dashboard already running: http://localhost:3000"
fi

wait $KESTRA_PID
