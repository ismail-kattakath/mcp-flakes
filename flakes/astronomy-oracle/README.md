# MCP Astronomy Oracle Server Flake

Accurate astronomical catalog data and observing session planner with 13,000+ deep-sky objects.

## Upstream

- **Source**: https://github.com/gregario/astronomy-oracle
- **Package**: astronomy-oracle
- **Commit**: dd8ee5e155c1b04ef366cc1288a3f2e58715ad9b
- **License**: MIT

## Build Pattern

NPM package pattern - installs pre-built published package.

## Tools

- `search_deep_sky_objects` - Search 13,000+ objects from OpenNGC catalog
- `get_object_info` - Get detailed information about a celestial object
- `calculate_visibility` - Calculate visibility windows for objects
- `get_rise_set_times` - Get rise/transit/set times for objects
- `plan_observing_session` - Plan optimal observing sessions

## Environment Variables

- `LATITUDE` - Observer latitude (default: 0)
- `LONGITUDE` - Observer longitude (default: 0)

## Usage

```bash
docker run -i --rm \
  -e LATITUDE=37.7749 \
  -e LONGITUDE=-122.4194 \
  ghcr.io/mcp-flakes/astronomy-oracle:latest
```
