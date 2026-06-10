# fal-mcp-server

Generate AI images, videos, and music using Fal.ai models (FLUX, Stable Diffusion, MusicGen) with 600+ models.

**Upstream**: [raveenb/fal-mcp-server](https://github.com/raveenb/fal-mcp-server)

## Features

- **600+ Models**: Dynamic model discovery from Fal.ai platform
- **Image Generation**: FLUX, Stable Diffusion, and more
- **Video Generation**: Text-to-video, image-to-video, video-to-video
- **Music Generation**: MusicGen for instrumental music and songs with vocals
- **Image Editing**: Background removal, upscaling (2x/4x), inpainting, resizing
- **Smart Tools**: Model recommendations, pricing info, usage tracking

## Tools

### Image Generation (3 tools)

| Tool | Description |
|------|-------------|
| `generate_image` | Create images from text prompts (Flux, SDXL, etc.) |
| `generate_image_structured` | Fine-grained control over composition, lighting, subjects |
| `generate_image_from_image` | Transform existing images with style transfer |

### Image Editing (6 tools)

| Tool | Description |
|------|-------------|
| `remove_background` | Remove backgrounds from images (transparent PNG) |
| `upscale_image` | Upscale images 2x or 4x while preserving quality |
| `edit_image` | Edit images using natural language instructions |
| `inpaint_image` | Edit specific regions using masks |
| `resize_image` | Smart resize for social media (Instagram, YouTube, TikTok, etc.) |
| `compose_images` | Overlay images (watermarks, logos) with precise positioning |

### Video Tools (3 tools)

| Tool | Description |
|------|-------------|
| `generate_video` | Text-to-video and image-to-video generation |
| `generate_video_from_image` | Animate images into videos |
| `generate_video_from_video` | Video restyling and motion transfer |

### Audio Tools (1 tool)

| Tool | Description |
|------|-------------|
| `generate_music` | Create instrumental music or songs with vocals |

### Utility Tools (5 tools)

| Tool | Description |
|------|-------------|
| `list_models` | Discover 600+ available models with smart filtering |
| `recommend_model` | AI-powered model recommendations for your task |
| `get_pricing` | Check costs before generating content |
| `get_usage` | View spending history and usage stats |
| `upload_file` | Upload local files for use with generation tools |

## Configuration

### Required Environment Variables

- `FAL_KEY` - Fal.ai API key (get from https://fal.ai) - **free tier available**

## Usage

### Docker Compose

```bash
cd flakes/fal-mcp-server
FAL_KEY=your_key docker compose up
```

### Direct Docker

```bash
docker build -t fal-mcp-server .
docker run -i -e FAL_KEY=your_key fal-mcp-server
```

## Use Cases

1. **Content Creation**: Generate high-quality images with FLUX and Stable Diffusion
2. **Video Production**: Create animated videos from text descriptions or images
3. **Music Composition**: Generate background music or songs with vocals
4. **E-commerce**: Remove backgrounds from product photos
5. **Social Media**: Smart resize images for Instagram, YouTube, TikTok
6. **Image Enhancement**: Upscale low-resolution images 2x or 4x

## Popular Models

- **FLUX**: State-of-the-art image generation
- **Stable Diffusion**: XL and other variants
- **MusicGen**: AI music generation
- **600+ more models** accessible via dynamic discovery

## Special Features

### Dynamic Model Discovery

Models are fetched dynamically from the Fal.ai API with TTL-based caching for optimal performance. Use full model IDs or friendly aliases.

### Smart Recommendations

The `recommend_model` tool provides AI-powered suggestions based on your task requirements.

### Cost Tracking

Check pricing before generation with `get_pricing` and monitor spending with `get_usage`.

## Special Dependencies

- **Python** 3.10 or higher
- **Pillow** for image processing
- **httpx** for HTTP requests

## License

MIT - See [ATTRIBUTION.md](./ATTRIBUTION.md) for full license text.
