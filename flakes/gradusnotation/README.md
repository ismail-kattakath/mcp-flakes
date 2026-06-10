# gradusnotation

Open music notation MCP server for AI agents. Render JSON scores to SVG, MusicXML, and MIDI with full harmonic analysis.

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

## License

MIT - See [ATTRIBUTION.md](./ATTRIBUTION.md) for full license text.
