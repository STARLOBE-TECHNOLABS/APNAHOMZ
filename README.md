# FloorLite Demo - 2D to 3D Floor Plan Visualization with AI Enhancement

## Overview

FloorLite Demo is a web-based floor planning application that allows users to create 2D floor plans and instantly visualize them in 3D. The application features AI-powered interior design enhancement using diffusion models with ControlNet for precise layout preservation.

## 2D to 3D Conversion Process

### Architecture

The 2D to 3D conversion is handled by the **FloorPlan3DViewer** component using **React Three Fiber** (R3F) and **Three.js**:

```
2D Floor Plan Data (SVG Coordinates)
    ↓
FloorPlan3DViewer.jsx (React Three Fiber)
    ↓
Three.js Scene with:
  - Walls (ComplexWall component with CSG for openings)
  - Furniture (Procedural 3D models)
  - Floor (InstancedMesh for wood planks)
  - Lighting & Shadows
    ↓
Interactive 3D Visualization
```

### Coordinate System Conversion

**Scale Factor:** `SCALE = 0.02` (Global conversion factor)

The conversion from 2D SVG coordinates to 3D world units:

```javascript
// 2D to 3D coordinate transformation
const x1 = start.x * SCALE;  // X becomes X in 3D
const y1 = start.y * SCALE;  // Y becomes Z in 3D (depth)
// Height (Y in 3D) is determined by wall height (2.5m default)
```

**Example:**
- 2D Wall: from (100, 100) to (300, 100) pixels
- 3D Wall: from (2, 0, 2) to (6, 0, 2) meters

### Wall Generation with Openings

Walls are created using **CSG (Constructive Solid Geometry)** to handle door/window openings:

1. **Base Wall:** Extruded box from wall segment coordinates
2. **Opening Detection:** Doors/windows within 25px of wall centerline are snapped
3. **CSG Subtraction:** Openings are subtracted from the wall geometry
4. **Dynamic Rotation:** Items align parallel to their host wall

```javascript
// Wall alignment logic
const projected = projectPointToSegment(itemCenterX, itemCenterY, 
                                        wall.x1, wall.y1, wall.x2, wall.y2);
const wallAngle = -Math.atan2(dy, dx); // Align to wall direction
```

### Furniture 3D Models

All furniture is procedurally generated using Three.js primitives:

- **Sofas, Beds, Chairs:** RoundedBox geometries with fabric materials
- **Tables:** Wood materials with cylindrical legs
- **Appliances:** Standard materials with glass accents
- **Doors/Windows:** Special handling with frame geometries

**Materials:**
- Fabric: `roughness: 0.8` for soft appearance
- Wood: `roughness: 0.6, metalness: 0.1`
- Glass: `transmission: 0.6, opacity: 0.4`

### Rendering Pipeline

1. **Scene Setup:**
   - Ambient light (intensity: 0.3)
   - Directional light with shadows
   - Environment preset: "apartment"

2. **Post-Processing:**
   - Bloom for light effects
   - SSAO for ambient occlusion
   - Contact shadows for grounding

3. **Camera Views:**
   - `perspective`: 3D angled view (default)
   - `top`: Bird's eye view
   - `side`: Side elevation
   - `front`: Front elevation
   - `insider`: First-person walkthrough (FPS controls)

## AI Enhancement - Diffusion Methods

### Overview

The AI enhancement uses **FLUX** diffusion model via **RunPod API** with **ControlNet Depth** for precise layout preservation.

### Diffusion Pipeline

```
3D Render (Color Image)
    ↓
Depth Map Generation (Three.js MeshDepthMaterial)
    ↓
ControlNet Depth Conditioning
    ↓
FLUX img2img + ControlNet
    ↓
Photorealistic Interior Render
```

### ControlNet Depth - Layout Preservation

**Purpose:** Maintain exact furniture positions and spatial relationships

**How it works:**
1. **Depth Map Capture:** Renders the 3D scene using `MeshDepthMaterial` with `RGBADepthPacking`
2. **ControlNet Conditioning:** Depth map guides the diffusion model's spatial understanding
3. **High Conditioning Scale:** `controlnet_scale: 0.9-0.95` for strict layout adherence

**API Parameters:**
```javascript
{
  prompt: "Professional interior architectural photograph...",
  image: base64ColorImage,        // 3D render as reference
  control_image: base64DepthMap,  // Depth for layout guidance
  controlnet: 'depth',
  controlnet_scale: 0.95,         // Strong depth influence
  strength: 0.7,                  // Balance preservation vs generation
  steps: 40,                      // Higher for insider view
  guidance: 5.0                   // Higher for prompt adherence
}
```

