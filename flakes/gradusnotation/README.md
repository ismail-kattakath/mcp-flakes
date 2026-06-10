# 🎵 Gradus Notation MCP Server

![Music](https://img.shields.io/badge/Music-Notation-9cf?logo=musical-note)
![TypeScript](https://img.shields.io/badge/TypeScript-Pure-blue?logo=typescript)
![MIT](https://img.shields.io/badge/License-MIT-green)

Open music notation MCP server for AI composers and music educators. Render JSON scores to SVG, MusicXML, and MIDI with full harmonic analysis powered by MaestroAnalyzer.

**Upstream**: [delmas41/gradusnotation](https://github.com/delmas41/gradusnotation)

**Sponsored by**: Gradus School of Music Composition

## Features

- **Music Notation Rendering**: JSON score → SVG + MusicXML + MIDI in one call
- **Harmonic Analysis**: Full harmonic analysis with MaestroAnalyzer engine
- **Music Theory Tools**: Pitch arithmetic, range validation, enharmonic respelling
- **Knowledge Base**: Search curated music theory knowledge
- **No Dependencies**: Pure TypeScript, no music21, no Python

## Tools

### Notation Tools (5)

| Tool | Description |
|------|-------------|
| `notation_render` | JSON score → SVG + MusicXML + MIDI in one call |
| `notation_validate` | Pre-flight validate input shape (cheaper than render) |
| `knowledge_search` | Look up music-theory chunks before generating notation |
| `notation_examples` | Canonical input examples (cache and reuse) |
| `notation_schema` | JSON Schema for the input shape (cache and reuse) |

### Theory Tools (5)

| Tool | Description |
|------|-------------|
| `theory_analyze_score` | Parse MusicXML → full harmonic analysis + GKB knowledge chunks |
| `theory_parse_xml` | Parse MusicXML string → maestroAnalyst Score JSON |
| `theory_validate_ranges` | Check every note against instrument's practical range |
| `theory_respell` | Suggest preferred enharmonic spelling in key context |
| `theory_pitch_utils` | Pure-function pitch arithmetic: midi_to_pitch, pitch_to_midi, interval_name, transpose_pitch |

## Configuration

### Environment Variables

None required - this is a free, no-auth service.

## Usage

### Docker Compose

```bash
cd flakes/gradusnotation
docker compose up
```

### Direct Docker

```bash
docker build -t gradusnotation .
docker run -i gradusnotation
```

## Use Cases

1. **Music Composition**: Generate sheet music from JSON scores for AI composers
2. **Music Education**: Render musical examples for teaching materials
3. **Harmonic Analysis**: Analyze MusicXML files for chord progressions, cadences, phrases
4. **MIDI Export**: Convert notation to MIDI for playback and DAW integration
5. **Music Theory**: Query music theory knowledge base for educational content

## Output Formats

- **SVG**: Vector graphics for web display and print
- **MusicXML**: Industry standard for music notation interchange
- **MIDI**: Musical Instrument Digital Interface for playback
- **JSON**: Structured harmonic analysis data

## Special Dependencies

None - pure JavaScript/TypeScript server.

## Example Workflow

```javascript
// 1. Search knowledge base
knowledge_search({ query: "major scale" })

// 2. Get schema for input validation
notation_schema()

// 3. Validate your JSON score
notation_validate({ score: {...} })

// 4. Render to SVG + MusicXML + MIDI
notation_render({ score: {...} })

// 5. Analyze MusicXML for harmony
theory_analyze_score({ xml: "..." })
```

## Quick Start

```bash
# 1. Start the server
cd flakes/gradusnotation
docker compose up

# 2. No API keys required - it's free!
```

## Example Queries

- "Generate sheet music for a C major scale"
- "Create a I-IV-V-I progression in D major"
- "Analyze this MusicXML file for harmonic structure"
- "What are the notes in a Dm7 chord?"
- "Transpose this melody up a perfect fifth"

## Output Examples

### SVG Rendering
Beautiful vector graphics suitable for:
- Web display (responsive and crisp at any zoom)
- Print publication (high-quality professional output)
- Educational materials (clear notation for students)

### MusicXML Export
Industry-standard format compatible with:
- Sibelius
- Finale
- MuseScore
- Dorico
- Any professional notation software

### MIDI Export
Playback-ready files for:
- DAW integration (Logic, Ableton, FL Studio)
- Virtual instruments
- Music education software
- Automated playback and testing

## Music Theory Features

### Harmonic Analysis
- Chord identification and Roman numeral analysis
- Cadence detection (authentic, half, plagal, deceptive)
- Phrase structure analysis
- Modulation tracking

### Pitch Operations
- MIDI number to pitch name conversion
- Pitch to MIDI conversion
- Interval calculation
- Transposition with key awareness
- Enharmonic respelling suggestions

### Range Validation
- Instrument range checking
- Practical vs theoretical range distinction
- Automatic warnings for unplayable notes

## Knowledge Base

Query the curated music theory knowledge base:
- Scales and modes
- Chord construction
- Voice leading rules
- Counterpoint principles
- Common progressions
- Cadence patterns

## Related Flakes

- **spotify** - Music streaming and playlist management
- **yutu** - YouTube video and audio management
- **sequentialthinking** - Complex problem decomposition

## License

MIT - See [ATTRIBUTION.md](./ATTRIBUTION.md) for full license text.
