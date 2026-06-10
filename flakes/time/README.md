# 🕐 MCP Time Server Flake

![Timezones](https://img.shields.io/badge/Timezones-IANA-blue)
![Conversions](https://img.shields.io/badge/Conversions-Accurate-success)
![MIT](https://img.shields.io/badge/License-MIT-green)

Time and timezone conversion for AI agents. Get current time in any timezone, convert between timezones, and handle daylight saving time automatically using IANA timezone database.

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

## Quick Start

```bash
# Start the server
cd flakes/time
docker compose run --rm mcp-time
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **Meeting Scheduling** | "When it's 2 PM in SF, what time is it in London?" |
| **Travel Planning** | "What's the time difference between NYC and Tokyo?" |
| **Global Coordination** | "Convert these meeting times for all team members" |
| **Timestamp Conversion** | "What time is 14:00 UTC in my timezone?" |
| **DST Handling** | "Does this timezone observe daylight saving?" |

## Common Timezones

### Americas
- `America/New_York` - US Eastern
- `America/Chicago` - US Central
- `America/Denver` - US Mountain
- `America/Los_Angeles` - US Pacific
- `America/Toronto` - Canada Eastern
- `America/Vancouver` - Canada Pacific
- `America/Sao_Paulo` - Brazil

### Europe
- `Europe/London` - UK
- `Europe/Paris` - France, Germany (CET)
- `Europe/Moscow` - Russia
- `Europe/Istanbul` - Turkey

### Asia-Pacific
- `Asia/Tokyo` - Japan
- `Asia/Shanghai` - China
- `Asia/Hong_Kong` - Hong Kong
- `Asia/Singapore` - Singapore
- `Asia/Dubai` - UAE
- `Asia/Kolkata` - India
- `Australia/Sydney` - Australia East

## Example Workflows

### Schedule International Meeting

```javascript
// Find overlapping work hours
times = [
  convert_time({
    source_timezone: "America/Los_Angeles",
    time: "09:00",
    target_timezone: "Europe/London"
  }),
  convert_time({
    source_timezone: "America/Los_Angeles",
    time: "09:00",
    target_timezone: "Asia/Tokyo"
  })
]

// Returns:
// LA 9:00 AM = London 5:00 PM = Tokyo 1:00 AM (next day)
```

### Check Current Time Globally

```javascript
locations = [
  "America/New_York",
  "Europe/London", 
  "Asia/Tokyo",
  "Australia/Sydney"
]

locations.map(tz => get_current_time({ timezone: tz }))

// Returns current time in all locations
```

### Plan Travel Itinerary

```javascript
// Departure time
departure = get_current_time({ timezone: "America/Los_Angeles" })

// Arrival time (after 12-hour flight)
arrival = convert_time({
  source_timezone: "America/Los_Angeles",
  time: "14:00",  // 2 PM departure
  target_timezone: "Asia/Tokyo"
})

// Returns arrival time accounting for timezone change
```

## Daylight Saving Time

The server automatically handles DST:

```javascript
// Summer (DST active)
convert_time({
  source_timezone: "America/New_York",
  time: "12:00",
  target_timezone: "Europe/London"
})
// EDT (UTC-4) → BST (UTC+1) = 5:00 PM

// Winter (DST inactive)
convert_time({
  source_timezone: "America/New_York", 
  time: "12:00",
  target_timezone: "Europe/London"
})
// EST (UTC-5) → GMT (UTC+0) = 5:00 PM
```

The `is_dst` field in responses indicates if DST is active.

## Time Formats

### Input Format
- **24-hour format**: `HH:MM` (e.g., `14:30`, `09:00`)
- Hours: 00-23
- Minutes: 00-59

### Output Format
```json
{
  "timezone": "Europe/London",
  "datetime": "2024-06-09T14:30:00+01:00",  // ISO 8601
  "is_dst": true
}
```

## IANA Timezone Names

Find timezone names:
- [IANA Timezone Database](https://www.iana.org/time-zones)
- [Timezone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

### Common Patterns
- `Continent/City` (e.g., `America/New_York`)
- `Country/City` (e.g., `Australia/Sydney`)
- Avoid abbreviations (EST, PST) - use full names

## Example Questions for Claude

1. "What time is it now?" (uses system timezone)
2. "What time is it in Tokyo?"
3. "When it's 4 PM in New York, what time is it in London?"
4. "Convert 9:30 AM Tokyo time to New York time"
5. "What's the time difference between San Francisco and Berlin?"
6. "If I call London at 10 AM my time (LA), what time is it there?"
7. "Is daylight saving time active in New York right now?"

## Related Flakes

- **memory** - Store timezone preferences for users
- **sequentialthinking** - Complex scheduling logic
- **mcp-market-data** - Market hours across timezones
