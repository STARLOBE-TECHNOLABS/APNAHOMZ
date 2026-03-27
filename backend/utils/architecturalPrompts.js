/**
 * Architectural-Specific Prompt Templates for FLUX AI
 * 
 * This module provides specialized prompt templates optimized for 
 * architectural interior design with precise layout preservation.
 */

// Camera position templates for different architectural scenarios
const CAMERA_POSITIONS = {
  insider: {
    description: "First-person interior view from inside the room",
    prompt: "Professional interior architectural photograph captured from eye-level perspective inside the room. Camera positioned centrally, looking toward the main focal wall with comprehensive room view.",
    lens: "Wide-angle lens (24mm equivalent)",
    lighting: "Natural lighting with architectural lighting fixtures"
  },
  perspective: {
    description: "Elevated 3D perspective view of the space",
    prompt: "Professional 3D architectural visualization with elevated angled perspective view showing complete room layout and spatial relationships.",
    lens: "Standard lens (50mm equivalent)",
    lighting: "Balanced architectural lighting with natural and artificial sources"
  },
  overhead: {
    description: "Bird's eye view from above",
    prompt: "Architectural floor plan visualization from overhead perspective showing complete spatial layout and room relationships.",
    lens: "Telephoto lens compression",
    lighting: "Even overhead lighting for clear spatial definition"
  }
};

// Material quality descriptors for different price points
const MATERIAL_QUALITY = {
  budget: {
    flooring: "standard laminate or vinyl flooring",
    walls: "painted drywall with basic finishes",
    fixtures: "economy grade fixtures and hardware",
    furniture: "affordable furniture with practical design"
  },
  mid: {
    flooring: "quality hardwood, tile, or premium laminate",
    walls: "textured paint, wallpaper accents, or wainscoting",
    fixtures: "mid-range fixtures with contemporary styling",
    furniture: "well-designed furniture with good craftsmanship"
  },
  luxury: {
    flooring: "premium hardwood, natural stone, or custom carpet",
    walls: "designer paint finishes, custom millwork, or decorative panels",
    fixtures: "high-end designer fixtures and premium hardware",
    furniture: "custom or designer furniture with exceptional craftsmanship"
  }
};

// Lighting scenario templates
const LIGHTING_SCENARIOS = {
  natural: {
    description: "Daylight-focused illumination",
    prompt: "Abundant natural light streaming through large windows, creating bright, airy atmosphere with soft shadows and warm daylight tones"
  },
  mixed: {
    description: "Balanced natural and artificial lighting",
    prompt: "Harmonious blend of natural daylight and carefully designed artificial lighting, creating balanced illumination with layered lighting approach"
  },
  dramatic: {
    description: "Statement lighting and mood creation",
    prompt: "Dramatic lighting design with statement fixtures, creating mood and atmosphere through strategic light placement and shadow play"
  },
  task: {
    description: "Functional task-oriented lighting",
    prompt: "Purpose-driven lighting design focused on functionality, with adequate illumination for specific activities and tasks throughout the space"
  }
};

/**
 * Generate architectural-specific prompt with precise measurements and layout instructions
 * @param {Object} roomData - Detailed room information including dimensions and furniture
 * @param {string} style - Design style
 * @param {string} quality - Material quality level (budget/mid/luxury)
 * @param {string} lighting - Lighting scenario
 * @param {string} viewType - Camera perspective type
 * @returns {string} Optimized architectural prompt
 */
function generateArchitecturalPrompt(roomData, style, quality = 'mid', lighting = 'mixed', viewType = 'insider') {
  const camera = CAMERA_POSITIONS[viewType] || CAMERA_POSITIONS.insider;
  const materials = MATERIAL_QUALITY[quality] || MATERIAL_QUALITY.mid;
  const lightScenario = LIGHTING_SCENARIOS[lighting] || LIGHTING_SCENARIOS.mixed;

  // Extract room dimensions and furniture — with safe fallbacks
  const { dimensions = {}, items = [], name } = roomData;
  const widthFt = dimensions.widthFt || Math.round((dimensions.width || 0) / 30.48) || '?';
  const heightFt = dimensions.heightFt || Math.round((dimensions.height || 0) / 30.48) || '?';
  const areaSqFt = dimensions.areaSqFt || Math.round(((dimensions.width || 0) * (dimensions.height || 0)) / 929) || '?';
  const furnitureList = items.map(item => item.type).join(', ') || 'essential furniture';

  // For insider/FPS view, produce a highly specific photorealism prompt that matches
  // professional architectural visualization quality (like user's reference image).
  if (viewType === 'insider') {
    // Style = aesthetic only (materials, colors). Layout and positions must stay identical.
    return `Photorealistic eye-level interior. Apply ${style} style only to materials and colors of existing items — do not change layout or placement. ${name || 'Bedroom'} with only: ${furnitureList}. Real ${materials.flooring} floor, smooth walls, clean ceiling. Genuine wood, fabric, metal. Warm natural lighting. Professional 4K. Follow depth structure exactly. Do not add, remove, or move any furniture.`;
  }

  return `PROFESSIONAL ARCHITECTURAL INTERIOR RENDER
  
SPACE SPECIFICATIONS:
- Room type: ${name || 'interior space'}
- Exact dimensions: ${widthFt}' x ${heightFt}' (${areaSqFt} sq ft)
- Ceiling height: 9 feet standard residential ceiling
- Layout: Precise architectural floor plan with measured wall positions
- Furniture arrangement: ${furnitureList} positioned according to architectural plan

CAMERA AND VIEWPOINT:
${camera.prompt}
Lens: ${camera.lens}
Perspective: Architecturally accurate viewpoint maintaining proper proportions

DESIGN STYLE AND AESTHETICS (apply style to materials and colors only — layout and positions must not change):
${style} — use only for surfaces and finishes: ${materials.flooring} flooring, ${materials.walls} walls, ${materials.fixtures}, ${materials.furniture}. Do not rearrange or redesign the space.

LIGHTING DESIGN:
${lightScenario.prompt}
Lighting quality: Professional architectural lighting with proper exposure and color temperature

TECHNICAL REQUIREMENTS:
- Photorealistic 4K resolution rendering
- Architectural visualization quality standards
- Accurate material representation and textures
- Proper shadows, reflections, and lighting physics
- Maintained spatial relationships and measurements
- Professional color grading and post-processing

QUALITY STANDARDS:
- Interior design magazine publication quality
- Architectural accuracy in all proportions
- Realistic material finishes and surface details
- Proper perspective and depth perception
- No distortion or unrealistic elements

CONSTRAINTS:
- STRICT GEOMETRY PRESERVATION: Keep all architectural walls exactly straight, rigid, and perfectly aligned
- Do NOT make walls elastic, curvy, or distorted
- Preserve exact layout, scale, and furniture positions — do not add or remove any items
- ONLY the furniture listed above — no extra chairs, tables, plants, or decorations
- Maintain structural and architectural integrity of space
- Accurate dimensional relationships without hallucinating new geometry
- Professional presentation quality`;
}

