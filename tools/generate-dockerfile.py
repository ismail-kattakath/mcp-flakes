#!/usr/bin/env python3
"""
Dockerfile Generator for mcp-flakes
Generates Dockerfile from flake.yaml manifest using templates
"""

import sys
import yaml
import json
from pathlib import Path
from string import Template

# Runner image mapping
RUNNER_IMAGES = {
    "node": "node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df",
    "python": "python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203",
}

def load_flake_yaml(flake_path):
    """Load and parse flake.yaml"""
    yaml_path = Path(flake_path) / "flake.yaml"
    if not yaml_path.exists():
        raise FileNotFoundError(f"flake.yaml not found at {yaml_path}")

    with open(yaml_path) as f:
        return yaml.safe_load(f)

def detect_pattern(manifest):
    """Detect build pattern from manifest"""
    build = manifest.get("build", {})
    upstream = manifest.get("upstream", {})

    # Check explicit pattern
    if "type" in build:
        return build["type"]

    # Auto-detect
    if "package" in upstream:
        if manifest["runner"] == "python":
            return "python-pypi"
        return "npm-package"

    if "subpath" in upstream:
        return "monorepo"

    if manifest["runner"] == "python":
        return "python-source"

    # Default to single-ts
    return "single-ts"

def render_template(template_path, context):
    """Render Dockerfile template with context"""
    with open(template_path) as f:
        template_content = f.read()

    template = Template(template_content)
    return template.safe_substitute(context)

def format_entrypoint(entrypoint):
    """Format entrypoint list as JSON array for Dockerfile"""
    return json.dumps(entrypoint)

def generate_dockerfile(flake_path):
    """Generate Dockerfile from flake.yaml"""
    manifest = load_flake_yaml(flake_path)
    pattern = detect_pattern(manifest)

    print(f"Detected pattern: {pattern}")

    # Build context
    upstream = manifest["upstream"]
    build = manifest.get("build", {})
    compliance = manifest.get("compliance", {})

    context = {
        "name": manifest["name"],
        "title": f"MCP {manifest['name'].title()} Server",
        "description": f"MCP server for {manifest['name']}",
        "repo": upstream["repo"],
        "commit": upstream["commit"],
        "license": upstream["license"],
        "authors": ", ".join(compliance.get("authors", ["Unknown"])),
        "documentation_url": f"{upstream['repo']}/tree/{upstream['commit']}",
        "runner_image": RUNNER_IMAGES[manifest["runner"]],
        "install_command": build.get("install", "npm ci"),
        "build_command": build.get("build", "npm run build"),
        "entrypoint": format_entrypoint(build.get("entrypoint", ["node", "dist/index.js"])),
    }

    # Pattern-specific context
    if pattern == "monorepo":
        context["subpath"] = upstream.get("subpath", "src")
    elif pattern in ["npm-package", "python-pypi"]:
        context["package"] = upstream.get("package", manifest["name"])
        context["version"] = upstream.get("package_version", "latest")

    if pattern == "python-pypi" and "extras" in build:
        context["extras"] = build["extras"]

    # Load template
    template_path = Path(__file__).parent / "templates" / f"{pattern}.Dockerfile.template"
    if not template_path.exists():
        # Fallback to single-ts
        template_path = Path(__file__).parent / "templates" / "single-ts.Dockerfile.template"

    # Generate
    dockerfile_content = render_template(template_path, context)

    # Write
    output_path = Path(flake_path) / "Dockerfile.generated"
    with open(output_path, "w") as f:
        f.write(dockerfile_content)

    print(f"Generated: {output_path}")
    return output_path

def main():
    if len(sys.argv) < 2:
        print("Usage: ./generate-dockerfile.py <flake-name>")
        print("Example: ./generate-dockerfile.py filesystem")
        sys.exit(1)

    flake_name = sys.argv[1]
    flake_path = Path("flakes") / flake_name

    if not flake_path.exists():
        print(f"Error: Flake directory not found: {flake_path}")
        sys.exit(1)

    try:
        output = generate_dockerfile(flake_path)
        print(f"✅ Dockerfile generated successfully")
        print(f"Review: {output}")
        print(f"To use: mv {output} {flake_path}/Dockerfile")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
