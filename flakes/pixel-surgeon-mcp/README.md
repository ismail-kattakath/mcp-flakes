# pixel-surgeon-mcp

AI image and video generation, editing, and region repair with multi-provider support.

**Upstream**: [j-east/pixel-surgeon-mcp](https://github.com/j-east/pixel-surgeon-mcp)

## Features

- **Multi-provider image generation**: Google Gemini, OpenAI GPT Image, xAI Grok Imagine
- **Video generation**: Text-to-video with Veo 3 (5s or 8s with audio)
- **Image editing**: Natural language image editing and style transfer
- **Region repair**: Grid-based tile repair for garbled text, targeted region repair
- **Background removal**: Transparent PNG background removal
- **Style presets**: neo-brutalist, duval-software-infographic, fractal-arcade, clean-tech-infographic

## Tools

| Tool | Description |
|------|-------------|
| `generate_image` | Text-to-image generation (single image) |
| `generate_images` | Parallel batch generation (1-8 images) |
| `generate_video` | Text-to-video via Veo 3 with audio (5s or 8s) |
| `edit_image` | Edit an existing image with natural language instructions |
| `fix_image` | Grid-based tile repair for garbled text (2x2, 3x3, etc.) |
| `fix_region` | Targeted region repair with automatic aspect ratio snapping |
| `interactive_fix` | Browser-based crop UI with multi-shot selection |
| `list_images` | List generated images and videos |
| `save_image` | Import an external image into the workspace |
| `remove_background` | Remove image background (alpha channel transparency) |

## Supported Models

| Model | Provider | Resolution | Best for |
|-------|----------|-----------|----------|
| `gemini-3.1-flash-image` | Google | 512 / 1K / 2K / 4K | General image generation, photo-realistic scenes |
| `gemini-2.5-flash-image` | Google | 1K max (free tier) | Quick drafts, prototyping |
| `gpt-image-2` | OpenAI | Flexible (up to 4K) | Text-heavy images, infographics, diagrams, typography |
| `gpt-image-1` | OpenAI | 3 fixed sizes | Legacy support |
| `grok-imagine` | xAI | Fixed (~1K per ratio) | Fast iteration, lowest cost |

## Configuration

### Required Environment Variables

At least one API key is required:

- `GEMINI_API_KEY` - Google Gemini API key (get from https://aistudio.google.com/apikey)
- `OPENAI_API_KEY` - OpenAI API key
- `XAI_API_KEY` - xAI API key

### Optional Environment Variables

- `DEFAULT_IMAGE_MODEL` - Default model (gemini-3.1-flash-image, gemini-2.5-flash-image, gpt-image-2, gpt-image-1, grok-imagine)
- `WORKSPACE_DIR` - Directory for generated images/videos (defaults to ./pixel-surgeon-workspace)

## Usage

### Docker Compose

```bash
cd flakes/pixel-surgeon-mcp
GEMINI_API_KEY=your_key docker compose up
```

### Direct Docker

```bash
docker build -t pixel-surgeon-mcp .
docker run -i -e GEMINI_API_KEY=your_key pixel-surgeon-mcp
```

## Use Cases

1. **Content Creation**: Generate marketing visuals, social media graphics, and promotional materials
2. **Infographics & Diagrams**: Use GPT Image 2 for text-heavy technical diagrams
3. **Video Prototyping**: Quick 5-8 second video generation for concepts
4. **Photo Editing**: Natural language image editing and background removal
5. **Text Repair**: Fix garbled text in generated images with grid-based repair

## Special Dependencies

None - pure Node.js server with API-based generation.

## License

MIT - See [ATTRIBUTION.md](./ATTRIBUTION.md) for full license text.
