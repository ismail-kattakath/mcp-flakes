# 🎨 Photopea MCP Server

![Photopea](https://img.shields.io/badge/Photopea-Web_Based-18A497)
![Tools](https://img.shields.io/badge/Tools-34-success)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)

AI-powered professional image editing through Photopea with **34 tools** for documents, layers, text, shapes, filters, effects, and export. Full Photoshop-like capabilities through natural language.

**Upstream**: [attalla1/photopea-mcp-server](https://github.com/attalla1/photopea-mcp-server)

## Features

- **34 Tools**: Complete Photopea integration for AI-driven image editing
- **Browser-based**: Uses Photopea web app (https://www.photopea.com) via WebSocket
- **Layer Management**: Create, edit, group, reorder layers
- **Text & Shapes**: Add and edit text layers, shapes (rectangles, ellipses)
- **Filters & Effects**: Gaussian blur, sharpen, adjustments (brightness, contrast, hue, saturation)
- **Export**: PNG, JPG, WebP, PSD, SVG export
- **Custom Fonts**: Load custom fonts from URLs

## Tools

### Document Tools (5)

| Tool | Description |
|------|-------------|
| `photopea_create_document` | Create a new document with specified dimensions |
| `photopea_open_file` | Open an image from URL or local file path |
| `photopea_get_document_info` | Get active document info (name, dimensions, resolution, color mode) |
| `photopea_resize_document` | Resize the active document (resamples content) |
| `photopea_close_document` | Close the active document |

### Layer Tools (11)

| Tool | Description |
|------|-------------|
| `photopea_add_layer` | Add a new empty art layer |
| `photopea_add_fill_layer` | Add a solid color fill layer |
| `photopea_delete_layer` | Delete a layer by name or index |
| `photopea_select_layer` | Make a layer active by name or index |
| `photopea_set_layer_properties` | Set opacity, blend mode, visibility, name, or lock state |
| `photopea_move_layer` | Translate a layer by x/y offset |
| `photopea_duplicate_layer` | Duplicate a layer with optional new name |
| `photopea_reorder_layer` | Move a layer in the stack (above, below, top, bottom) |
| `photopea_group_layers` | Group named layers into a layer group |
| `photopea_ungroup_layers` | Ungroup a layer group |
| `photopea_get_layers` | Get the full layer tree as JSON |

### Text & Shape Tools (3)

| Tool | Description |
|------|-------------|
| `photopea_add_text` | Add a text layer at specified coordinates |
| `photopea_edit_text` | Edit content or style of an existing text layer |
| `photopea_add_shape` | Add a shape (rectangle or ellipse) |

### Image & Effects Tools (9)

| Tool | Description |
|------|-------------|
| `photopea_place_image` | Place an image from URL or local path |
| `photopea_apply_adjustment` | Apply brightness/contrast, hue/saturation, levels, or curves |
| `photopea_apply_filter` | Apply gaussian blur, sharpen, unsharp mask, noise, or motion blur |
| `photopea_transform_layer` | Scale, rotate, or flip a layer |
| `photopea_add_gradient` | Apply a linear gradient fill |
| `photopea_make_selection` | Create a rectangular, elliptical, or full selection |
| `photopea_modify_selection` | Expand, contract, feather, or invert a selection |
| `photopea_fill_selection` | Fill the current selection with a color |
| `photopea_clear_selection` | Deselect the current selection |

### Export & Utility Tools (6)

| Tool | Description |
|------|-------------|
| `photopea_export_image` | Export to PNG, JPG, WebP, PSD, or SVG |
| `photopea_load_font` | Load a custom font from a URL (TTF, OTF, WOFF2) |
| `photopea_list_fonts` | List available fonts, with optional search filter |
| `photopea_run_script` | Execute arbitrary Photopea JavaScript |
| `photopea_undo` | Undo one or more actions |
| `photopea_redo` | Redo one or more actions |

## Configuration

### Environment Variables

None required.

### Special Requirements

- **Browser**: A modern web browser must be open at `http://localhost:3000` to access the Photopea web app
- **WebSocket**: The server communicates with Photopea via WebSocket connection
- **Localhost only**: Server binds to 127.0.0.1 for security

## Usage

### Docker Compose

```bash
cd flakes/photopea-mcp-server
docker compose up
```

Then open your browser to `http://localhost:3000` to access the Photopea interface.

### Direct Docker

```bash
docker build -t photopea-mcp-server .
docker run -i -p 3000:3000 photopea-mcp-server
```

## Use Cases

1. **Poster Design**: Create marketing posters with text, shapes, and images
2. **Photo Editing**: Apply filters, adjustments, and effects to photos
3. **Composite Images**: Layer multiple images with blend modes and opacity
4. **Batch Processing**: Automated image editing workflows via AI
5. **Text on Images**: Add text overlays with custom fonts and styling

## Example Workflows

**Create a poster:**
```
Create a 1920x1080 document with a dark blue background, add the title 'Hello World' in white 72px Arial, and export it as a PNG
```

**Edit a photo:**
```
Open ~/photos/portrait.jpg, increase the brightness by 30, apply a slight gaussian blur of 2px, and export as JPG
```

**Composite images:**
```
Create a 1200x630 document, place ~/assets/background.png as the base layer, then place ~/assets/logo.png and move it to the top-right corner
```

## Special Dependencies

- **Node.js** >= 18
- **Modern web browser** (Chrome, Firefox, Edge, Safari)
- **Photopea web app** accessed via localhost

## Important Notes

- Only one browser tab should be open at a time (WebSocket connection conflict)
- Refreshing the browser page will discard all unsaved work
- The `photopea_run_script` tool is marked as destructive and requires user approval
- Heavy scripts may cause UI unresponsiveness (operations complete in background)

## Quick Start

```bash
# 1. Start the server
cd flakes/photopea-mcp-server
docker compose up

# 2. Open browser to http://localhost:3000
# 3. AI can now control Photopea through MCP
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **Social Media Graphics** | "Create a 1080x1080 Instagram post with gradient background" |
| **Photo Editing** | "Open this photo, increase brightness by 20%, apply gaussian blur 5px" |
| **Poster Design** | "Create a poster with title, subtitle, and background image" |
| **Text Overlays** | "Add white text 'SALE' at the top center in 72px bold" |
| **Layer Compositing** | "Place logo.png, resize to 200x200, move to top-right" |
| **Batch Effects** | "Apply these filters to the current document" |

## Example Workflows

### Create Social Media Post

```javascript
// 1. Create document
photopea_create_document({
  width: 1080,
  height: 1080,
  name: "Instagram Post",
  backgroundColor: "#667eea"
})

// 2. Add gradient background
photopea_add_gradient({
  startColor: "#667eea",
  endColor: "#764ba2",
  angle: 45
})

// 3. Add title text
photopea_add_text({
  content: "Summer Sale",
  x: 540,
  y: 400,
  fontSize: 96,
  fontFamily: "Arial",
  color: "#ffffff",
  bold: true
})

// 4. Add subtitle
photopea_add_text({
  content: "Up to 50% Off",
  x: 540,
  y: 680,
  fontSize: 48,
  fontFamily: "Arial",
  color: "#ffffff"
})

// 5. Export
photopea_export_image({
  format: "PNG",
  quality: 100
})
```

### Edit Photo with Filters

```javascript
// 1. Open photo
photopea_open_file({
  path: "https://example.com/photo.jpg"
})

// 2. Adjust brightness/contrast
photopea_apply_adjustment({
  type: "brightness_contrast",
  brightness: 30,
  contrast: 20
})

// 3. Apply gaussian blur
photopea_apply_filter({
  type: "gaussian_blur",
  radius: 2
})

// 4. Export as JPG
photopea_export_image({
  format: "JPG",
  quality: 90
})
```

### Composite Multiple Images

```javascript
// 1. Create base document
photopea_create_document({
  width: 1920,
  height: 1080,
  name: "Composite"
})

// 2. Place background
photopea_place_image({
  url: "https://example.com/background.jpg"
})

// 3. Place logo
photopea_place_image({
  url: "https://example.com/logo.png"
})

// 4. Move logo to corner
photopea_move_layer({
  x: 1700,
  y: 100
})

// 5. Set logo opacity
photopea_set_layer_properties({
  opacity: 80
})
```

### Add Text with Custom Font

```javascript
// 1. Load custom font
photopea_load_font({
  url: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
})

// 2. Add text with custom font
photopea_add_text({
  content: "Modern Design",
  x: 960,
  y: 540,
  fontSize: 72,
  fontFamily: "Roboto",
  color: "#2d3748",
  bold: true
})
```

### Create Layered Design

```javascript
// 1. Create document
photopea_create_document({ width: 800, height: 600 })

// 2. Add background fill layer
photopea_add_fill_layer({
  name: "Background",
  color: "#f7fafc"
})

// 3. Add shape
photopea_add_shape({
  type: "rectangle",
  x: 100,
  y: 100,
  width: 600,
  height: 400,
  color: "#4299e1"
})

// 4. Add text on top
photopea_add_text({
  content: "Content",
  x: 400,
  y: 300,
  fontSize: 48,
  color: "#ffffff"
})

// 5. Group layers
photopea_group_layers({
  layerNames: ["Shape", "Text"],
  groupName: "Card"
})
```

## Advanced Features

### Layer Management

```javascript
// Get layer tree
layers = photopea_get_layers()

// Reorder layer
photopea_reorder_layer({
  layerName: "Logo",
  position: "top"
})

// Duplicate layer
photopea_duplicate_layer({
  layerName: "Background",
  newName: "Background Copy"
})

// Group layers
photopea_group_layers({
  layerNames: ["Layer1", "Layer2"],
  groupName: "MyGroup"
})
```

### Blend Modes

Available blend modes:
- Normal
- Multiply
- Screen
- Overlay
- Soft Light
- Hard Light
- Color Dodge
- Color Burn
- Darken
- Lighten

```javascript
photopea_set_layer_properties({
  blendMode: "multiply",
  opacity: 75
})
```

### Filters

Available filters:
- **gaussian_blur** - Blur effect
- **sharpen** - Enhance details
- **unsharp_mask** - Professional sharpening
- **noise** - Add grain
- **motion_blur** - Movement effect

```javascript
photopea_apply_filter({
  type: "unsharp_mask",
  amount: 80,
  radius: 1.5,
  threshold: 0
})
```

### Adjustments

Available adjustments:
- **brightness_contrast** - Brightness and contrast
- **hue_saturation** - Color adjustments
- **levels** - Tonal range
- **curves** - Advanced tonal control

```javascript
photopea_apply_adjustment({
  type: "hue_saturation",
  hue: 15,
  saturation: 25,
  lightness: 0
})
```

### Export Formats

| Format | Use Case | Quality |
|--------|----------|---------|
| **PNG** | Transparency, web graphics | Lossless |
| **JPG** | Photos, no transparency | Lossy (1-100) |
| **WebP** | Modern web format | Lossy/Lossless |
| **PSD** | Photoshop compatibility | Layers preserved |
| **SVG** | Vector graphics | Scalable |

## Selections

```javascript
// Make rectangular selection
photopea_make_selection({
  type: "rectangle",
  x: 100,
  y: 100,
  width: 500,
  height: 300
})

// Feather selection
photopea_modify_selection({
  operation: "feather",
  amount: 10
})

// Fill selection
photopea_fill_selection({
  color: "#ff6b6b"
})
```

## Transform Operations

```javascript
photopea_transform_layer({
  scaleX: 1.5,
  scaleY: 1.5,
  rotation: 45,
  flip: "horizontal"
})
```

## Undo/Redo

```javascript
// Undo last 3 actions
photopea_undo({ steps: 3 })

// Redo 2 actions
photopea_redo({ steps: 2 })
```

## Font Management

```javascript
// List all available fonts
fonts = photopea_list_fonts()

// Search for specific font
arial_fonts = photopea_list_fonts({ filter: "Arial" })

// Load custom font
photopea_load_font({
  url: "https://example.com/fonts/CustomFont.ttf"
})
```

## Browser Requirements

- **Modern browser** (Chrome, Firefox, Edge, Safari)
- **JavaScript enabled**
- **WebSocket support**
- **Access to localhost:3000**

## Important Notes

- ⚠️ **Single Tab**: Only one browser tab should access Photopea at a time
- 🔄 **No Auto-Save**: Refreshing browser discards unsaved work
- 🔒 **Destructive Tools**: `photopea_run_script` requires user approval
- 🐌 **Heavy Scripts**: Complex operations may cause temporary UI freeze

## Advanced: Custom Scripts

```javascript
// Execute custom Photopea script (requires approval)
photopea_run_script({
  script: `
    var doc = app.activeDocument;
    var layer = doc.activeLayer;
    layer.opacity = 50;
  `
})
```

## Related Flakes

- **pixel-surgeon-mcp** - AI image generation and editing
- **excalidraw-architect-mcp** - Architecture diagrams
- **unbrowser** - Web automation for image sources

## Tips

- **Fonts**: Load custom fonts before creating text layers
- **Layers**: Use meaningful names for easier layer management
- **Groups**: Group related layers for organization
- **Export**: Choose format based on use case (PNG for web, PSD for editing)
- **Blend Modes**: Experiment with blend modes for creative effects
- **Selections**: Use feathering for smooth edges
- **Undo**: Don't hesitate to undo and try different approaches

## License

MIT - See [ATTRIBUTION.md](./ATTRIBUTION.md) for full license text.
