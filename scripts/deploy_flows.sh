#!/bin/bash

KESTRA_URL="http://localhost:8080"
FLOWS_DIR="./flows"

echo "Deploying flows to $KESTRA_URL from $FLOWS_DIR..."

for file in $FLOWS_DIR/*.yml; do
    echo "Deploying $file..."
    # Try to Create (POST)
    response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$KESTRA_URL/api/v1/flows" -H "Content-Type: application/x-yaml" --data-binary "@$file")
    
    if [ "$response" == "409" ] || [ "$response" == "422" ]; then
        echo "Flow exists, removing and re-deploying..."
        # Extract namespace and id from file
        namespace=$(grep "^namespace:" "$file" | awk '{print $2}')
        id=$(grep "^id:" "$file" | awk '{print $2}')
        curl -X DELETE "$KESTRA_URL/api/v1/flows/$namespace/$id"
        curl -X POST "$KESTRA_URL/api/v1/flows" -H "Content-Type: application/x-yaml" --data-binary "@$file"
    fi
    echo ""
done

echo "Done!"
