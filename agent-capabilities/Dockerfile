FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    python3-pip \
    curl \
    jq \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Install Cline CLI (Placeholder - adjust package name if needed)
# Install Cline CLI
RUN npm install -g cline 

# Create working directory
WORKDIR /app

# Copy scripts
COPY diagnose_error.sh /app/diagnose_error.sh
COPY autofix_deps.sh /app/autofix_deps.sh

# Make scripts executable
RUN chmod +x /app/*.sh

# Set entrypoint or default command
# Security: Run as non-root user
RUN groupadd -r agentzero && useradd -r -g agentzero -u 1001 agentzero

# Create workspace with correct permissions
RUN chown agentzero:agentzero /app

# Switch to non-root user
USER agentzero

ENTRYPOINT ["/bin/bash"]
