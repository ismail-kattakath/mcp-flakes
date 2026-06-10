# 🌐 Unbrowser MCP Server

![Rust](https://img.shields.io/badge/Rust-1.83-orange?logo=rust)
![Binary Size](https://img.shields.io/badge/Binary-~5--10MB-success)
![No Chrome](https://img.shields.io/badge/Chrome-Not_Required-blue)

Lightweight browser automation for AI agents in a single static binary. JavaScript execution, form filling, and session management **without Chrome** dependency.

## Overview

Unbrowser is a Rust-based browser tier designed for agent workflows where `curl`/WebFetch is too limited but full Chrome is too heavy. It provides JavaScript execution, form filling, link following, and cookie management through a lightweight native binary with the Model Context Protocol.

## Features

- **JavaScript Execution**: Run JavaScript in fetched pages
- **Form Automation**: Fill and submit web forms
- **Link Following**: Navigate multi-page workflows
- **Cookie Management**: Maintain session state across requests
- **BlockMaps**: Return low-token representations of pages
- **Stateful Sessions**: Persistent browser profiles
- **No Chrome Dependency**: Pure Rust implementation
- **Static Binary**: Single executable with no runtime dependencies

## Usage

### With Docker Compose

```bash
docker compose up -d
docker compose exec unbrowser /app/unbrowser --help
```

### With Docker

```bash
docker build -t mcp-flakes/unbrowser:latest .
docker run -it --rm mcp-flakes/unbrowser:latest
```

### Configuration

Optional environment variables:
- `UNBROWSER_PROFILE`: Browser profile directory for cookies/state
- `RUST_LOG`: Logging level (debug, info, warn, error)

### Tools Available

- `unbrowser_navigate`: Navigate to URLs and extract content
- `unbrowser_click`: Click elements on pages
- `unbrowser_fill_form`: Fill and submit forms
- `unbrowser_screenshot`: Capture page screenshots (BlockMaps)
- `unbrowser_cookies`: Manage cookies and sessions

## When to Use

### Use Unbrowser When:
- You need JavaScript execution
- Forms must be filled and submitted
- Cookies/sessions are required
- Multi-page workflows are needed
- Token efficiency matters (BlockMaps vs full HTML)

### Escalate to Full Chrome When:
- Complex browser extensions are needed
- Human-in-the-loop authentication required
- Advanced browser features (DevTools, etc.)
- Real browser fingerprinting needed

For full Chrome automation, see [Unchained](https://unchainedsky.com) or [unchainedsky-cli](https://github.com/protostatis/unchainedsky-cli).

## Upstream

- **Repository**: https://github.com/protostatis/unbrowser
- **License**: Apache-2.0
- **Language**: Rust
- **Commit**: 3936108c5f3762a12be3576cd65e4b1f899aaaae

## Build Details

- **Builder Image**: rust:1.83-bookworm
- **Runtime Image**: debian:bookworm-slim
- **Build Type**: Multi-stage Docker build with release optimization
- **Binary Size**: ~5-10MB (estimated stripped static binary)
- **Dependencies**: libssl3 (runtime only)

## Architecture

Unbrowser uses:
- **rquickjs**: JavaScript engine (QuickJS)
- **wreq**: HTTP client with advanced features
- **html5ever**: HTML5 parsing
- LTO and stripping for minimal binary size

## Python Bindings

The upstream project also provides Python bindings as `pyunbrowser`. This flake packages only the Rust binary for MCP use.

## Quick Start

```bash
# Start the server
docker compose up -d
docker compose exec unbrowser /app/unbrowser --help
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **Form Automation** | "Fill out this contact form with my info" |
| **Multi-Page Workflows** | "Navigate to checkout and complete purchase" |
| **Session Handling** | "Log in and scrape my dashboard data" |
| **JavaScript Sites** | "Extract data from React-powered site" |
| **Cookie Management** | "Maintain session across multiple requests" |
| **Low-Token Scraping** | "Get BlockMap representation of page" |

## Example Workflows

### Form Submission

```javascript
// 1. Navigate to form page
unbrowser_navigate({ url: "https://example.com/contact" })

// 2. Fill form fields
unbrowser_fill_form({
  selectors: {
    name: "#name",
    email: "#email", 
    message: "#message"
  },
  values: {
    name: "John Doe",
    email: "john@example.com",
    message: "Hello!"
  }
})

// 3. Submit
unbrowser_click({ selector: "button[type=submit]" })
```

### Multi-Step Navigation

```javascript
// 1. Start at homepage
unbrowser_navigate({ url: "https://shop.example.com" })

// 2. Click product link
unbrowser_click({ selector: ".product-card:first-child a" })

// 3. Add to cart
unbrowser_click({ selector: ".add-to-cart" })

// 4. Navigate to cart
unbrowser_navigate({ url: "https://shop.example.com/cart" })
```

### Session Management

```javascript
// 1. Login
unbrowser_navigate({ url: "https://example.com/login" })
unbrowser_fill_form({
  selectors: { username: "#user", password: "#pass" },
  values: { username: "user", password: "pass" }
})
unbrowser_click({ selector: "#login-btn" })

// 2. Get cookies
cookies = unbrowser_cookies({ action: "get" })

// 3. Use session in future requests
// Cookies automatically maintained in profile
```

### BlockMap Extraction

```javascript
// Get low-token page representation
blockmap = unbrowser_screenshot({ 
  url: "https://example.com",
  format: "blockmap"
})

// Returns hierarchical structure:
// - Main content blocks
// - Links and navigation
// - Form elements
// - Much smaller token footprint than full HTML
```

## When to Use vs Alternatives

### Use Unbrowser When:
✅ JavaScript execution needed
✅ Form interactions required  
✅ Session/cookie management needed
✅ Multi-page workflows
✅ Token efficiency matters (BlockMaps)
✅ No Chrome dependency acceptable

### Use curl/WebFetch When:
✅ Static HTML pages
✅ Simple GET requests
✅ Public APIs
✅ No JavaScript required

### Use Full Chrome When:
✅ Complex SPA applications
✅ Browser extensions needed
✅ Human-in-loop authentication (CAPTCHA)
✅ Advanced DevTools features
✅ Real browser fingerprinting required

## Technical Details

### Built With
- **rquickjs**: QuickJS JavaScript engine (fast, lightweight)
- **wreq**: Advanced HTTP client
- **html5ever**: Standards-compliant HTML5 parsing
- **Rust**: Memory-safe, high-performance

### Binary Characteristics
- **Size**: ~5-10MB stripped static binary
- **Memory**: Low footprint vs full browser
- **Startup**: Near-instant vs browser launch
- **Dependencies**: libssl3 only

### BlockMaps

BlockMaps are low-token page representations:
- Extract semantic structure
- Filter noise and boilerplate
- Return hierarchical blocks
- 10-100x fewer tokens than full HTML
- Ideal for LLM context windows

## Environment Variables

```yaml
environment:
  - UNBROWSER_PROFILE=/data/profile  # Cookie/session storage
  - RUST_LOG=info  # debug, info, warn, error
```

## Persistent Sessions

```yaml
volumes:
  - ./unbrowser-profile:/data/profile

environment:
  - UNBROWSER_PROFILE=/data/profile
```

Cookies and session data persist across restarts.

## Related Flakes

- **fetch** - Simple HTTP requests without JavaScript
- **filesystem** - File operations for downloaded content
- **sequentialthinking** - Complex multi-step web workflows

## See Also

- [Unbrowser Documentation](https://github.com/protostatis/unbrowser)
- [Unchained](https://unchainedsky.com) - Full browser automation platform
- [ATTRIBUTION.md](./ATTRIBUTION.md) for licensing details
