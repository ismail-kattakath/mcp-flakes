#!/bin/bash
# MCP Smoke Test - validates that a server speaks MCP protocol
# Usage: ./smoke-test.sh <image-name>

set -e

IMAGE="$1"
if [ -z "$IMAGE" ]; then
    echo "Usage: $0 <image-name>"
    exit 1
fi

echo "=== MCP Smoke Test for $IMAGE ==="

# MCP initialize request
INITIALIZE_REQUEST='{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{"roots":{"listChanged":true},"sampling":{}},"clientInfo":{"name":"mcp-flakes-test","version":"1.0.0"}}}'

# MCP tools/list request
TOOLS_LIST_REQUEST='{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

echo "Step 1: Sending initialize request..."
# MCP servers may emit notifications (e.g. "connected via STDIO") before the
# actual initialize response. Filter by the request id to pick the response.
INIT_RESPONSE=$(echo "$INITIALIZE_REQUEST" | docker run -i --rm "$IMAGE" | grep '"id":1' | head -1)

echo "Response: $INIT_RESPONSE"

# Check if response contains protocolVersion (indicates successful init)
if echo "$INIT_RESPONSE" | grep -q '"protocolVersion"'; then
    echo "✅ Initialize succeeded"
else
    echo "❌ Initialize failed - no protocolVersion in response"
    exit 1
fi

echo ""
echo "Step 2: Sending tools/list request..."
# Same filter: pick the response matching id=2 (the tools/list request).
TOOLS_RESPONSE=$(echo -e "$INITIALIZE_REQUEST\n$TOOLS_LIST_REQUEST" | docker run -i --rm "$IMAGE" | grep '"id":2' | head -1)

echo "Response: $TOOLS_RESPONSE"

# Check if response contains tools array
if echo "$TOOLS_RESPONSE" | grep -q '"tools"'; then
    echo "✅ Tools list succeeded"

    # Extract and display tool names
    echo ""
    echo "Available tools:"
    echo "$TOOLS_RESPONSE" | grep -o '"name":"[^"]*"' | sed 's/"name":"//g' | sed 's/"//g' | sed 's/^/  - /'
else
    echo "❌ Tools list failed - no tools array in response"
    exit 1
fi

echo ""
echo "=== ✅ Smoke test passed ==="
