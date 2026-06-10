# MCP Time Server Flake

Provides time and timezone conversion capabilities for MCP clients. Retrieves current time information and performs timezone conversions using IANA timezone names with automatic system timezone detection.

## Upstream

- **Source**: https://github.com/modelcontextprotocol/servers
- **Subpath**: src/time
- **Commit**: 275175cda17ca9c49920ceed2bcf27e12e59f8b2
- **License**: MIT

## Tools

- `get_current_time` - Get current time in a specific timezone or system timezone
  - `timezone` (string, required): IANA timezone name (e.g., 'America/New_York', 'Europe/London')

- `convert_time` - Convert time between timezones
  - `source_timezone` (string, required): Source IANA timezone name
  - `time` (string, required): Time in 24-hour format (HH:MM)
  - `target_timezone` (string, required): Target IANA timezone name

## Environment Variables

- `LOCAL_TIMEZONE` - System timezone override in IANA format (default: `UTC`)
  - Examples: `America/New_York`, `Europe/London`, `Asia/Tokyo`

## Usage

### With Docker Compose

```bash
cd flakes/time
docker compose run --rm mcp-time
```

### Direct Docker Run

```bash
docker run -i --rm \
  -e LOCAL_TIMEZONE=America/Los_Angeles \
  ghcr.io/mcp-flakes/time:latest
```

### In a Bundle

```yaml
include:
  - ../../flakes/time/compose.yaml

# Override environment in bundle's .env file:
# LOCAL_TIMEZONE=America/New_York
```

## MCP Protocol

This server uses stdio transport. It expects MCP protocol messages on stdin and writes responses to stdout.

## Example Usage

Get current time in a specific timezone:
```json
{
  "name": "get_current_time",
  "arguments": {
    "timezone": "Europe/Warsaw"
  }
}
```

Response:
```json
{
  "timezone": "Europe/Warsaw",
  "datetime": "2024-01-01T13:00:00+01:00",
  "is_dst": false
}
```

Convert time between timezones:
```json
{
  "name": "convert_time",
  "arguments": {
    "source_timezone": "America/New_York",
    "time": "16:30",
    "target_timezone": "Asia/Tokyo"
  }
}
```

Response:
```json
{
  "source": {
    "timezone": "America/New_York",
    "datetime": "2024-01-01T16:30:00-05:00",
    "is_dst": false
  },
  "target": {
    "timezone": "Asia/Tokyo",
    "datetime": "2024-01-02T06:30:00+09:00",
    "is_dst": false
  },
  "time_difference": "+14.0h"
}
```

## Example Questions for Claude

1. "What time is it now?" (uses system timezone)
2. "What time is it in Tokyo?"
3. "When it's 4 PM in New York, what time is it in London?"
4. "Convert 9:30 AM Tokyo time to New York time"
