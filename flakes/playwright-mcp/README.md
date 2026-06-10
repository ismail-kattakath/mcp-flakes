# Playwright MCP Server

Official Microsoft MCP server for browser automation using Playwright.

## Features

- **Structured Automation**: Uses accessibility tree instead of screenshots
- **Fast & Lightweight**: No vision models required
- **Multi-Browser**: Chromium, Firefox, WebKit support
- **LLM-Friendly**: Operates on structured data, not pixels
- **Deterministic**: Avoids ambiguity of screenshot-based approaches

## Key Tools

- **Navigation**: Navigate to URLs, handle redirects
- **Interaction**: Click, fill forms, hover, select dropdowns
- **Extraction**: Get accessibility snapshots, evaluate JavaScript
- **Screenshots**: Capture page or element screenshots
- **Console**: Monitor browser console logs

## API & Pricing

**Provider**: Open Source (Apache 2.0 License)

**Cost**: FREE - No API key required

**Requirements**:
- Sufficient disk space for browser binaries (~600MB)
- 2GB shared memory for browser processes

**Rate Limits**: None (local execution)

## Environment Variables

- `PLAYWRIGHT_BROWSERS_PATH` (optional): Browser installation path

## Example Use Cases

```bash
# Navigate and extract data
playwright_navigate(url="https://example.com")
playwright_accessibility_snapshot()

# Fill and submit forms
playwright_fill(selector="input[name='email']", value="user@example.com")
playwright_click(selector="button[type='submit']")

# Take screenshots
playwright_screenshot(path="page.png", full_page=true)

# Evaluate JavaScript
playwright_evaluate(script="document.title")
```

## Usage

```bash
docker compose run --rm mcp-playwright
```

## Why Playwright MCP?

- **No API Costs**: Fully local execution
- **Production-Grade**: Used by Microsoft and thousands of developers
- **Reliable**: Mature browser automation framework
- **Active Development**: Regular updates and improvements

## Limitations

- Requires more resources than API-based solutions
- Browser binaries add ~600MB to image size
- Not suitable for high-volume parallel execution

## License

Apache 2.0 - Microsoft Corporation

## Links

- [GitHub](https://github.com/microsoft/playwright-mcp)
- [Playwright Docs](https://playwright.dev/)
- [MCP Documentation](https://github.com/microsoft/playwright-mcp#readme)
