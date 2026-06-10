# 🎨 Pixel Surgeon MCP

![Gemini](https://img.shields.io/badge/Gemini-4362EC?logo=google-gemini)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai)
![xAI](https://img.shields.io/badge/xAI-black?logo=x)
![Video](https://img.shields.io/badge/Video-Veo_3-red)

AI image and video generation, editing, and surgical region repair with multi-provider support. Generate up to 4K images, create 8-second videos with audio, and fix garbled regions with precision tools.

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

## Quick Start

```bash
# 1. Get API key (at least one required)
# Gemini: https://aistudio.google.com/apikey
# OpenAI: https://platform.openai.com/api-keys
# xAI: https://console.x.ai

# 2. Set environment variable
export GEMINI_API_KEY="your_key_here"

# 3. Run server
cd flakes/pixel-surgeon-mcp
docker compose up
```

## Provider Comparison

| Provider | Models | Max Res | Speed | Cost | Best For |
|----------|--------|---------|-------|------|----------|
| **Gemini** | 3.1-flash, 2.5-flash | 4K | Medium | Low | General purpose, photo-realistic |
| **OpenAI** | gpt-image-2, gpt-image-1 | 4K | Medium | Medium | Text-heavy, infographics, diagrams |
| **xAI** | grok-imagine | ~1K | Fast | Lowest | Quick iteration, drafts |

### Resolution Options

#### Gemini
- 512px - Ultra fast, thumbnails
- 1K - Fast, web images
- 2K - High quality, prints
- 4K - Maximum detail, large prints

#### OpenAI GPT Image 2
- Flexible dimensions up to 4K
- Custom aspect ratios
- Text rendering excellence

#### xAI Grok Imagine
- Fixed ~1K per aspect ratio
- Fastest generation
- Budget-friendly

## Example Workflows

### Create Marketing Visual

```javascript
// 1. Generate initial image
generate_image({
  prompt: "Modern tech startup office with diverse team collaborating, natural lighting, professional photography style",
  model: "gemini-3.1-flash-image",
  resolution: "2K",
  aspect_ratio: "16:9"
})

// 2. Edit for specific brand
edit_image({
  image_id: "img_001",
  instruction: "Change wall color to brand blue (#0066CC), add company logo on wall"
})

// 3. Remove background for overlay
remove_background({
  image_id: "img_001_edited"
})
```

### Generate Video Content

```javascript
// Create short video
generate_video({
  prompt: "Smooth camera pan across a futuristic city skyline at sunset, cinematic, 4K quality",
  duration: "8s",  // 5s or 8s
  include_audio: true,
  model: "veo-3"
})

// Returns: 8-second video with generated audio
```

### Fix Garbled Text

```javascript
// 1. Generate image with text
image = generate_image({
  prompt: "Tech conference poster with title 'AI Innovation Summit 2024', modern design",
  model: "gpt-image-2"  // Best for text
})

// 2. If text is garbled, use grid repair
fix_image({
  image_id: "img_002",
  grid_size: "3x3",  // Repair 9 tiles
  focus_region: "center",  // Where text is located
  prompt: "Clean, readable text"
})

// 3. Or targeted region repair
fix_region({
  image_id: "img_002",
  region: { x: 200, y: 100, width: 600, height: 200 },
  prompt: "Sharp, legible title text"
})
```

### Batch Generation

```javascript
// Generate multiple variations
generate_images({
  prompts: [
    "Product shot - minimalist white background",
    "Product shot - lifestyle setting",
    "Product shot - dramatic lighting",
    "Product shot - outdoor environment"
  ],
  model: "gemini-3.1-flash-image",
  resolution: "2K",
  count: 4  // 1-8 images in parallel
})
```

### Style Presets

```javascript
// Use built-in style
generate_image({
  prompt: "API architecture diagram",
  style: "clean-tech-infographic",
  model: "gpt-image-2"
})

// Available presets:
// - neo-brutalist
// - duval-software-infographic  
// - fractal-arcade
// - clean-tech-infographic
```

## Use Cases by Provider

### Gemini (General Purpose)
- Marketing materials
- Social media content
- Product photography
- Realistic scenes
- General illustrations

### OpenAI GPT Image 2 (Text & Diagrams)
- Technical diagrams
- Infographics with text
- Architecture diagrams
- Charts and graphs
- Educational materials
- Typography-heavy designs

### xAI Grok Imagine (Rapid Iteration)
- Quick concepts
- Storyboard frames
- Draft variations
- Thumbnail generation
- Rapid prototyping

## Workspace Organization

```
pixel-surgeon-workspace/
├── images/
│   ├── img_001.png
│   ├── img_001_edited.png
│   └── img_002_repaired.png
├── videos/
│   └── vid_001.mp4
└── metadata.json
```

List workspace contents:
```javascript
list_images()
// Returns: All generated images and videos with metadata
```

## Image Editing Features

### Natural Language Editing
```javascript
edit_image({
  image_id: "img_001",
  instruction: "Make the sky more dramatic with storm clouds, increase contrast"
})
```

### Background Removal
```javascript
remove_background({ image_id: "img_001" })
// Returns: PNG with alpha channel transparency
```

### Grid-Based Repair
```javascript
fix_image({
  image_id: "img_001",
  grid_size: "2x2",  // 2x2, 3x3, 4x4
  prompt: "High quality, sharp details"
})
```

### Targeted Region Repair
```javascript
fix_region({
  image_id: "img_001",
  region: { x: 0, y: 0, width: 512, height: 512 },
  auto_snap: true,  // Snap to aspect ratio
  prompt: "Clear, professional"
})
```

### Interactive Crop UI
```javascript
interactive_fix({
  image_id: "img_001"
})
// Opens browser-based crop UI for multi-shot selection
```

## Video Generation

### Veo 3 Features
- **Durations**: 5 seconds or 8 seconds
- **Audio**: Optional generated soundtrack
- **Quality**: Up to 4K output
- **Style**: Cinematic, professional
- **Prompts**: Natural language descriptions

### Best Practices
- Be specific about camera movement
- Describe lighting and atmosphere
- Mention quality level (4K, cinematic)
- Keep prompts under 200 words
- Use 8s for more complex scenes

## API Keys

### Gemini (Free Tier)
- 1,500 requests/day (free)
- 2.5-flash limited to 1K on free tier
- 3.1-flash supports up to 4K

### OpenAI
- Pay-per-use
- GPT-4 Vision pricing
- High quality text rendering

### xAI
- Competitive pricing
- Fastest generation
- Good for iteration

## Tips

- **For text**: Use OpenAI GPT Image 2
- **For photos**: Use Gemini 3.1-flash at 2K or 4K
- **For speed**: Use xAI Grok Imagine
- **For videos**: Veo 3 with 8s duration and audio
- **Fix text**: Grid repair with 3x3, then region repair
- **Batch work**: Use generate_images for variations
- **Remove background**: Before compositing or overlays

## Related Flakes

- **excalidraw-architect-mcp** - Architecture diagrams
- **gradusnotation** - Music notation graphics
- **memory** - Track generated assets and variations

## License

MIT - See [ATTRIBUTION.md](./ATTRIBUTION.md) for full license text.
