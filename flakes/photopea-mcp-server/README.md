# photopea-mcp-server

AI-powered image editing through Photopea with 34 tools for documents, layers, text, shapes, filters, effects, and export.

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

## License

MIT - See [ATTRIBUTION.md](./ATTRIBUTION.md) for full license text.