/**
 * Generate prompt for multiple connected rooms
 * @param {Array} rooms - Array of room data objects
 * @param {string} style - Overall design style
 * @param {Object} planMetadata - Overall floor plan metadata
 * @returns {string} Multi-room architectural prompt
 */
function generateMultiRoomPrompt(rooms, style, planMetadata) {
  const roomDescriptions = rooms.map(room => {
    const furniture = room.items ? room.items.map(item => item.type).join(', ') : 'no furniture';
    const dim = room.dimensions || {};
    const w = dim.widthFt || Math.round((dim.width || 0) / 30.48) || '?';
    const h = dim.heightFt || Math.round((dim.height || 0) / 30.48) || '?';
    return `${room.name}: ${w}' x ${h}' with ${furniture}`;
  }).join('; ');

  const totalArea = planMetadata.planDimensions?.areaSqFt || 0;

  return `COMPREHENSIVE ARCHITECTURAL FLOOR PLAN RENDER
  
PROJECT OVERVIEW:
- Total floor area: ${totalArea} square feet
- Connected spaces: ${rooms.length} rooms with architectural flow
- Layout: Coordinated multi-room design with proper circulation

ROOM SPECIFICATIONS:
${roomDescriptions}

OVERALL DESIGN APPROACH (style = look only; do not change layout):
${style} — apply only to materials, colors, and lighting. Unified material palette and lighting. Keep all spatial relationships, positions, and flow identical. Do not rearrange furniture or rooms.

TECHNICAL SPECIFICATIONS:
- Complete floor plan visualization
- Accurate room proportions and measurements
- STRICT GEOMETRY PRESERVATION: Keep all architectural walls exactly straight and rigid
- Do NOT make walls elastic, curvy, or distorted
- ONLY the furniture and elements specified per room — do not add extra items
- Professional architectural rendering quality
- 4K resolution with photorealistic detail
- Maintained layout integrity across all spaces`;
}

/**
 * Generate negative prompt specifically for architectural renders
 * @returns {string} Architectural-specific negative prompt
 */
function generateArchitecturalNegativePrompt() {
  return `blurry, low resolution, pixelated, grainy, noisy,
distorted proportions, warped perspective, incorrect measurements,
floating furniture, impossible architecture, structural impossibilities,
poor lighting, harsh shadows, overexposed, underexposed,
unrealistic materials, plastic-looking surfaces, cheap textures, 3D render look, cartoon render,
cluttered composition, messy arrangement, poor design,
watermark, logo, text overlay, signature,
cartoon, illustration, painting, drawing, sketch,
outdated design, dated fixtures, old-fashioned style,
incomplete construction, unfinished surfaces,
incorrect scale, disproportionate elements,
poor craftsmanship, amateur quality,
changed layout, moved walls, altered floor plan,
curved walls, elastic walls, bent walls, distorted geometry,
missing architectural elements, incomplete design,
bird's eye view, top-down view, overhead view, aerial view, floor plan view, isometric view, axonometric view, 3D perspective from above,
EXTRA FURNITURE NOT IN ORIGINAL PLAN,
ADDED CHAIRS, ADDED TABLES, ADDED SOFAS, ADDED BEDS,
UNWANTED DECORATIONS, EXTRA OBJECTS, CLUTTER,
RANDOM FURNITURE, UNRELATED ITEMS, HALLUCINATED OBJECTS,
FURNITURE COUNT MISMATCH, WRONG NUMBER OF ITEMS,
REARRANGED FURNITURE, MOVED ITEMS, DIFFERENT PLACEMENT,
STYLE REDESIGN THAT CHANGES LAYOUT, REDECORATED ROOM WITH NEW ARRANGEMENT`;
}

module.exports = {
  generateArchitecturalPrompt,
  generateMultiRoomPrompt,
  generateArchitecturalNegativePrompt,
  CAMERA_POSITIONS,
  MATERIAL_QUALITY,
  LIGHTING_SCENARIOS
};