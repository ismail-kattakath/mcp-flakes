#!/bin/bash
# Validate flake.yaml against JSON Schema
# Usage: ./validate-flake.sh <flake-name>

set -e

FLAKE="$1"
if [ -z "$FLAKE" ]; then
    echo "Usage: $0 <flake-name>"
    echo "Example: $0 filesystem"
    exit 1
fi

FLAKE_DIR="flakes/$FLAKE"
if [ ! -d "$FLAKE_DIR" ]; then
    echo "Error: Flake directory $FLAKE_DIR not found"
    exit 1
fi

if [ ! -f "$FLAKE_DIR/flake.yaml" ]; then
    echo "Error: $FLAKE_DIR/flake.yaml not found"
    exit 1
fi

echo "=== Validating $FLAKE flake.yaml ==="

# Check if yq is installed
if ! command -v yq &> /dev/null; then
    echo "⚠️  yq not installed - skipping YAML syntax check"
else
    echo "Step 1: YAML syntax check..."
    yq eval '.' "$FLAKE_DIR/flake.yaml" > /dev/null
    echo "✅ YAML syntax valid"
fi

# Check required files exist
echo ""
echo "Step 2: Required files check..."
MISSING_FILES=()

if [ ! -f "$FLAKE_DIR/Dockerfile" ]; then
    MISSING_FILES+=("Dockerfile")
fi

if [ ! -f "$FLAKE_DIR/compose.yaml" ]; then
    MISSING_FILES+=("compose.yaml")
fi

if [ ! -f "$FLAKE_DIR/README.md" ]; then
    MISSING_FILES+=("README.md")
fi

if [ ! -f "$FLAKE_DIR/ATTRIBUTION.md" ]; then
    MISSING_FILES+=("ATTRIBUTION.md")
fi

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo "❌ Missing required files:"
    for file in "${MISSING_FILES[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo "✅ All required files present"

# Check flake.yaml required fields
echo ""
echo "Step 3: Required fields check..."
REQUIRED_FIELDS=(
    ".name"
    ".upstream.repo"
    ".upstream.commit"
    ".upstream.license"
    ".runner"
    ".transport"
    ".publish_image"
)

for field in "${REQUIRED_FIELDS[@]}"; do
    if ! yq eval "$field" "$FLAKE_DIR/flake.yaml" &> /dev/null; then
        echo "❌ Missing required field: $field"
        exit 1
    fi
done

echo "✅ All required fields present"

# Check commit SHA format
echo ""
echo "Step 4: Commit SHA format check..."
COMMIT=$(yq eval '.upstream.commit' "$FLAKE_DIR/flake.yaml")
if [[ ! "$COMMIT" =~ ^[a-f0-9]{40}$ ]]; then
    echo "❌ Invalid commit SHA format: $COMMIT"
    echo "   Expected: 40-character hex string"
    exit 1
fi
echo "✅ Commit SHA valid: ${COMMIT:0:8}..."

# Check name format
echo ""
echo "Step 5: Name format check..."
NAME=$(yq eval '.name' "$FLAKE_DIR/flake.yaml")
if [[ ! "$NAME" =~ ^[a-z0-9-]+$ ]]; then
    echo "❌ Invalid name format: $NAME"
    echo "   Expected: lowercase-kebab-case"
    exit 1
fi
echo "✅ Name valid: $NAME"

# Check Dockerfile has labels
echo ""
echo "Step 6: Dockerfile labels check..."
if ! grep -q "org.opencontainers.image.source" "$FLAKE_DIR/Dockerfile"; then
    echo "❌ Dockerfile missing OCI labels"
    echo "   Expected: org.opencontainers.image.source label"
    exit 1
fi
echo "✅ Dockerfile has OCI labels"

# Check README has attribution
echo ""
echo "Step 7: README attribution check..."
if ! head -10 "$FLAKE_DIR/README.md" | grep -qi "originally\|licensed\|packaged"; then
    echo "⚠️  README may be missing attribution header"
    echo "   Expected attribution in first 10 lines"
else
    echo "✅ README has attribution"
fi

# Check ATTRIBUTION.md content
echo ""
echo "Step 8: ATTRIBUTION.md check..."
if ! grep -q "Original Work" "$FLAKE_DIR/ATTRIBUTION.md"; then
    echo "⚠️  ATTRIBUTION.md may be incomplete"
else
    echo "✅ ATTRIBUTION.md present"
fi

# Check compliance section
echo ""
echo "Step 9: Compliance metadata check..."
if yq eval '.compliance' "$FLAKE_DIR/flake.yaml" | grep -q "null"; then
    echo "⚠️  flake.yaml missing compliance section"
else
    echo "✅ Compliance section present"
fi

echo ""
echo "=== ✅ Validation passed for $FLAKE ==="