### Prompt Engineering for Layout Preservation

**Strict Constraints in Prompts:**
```
CRITICAL LAYOUT CONSTRAINTS - ABSOLUTE PRECISION REQUIRED:
- ALL {N} furniture items listed below MUST be rendered in EXACT positions
- ZERO tolerance for furniture relocation or repositioning
- Furniture coordinates MUST match the depth map spatial layout exactly
- Wall positions MUST correspond to depth map boundaries
- NO additional furniture may be added beyond the {N} specified items
```

**Furniture Inventory Format:**
```
FURNITURE INVENTORY - EXACT PLACEMENT REQUIRED:
1. sofa: at (450,320), size 200x80, rotation 0°
2. coffeeTable: at (450,420), size 120x60, rotation 0°
3. tvStand: at (450,180), size 180x40, rotation 0°
```

### View Types & AI Processing

| View Type | Camera Position | AI Method | ControlNet Strength |
|-----------|----------------|-----------|---------------------|
| `insider` | Eye-level (1.7m) | img2img + ControlNet | 0.95 (very strict) |
| `perspective` | Elevated angle | img2img + ControlNet | 0.90 (strict) |

### Backend Services

**aiRenderService.js** handles:
- `generateInteriorRender()`: Main rendering with ControlNet
- `generateInteriorFromText()`: Text-only generation (fallback)
- `generateAllRoomRenders()`: Batch generation for all rooms

**API Endpoints:**
- `POST /api/ai/enhance-interior`: Main enhancement endpoint
- `POST /api/ai/generate-from-text`: Text-only generation
- `POST /api/ai/generate-all-rooms`: Batch room rendering

### Segmentation Map (Optional)

Additional control map for material/semantic guidance:
- Walls: White (#FFFFFF)
- Floor: Gray (#808080)
- Furniture: Blue (#0000FF)
- Ceiling: Black (#000000)

## Technology Stack

### Frontend
- **React 18** with Vite
- **React Three Fiber** (@react-three/fiber) - React renderer for Three.js
- **React Three Drei** (@react-three/drei) - Helper components
- **Three.js** - 3D graphics library
- **Tailwind CSS** - Styling

### Backend
- **Node.js** with Express
- **AI Services:**
  - RunPod API with FLUX model
  - ControlNet Depth conditioning
  - Replicate API (fallback)

### 3D Rendering
- **WebGL** via Three.js
- **Post-processing:** EffectComposer (Bloom, SSAO)
- **Shadows:** PCFSoftShadowMap

## Key Files

### 2D to 3D Conversion
- `src/components/FloorPlan3D/FloorPlan3DViewer.jsx` - Main 3D viewer
- `src/components/FloorPlan3D/Wall.jsx` - Wall generation with CSG
- `src/components/FloorPlan3D/furnitureModels.jsx` - 3D furniture models

### AI Enhancement
- `src/components/FloorPlan3D/AIEnhanceButton.jsx` - UI for AI enhancement
- `src/components/FloorPlan3D/AIRenderCapture.jsx` - Depth/segmentation capture
- `backend/services/aiRenderService.js` - AI rendering service
- `backend/utils/promptGenerator.js` - Prompt generation
- `backend/utils/architecturalPrompts.js` - Architectural prompt templates

### API Routes
- `backend/routes/aiRoutes.js` - AI-related API endpoints

## Usage

### Basic 2D to 3D
1. Create floor plan in 2D editor
2. Add walls and furniture
3. Click "View 3D" button
4. Navigate with mouse (orbit) or WASD (FPS mode)

### AI Enhancement
1. In 3D view, click "AI Enhance" button
2. Select interior style (Modern, Luxury, Scandinavian, etc.)
3. Choose camera view (Inside Room or 3D Perspective)
4. Optionally select specific room area
5. AI generates photorealistic interior while preserving layout

## Configuration

### Environment Variables
```bash
# Backend (.env)
RUNPOD_URL=https://your-runpod-endpoint.runpod.net/generate
REPLICATE_API_TOKEN=your_token_here
```

### AI Parameters
Adjust in `aiRenderService.js`:
- `controlnetScale`: 0.0-1.0 (higher = stricter layout preservation)
- `strength`: 0.0-1.0 (lower = more original structure preserved)
- `steps`: 30-50 (higher = better quality)
- `guidance`: 3.5-7.0 (higher = stricter prompt adherence)
