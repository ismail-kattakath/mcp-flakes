# 🔭 Astronomy Oracle - Deep-Sky Object Catalog & Observing Planner

> Originally created by [gregario](https://github.com/gregario/astronomy-oracle) · Licensed under MIT  
> Packaged by [mcp-flakes](https://github.com/yourusername/mcp-flakes)

![npm package](https://img.shields.io/badge/npm-package-CB3837?logo=npm) ![Location aware](https://img.shields.io/badge/location-aware-orange) ![Tools: 5](https://img.shields.io/badge/tools-5-blue)

## 📋 What This Does

Access the OpenNGC catalog of 13,000+ deep-sky objects with location-aware visibility calculations. Plan optimal observing sessions, calculate rise/set times, and discover celestial objects based on your geographic location and observing conditions.

## ⚡ Quick Start

```bash
docker run -i --rm \
  -e LATITUDE=37.7749 \
  -e LONGITUDE=-122.4194 \
  ghcr.io/mcp-flakes/astronomy-oracle:latest
```

With Docker Compose:
```bash
cd flakes/astronomy-oracle
docker compose run --rm mcp-astronomy-oracle
```

## 🎯 Perfect For

- **Amateur astronomers** - Plan observing sessions with visibility windows and optimal viewing times
- **Astrophotography** - Find targets that will be visible at specific times from your location
- **Education** - Explore deep-sky object catalogs with detailed astronomical data
- **Event planning** - Calculate rise/set times for celestial events and object transits

## 🛠️ Tools & Features

| Tool | Purpose | Key Parameters |
|------|---------|---------------|
| `search_deep_sky_objects` | Search 13,000+ OpenNGC catalog objects | `query`, `type`, `magnitude` |
| `get_object_info` | Get detailed object information | `object_id` or `name` |
| `calculate_visibility` | Calculate visibility windows | `object_id`, `date_range` |
| `get_rise_set_times` | Rise/transit/set times for objects | `object_id`, `date` |
| `plan_observing_session` | Optimal session planning | `date`, `duration`, `constraints` |

## 📚 Examples

### Example 1: Plan Tonight's Observing Session
Ask Claude: *"What galaxies will be visible tonight from San Francisco? Show me the best observing window."*

Set `LATITUDE=37.7749` and `LONGITUDE=-122.4194`. The server calculates which deep-sky objects are visible and when they're highest in the sky.

### Example 2: Astrophotography Target
Ask Claude: *"Find nebulae brighter than magnitude 8 that will be visible this weekend, and give me their rise and set times"*

Plan your imaging session with precise timing data.

### Example 3: Educational Research
Ask Claude: *"Search for globular clusters in the constellation Hercules and give me detailed information about M13"*

Explore the catalog with natural language queries.

### Example 4: Location-Specific Planning
Ask Claude: *"I'm in Tokyo (35.6762°N, 139.6503°E). What's the best time to observe the Andromeda Galaxy next month?"*

Configure location and get custom visibility calculations.

## 🔗 Works Great With

- **fetch** - Retrieve images and current research papers about discovered objects
- **excalidraw-architect-mcp** - Create star charts or observing plan diagrams
- **everything** - Combine astronomical data with other resources for educational content

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `LATITUDE` | Observer latitude in decimal degrees | `0` | `37.7749` (San Francisco) |
| `LONGITUDE` | Observer longitude in decimal degrees | `0` | `-122.4194` (San Francisco) |

**Location tips:**
- Positive latitude = North, Negative = South
- Positive longitude = East, Negative = West
- Use decimal degrees, not degrees/minutes/seconds
- Find your coordinates: https://www.latlong.net/

### Build Pattern

**Type**: npm package pattern  
Installs pre-built `astronomy-oracle` package from npm.

## 📦 Source & Compliance

- **Source**: https://github.com/gregario/astronomy-oracle
- **Package**: astronomy-oracle (npm)
- **Commit**: `dd8ee5e155c1b04ef366cc1288a3f2e58715ad9b`
- **License**: MIT
- **Protocol**: stdio transport
- **Data**: OpenNGC catalog (13,000+ objects)
