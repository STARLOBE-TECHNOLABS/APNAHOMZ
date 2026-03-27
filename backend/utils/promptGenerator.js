/**
 * Prompt Generator - Creates structured prompts for AI interior rendering
 * 
 * This utility converts floor plan data into detailed, room-specific prompts
 * that guide the AI to generate photorealistic interiors while maintaining
 * the exact layout and furniture positions.
 */

const { analyzeFloorPlan, getRoomDescription, getRoomTypeForItem } = require('./roomDetector');
const { generateArchitecturalPrompt, generateMultiRoomPrompt, generateArchitecturalNegativePrompt } = require('./architecturalPrompts');

// ── Photorealism Directives ──────────────────────────────────────────
const PHOTOREALISM_PREFIX = `REAL interior photograph. NOT a 3D render. NOT CGI. NOT a video game. 
Architectural photography: Canon EOS R5, 24mm tilt-shift lens, f/8, ISO 640.
The reference geometry guides layout ONLY — completely replace all surfaces with photographic materials.`;

const DESTROY_3D_DIRECTIVE = `CRITICAL MATERIAL REPLACEMENT — override all render surfaces:
Walls: micro-texture plaster with paint sheen variation, not flat drywall.
Floor: real wood with grain variation, knots, uneven finish sheen, darker between boards.
Furniture: fabric shows fiber weave, leather shows pore texture and seat creasing, wood legs show grain.
Ceiling: slight warm cast, roller texture, shadow gradient from corners.
Plants: real leaves with vein detail, translucency, natural imperfection — NOT geometric shapes.`;

const LIGHTING_DIRECTIVE = `PHOTOGRAPHIC LIGHTING — no uniform illumination:
Strong directional light with falloff. Corners 40-60% darker than center.
Furniture casts soft-edge shadows on floor. Window creates overexposed bloom.
Warm practical light creates golden pool, not even spread. Every zone lit differently.`;


// Style-specific prompt enhancements
const STYLE_ENHANCEMENTS = {
  modern: {
    materials: 'sleek materials, glass, polished concrete, brushed metal accents',
    lighting: 'recessed LED lighting, pendant lights, natural light',
    colors: 'neutral palette with black, white, and gray tones',
    furniture: 'minimalist furniture with clean geometric shapes',
  },

  luxury: {
    materials: 'marble floors, velvet upholstery, gold and brass accents, crystal',
    lighting: 'chandeliers, ambient lighting, warm golden tones',
    colors: 'rich jewel tones, cream, gold accents',
    furniture: 'clean lines designer furniture, plush seating with defined shapes',
  },

  minimalist: {
    materials: 'natural wood, white walls, simple textiles',
    lighting: 'soft natural light, simple fixtures',
    colors: 'white, beige, light gray, natural wood tones',
    furniture: 'clean lines, minimalist furniture with clean geometric shapes',
  },

  scandinavian: {
    materials: 'light oak wood, wool textiles, linen, sheepskin',
    lighting: 'soft ambient light, candles, large windows',
    colors: 'white walls, light wood, muted pastels, grey accents',
    furniture: 'clean lines functional Nordic design, natural materials',
  },

  industrial: {
    materials: 'exposed brick, concrete, weathered wood, metal pipes',
    lighting: 'Edison bulbs, metal pendant lights, large windows',
    colors: 'neutral grays, browns, black, rust accents',
    furniture: 'vintage clean lines furniture, leather, metal, reclaimed wood',
  },

  contemporary: {
    materials: 'mixed materials, glass, steel, innovative surfaces',
    lighting: 'statement lighting, track lights, artistic fixtures',
    colors: 'bold accent colors, neutral base, high contrast',
    furniture: 'modern clean lines sculptural pieces, artistic decor',
  },

  traditional: {
    materials: 'rich hardwood, silk, brocade, carved wood details',
    lighting: 'classic chandeliers, table lamps, warm lighting',
    colors: 'deep reds, golds, greens, warm neutrals',
    furniture: 'symmetrical classic furniture with clean lines',
  },

  bohemian: {
    materials: 'natural fibers, rattan, macrame, vintage textiles',
    lighting: 'fairy lights, lanterns, natural light',
    colors: 'vibrant colors, jewel tones, earthy hues, patterns',
    furniture: 'eclectic mix of clean lines furniture, floor cushions, plants',
  },
};

// Furniture-specific descriptions for better AI understanding
// Covers ALL types registered in FloorPlanItems/index.js
const FURNITURE_DESCRIPTIONS = {
  // ── Beds ────────────────────────────────────────────────────────
  bad: 'double bed with comfortable bedding',
  singleBad: 'single bed with simple bedding',
  kingBed: 'king/queen bed with luxurious bedding',
  guestDoubleBed: 'double guest bed with comfortable bedding',
  guestSingleBed: 'single guest bed',
  bunkBed: 'bunk bed with ladder',

  // ── Bedroom Storage ─────────────────────────────────────────────
  wordrobe: 'wardrobe with swing doors',
  wardrobeSliding: 'sliding door wardrobe',
  wardrobeHinged: 'hinged door wardrobe',
  walkInCloset: 'walk-in closet unit',
  guestWardrobe: 'wardrobe',
  dresser: 'dresser with mirror',
  chestOfDrawers: 'chest of drawers',
  vanityTable: 'vanity dressing table with mirror',
  headboard: 'upholstered headboard',

  // ── Bedroom Accessories ─────────────────────────────────────────
  bedsideTable: 'bedside table',
  guestBedsideTable: 'bedside table',
  accentChair: 'accent chair',
  luggageRack: 'luggage rack',
  wallMirror: 'wall-mounted mirror',

  // ── Sofas & Seating ─────────────────────────────────────────────
  sofa: 'three-seater sofa',
  lShapeSofa: 'L-shaped sectional sofa',
  armchair: 'comfortable armchair',
  reclinerChair: 'recliner chair',
  ottoman: 'upholstered ottoman',
  beanBag: 'bean bag chair',

  // ── Living Room Tables ──────────────────────────────────────────
  coffeeTable: 'coffee table',
  sideTable: 'side table',
  table: 'dining/multi-purpose table',
  table2: 'compact table',
  roundTable: 'round dining table',

  // ── TV & Entertainment ──────────────────────────────────────────
  tv: 'flat-screen television',

  // ── Storage / Shelving ──────────────────────────────────────────
  bookshelf: 'bookshelf',
  cabinet: 'storage cabinet',
  rug: 'area rug',
  lamp: 'floor lamp',
  curtains: 'window curtains',

  // ── Kitchen ─────────────────────────────────────────────────────
  worktop: 'kitchen worktop counter',
  stove: 'stove / hob',
  sink: 'kitchen sink',
  refrigerator: 'refrigerator',
  baseCabinet: 'base kitchen cabinet',
  wallCabinet: 'wall-mounted kitchen cabinet',
  tallPantryUnit: 'tall pantry storage unit',
  kitchenIsland: 'kitchen island',
  breakfastCounter: 'breakfast bar counter',
  barStool: 'bar stool',
  spiceRack: 'spice rack',
  pullOutBasket: 'pull-out storage basket',
  plateRack: 'plate rack',

  // ── Dining ──────────────────────────────────────────────────────
  // (covered by table / roundTable above)

  // ── Bathroom ────────────────────────────────────────────────────
  bath: 'bathtub',
  toilet: 'toilet',
  showerEnclosure: 'shower enclosure',
  mirrorCabinet: 'mirrored bathroom cabinet',
  towelRack: 'towel rack',
  medicineCabinet: 'medicine cabinet',
  laundryBasket: 'laundry basket',
  washingMachine: 'washing machine',
  washingMachineBase: 'washing machine on base',

  // ── Office & Study ───────────────────────────────────────────────
  officeDesk: 'office desk',
  executiveDesk: 'executive desk',
  studyDesk: 'study desk',
  studyTable: 'study table',
  studyTableOffice: 'office study table',
  ergonomicChair: 'ergonomic office chair',
  visitorChair: 'visitor chair',
  studyChair: 'study chair',
  filingCabinet: 'filing cabinet',
  wallShelves: 'wall-mounted shelves',
  deskLamp: 'desk lamp',
  whiteboard: 'whiteboard',
  desktopLaptop: 'desktop computer / laptop setup',
  pinBoard: 'pin board / cork board',

  // ── Entryway ─────────────────────────────────────────────────────
  consoleTable: 'console table',
  shoeRack: 'shoe rack',
  shoeCabinet: 'shoe cabinet',
  entrywayBench: 'entryway bench',
  coatRack: 'coat rack',
  umbrellaStand: 'umbrella stand',
  wallHook: 'wall hook / key holder',

  // ── Laundry / Utility ────────────────────────────────────────────
  dryerStand: 'clothes dryer stand',
  ironingBoardCabinet: 'ironing board cabinet',
  utilitySink: 'utility / laundry sink',
  storageRack: 'open storage rack',

  // ── Outdoor ──────────────────────────────────────────────────────
  outdoorChair: 'outdoor garden chair',
  outdoorSofa: 'outdoor sofa',
  swingChair: 'hanging swing chair',
  planter: 'indoor/outdoor planter',
  storageBench: 'outdoor storage bench',
  barbecueStation: 'barbecue / grill station',

  // ── Garage / Workshop ────────────────────────────────────────────
  toolCabinet: 'tool storage cabinet',
  workbench: 'workbench',
  bicycleStand: 'bicycle stand',

  // ── Kids ─────────────────────────────────────────────────────────
  toyStorage: 'toy storage unit',
  toyStorageUnit: 'toy storage unit',

  // ── Decor / Misc ─────────────────────────────────────────────────
  flower: 'decorative potted plant',
  flower2: 'decorative potted plant',
  headboard: 'bed headboard',
};

// Room-specific context for better prompts
const ROOM_CONTEXT = {
  bedroom: {
    atmosphere: 'peaceful and relaxing atmosphere',
    elements: 'bed as focal point, bedside tables, soft lighting',
    decor: 'minimal decor, comfortable bedding, perhaps artwork above bed',
  },
  living: {
    atmosphere: 'welcoming and comfortable atmosphere',
    elements: 'seating area facing each other, coffee table as center',
    decor: 'throw pillows, rugs, wall art, plants',
  },
  kitchen: {
    atmosphere: 'functional and bright atmosphere',
    elements: 'work triangle, ample counter space, appliances integrated',
    decor: 'backsplash, pendant lights over island, bar stools',
  },
  dining: {
    atmosphere: 'elegant and social atmosphere',
    elements: 'dining table as centerpiece, comfortable seating',
    decor: 'centerpiece on table, perhaps a rug, wall art or mirror',
  },
  bathroom: {
    atmosphere: 'spa-like clean atmosphere',
    elements: 'fixtures properly spaced, vanity with mirror',
    decor: 'towels, plants, soap dispensers, framed art',
  },
  office: {
    atmosphere: 'productive and organized atmosphere',
    elements: 'desk facing wall or window, ergonomic chair, storage',
    decor: 'minimal distractions, perhaps plants, organized shelves',
  },
  entryway: {
    atmosphere: 'welcoming first impression',
    elements: 'coat rack or hooks, shoe storage, console table, mirror',
    decor: 'decorative mirror, small plant, tray for keys',
  },
  laundry: {
    atmosphere: 'clean and functional utility space',
    elements: 'washer/dryer side by side, folding counter, storage shelves',
    decor: 'organized shelving, laundry baskets, utility sink',
  },
  outdoor: {
    atmosphere: 'relaxing al fresco living space',
    elements: 'outdoor seating, planters, weather-resistant furniture',
    decor: 'string lights, potted plants, outdoor rug, cushions',
  },
  garage: {
    atmosphere: 'organized workshop and storage space',
    elements: 'workbench along wall, tool storage, vehicle space',
    decor: 'pegboard tool organizer, shelving units, adequate lighting',
  },
};

/**
 * Get furniture description for AI prompt
 */
function getFurnitureDescription(itemType) {
  return FURNITURE_DESCRIPTIONS[itemType] || itemType;
}

/**
 * Generate a description of all furniture in the room
 */
function generateFurnitureDescription(items) {
  if (!items || items.length === 0) return 'empty room';

  const descriptions = items.map(item => {
    const desc = getFurnitureDescription(item.type);
    const position = item.rotation ? `rotated ${Math.round(item.rotation)} degrees` : '';
    return position ? `${desc} (${position})` : desc;
  });

  if (descriptions.length === 1) {
    return descriptions[0];
  }

  const last = descriptions.pop();
  return descriptions.join(', ') + ' and ' + last;
}

/**
 * Generate room-specific prompt section
 */
function generateRoomPrompt(room, style) {
  const roomType = room.type;
  const context = ROOM_CONTEXT[roomType] || ROOM_CONTEXT.living;
  const styleEnhancement = STYLE_ENHANCEMENTS[style] || STYLE_ENHANCEMENTS.modern;

  const furniture = generateFurnitureDescription(room.items);

  return `
${roomType.charAt(0).toUpperCase() + roomType.slice(1)} with ${furniture}.
${context.atmosphere}.
Key elements: ${context.elements}.
Materials: ${styleEnhancement.materials}.
Lighting: ${styleEnhancement.lighting}.
Color scheme: ${styleEnhancement.colors}.
Furniture style: ${styleEnhancement.furniture}.
Decor: ${context.decor}.
  `.trim();
}

/**
 * Generate the main prompt for AI interior rendering
 * @param {Object} plan - The floor plan data
 * @param {string} style - The interior style ID
 * @param {string} roomType - Optional specific room type to focus on
 * @param {string} viewType - Optional view type ('insider', 'perspective', etc.)
 * @param {string} styleId - Optional style identifier for enhancement lookup
 * @returns {Object} Object containing the main prompt and room-specific prompts
 */
function generateInteriorPrompt(plan, style = 'modern', roomType = null, viewType = 'perspective', styleId = null) {
  // Analyze the floor plan
  const rooms = analyzeFloorPlan(plan);

  // Get style enhancement early so we can use it for insider view too
  const styleEnhancement = STYLE_ENHANCEMENTS[styleId || style] || STYLE_ENHANCEMENTS.modern;

  // If viewType is insider, bypass all complex generation and use exact prompt
  // Now injected with the selected style to force the AI away from the "prototype" feel
  if (viewType === 'insider') {
    // Generate dynamic room descriptions to inject into the rigid prompt
    const roomDescriptions = rooms.map(room => {
      const itemsList = room.items.map(i => getFurnitureDescription(i.type)).join(', ');
      return `${room.type} containing: ${itemsList || 'empty space'}`;
    }).join('. ');

    return {
      mainPrompt: `${PHOTOREALISM_PREFIX}

${DESTROY_3D_DIRECTIVE}

${LIGHTING_DIRECTIVE}

Award-winning interior photography of a multi-million dollar luxury real estate listing. High-end Architectural Digest showcase. THIS IS CRITICAL: Preserve the exact room layout, spatial volume, and furniture placement perfectly. The selected INTERIOR STYLE (${style}) applies ONLY to materials, colors, and lighting — do NOT change layout, positions, or structure. 
      
INVENTORY OF EXPECTED FURNITURE (Apply ${style} styling to these exact items in the image; do not move or add anything):
${roomDescriptions}

Style: ${style} — use only for look: ${styleEnhancement.materials}. Lighting: ${styleEnhancement.lighting}. Colors: ${styleEnhancement.colors}. Furniture aesthetic: ${styleEnhancement.furniture}. Turn simple rectangular beds into plush designer beds with luxurious bedding, and basic boxes into elegant cabinets with realistic details. Replace all artificial 3D textures with incredibly highly detailed, photorealistic materials. Implement professional architectural lighting. 8k resolution, photorealistic ray-tracing, crisp focus. Do NOT add any new objects or clutter. Do NOT remove or relocate existing objects. Layout must stay identical — style improves only the look of the listed items.`,
      negativePrompt: `3D render, CGI, Blender, Unreal Engine, Unity, V-Ray, Corona, Octane, game engine, 
video game graphics, low poly, flat shading, uniform lighting, plastic texture, 
smooth featureless walls, perfect symmetry, cartoon, illustration, digital art,
perfectly clean surfaces, no texture, toy-like, prototype, generic furniture,
flat colors, no shadows, ambient occlusion only, HDRI dome lighting, 
overexposed uniform white windows, green ball plant, geometric foliage,
uniform floor texture, no grain, noise-free, too bright, too clean, sterile`,
      roomPrompts: [],
      rooms,
      style,
      roomType,
      viewType,
    };
  }

  // Generate room-specific prompts
  const roomPrompts = rooms.map(room => generateRoomPrompt(room, style));

  // Filter to specific room type if requested
  let targetRooms = rooms;
  if (roomType && roomType !== 'auto') {
    targetRooms = rooms.filter(r => r.type === roomType);
    if (targetRooms.length === 0) {
      targetRooms = rooms; // Fallback to all rooms if none match
    }
  }

  // Build the main prompt with geometry data
  const mainPrompt = buildMainPrompt(targetRooms, style, styleEnhancement, roomType, plan, viewType);

  // Build negative prompt
  const negativePrompt = buildNegativePrompt();

  return {
    mainPrompt,
    negativePrompt,
    roomPrompts,
    rooms,
    style,
    roomType,
    viewType,
  };
}

/**
 * Generate detailed wall and geometry description
 */
function generateGeometryDescription(plan) {
  if (!plan || !plan.walls) return '';

  const wallGroups = plan.walls;
  let totalWallLength = 0;
  const wallSegments = [];

  wallGroups.forEach((group, groupIdx) => {
    if (group.walls) {
      group.walls.forEach((wall, wallIdx) => {
        const length = Math.sqrt(
          Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
        );
        totalWallLength += length;
        wallSegments.push({
          id: `W${groupIdx}-${wallIdx}`,
          x1: Math.round(wall.x1),
          y1: Math.round(wall.y1),
          x2: Math.round(wall.x2),
          y2: Math.round(wall.y2),
          length: Math.round(length),
          color: wall.color || group.color || '#bdbdbd'
        });
      });
    }
  });

  // Calculate approximate room dimensions
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  wallSegments.forEach(w => {
    minX = Math.min(minX, w.x1, w.x2);
    maxX = Math.max(maxX, w.x1, w.x2);
    minY = Math.min(minY, w.y1, w.y2);
    maxY = Math.max(maxY, w.y1, w.y2);
  });

  const width = Math.round(maxX - minX);
  const height = Math.round(maxY - minY);
  const area = Math.round((width * height) / 10000); // Approximate sq meters

  return {
    totalWalls: wallSegments.length,
    totalWallLength: Math.round(totalWallLength),
    dimensions: { width, height, area },
    bounds: { minX, maxX, minY, maxY },
    wallSegments: wallSegments.slice(0, 10) // Limit to first 10 for prompt length
  };
}

/**
 * Generate furniture with precise positions
 */
function generateFurnitureGeometry(items) {
  if (!items || items.length === 0) return [];

  return items.map(item => {
    const centerX = Math.round(item.x + (item.width || 0) / 2);
    const centerY = Math.round(item.y + (item.height || 0) / 2);
    const width = Math.round(item.width || 0);
    const height = Math.round(item.height || 0);
    const rotation = Math.round(item.rotation || 0);

    return {
      type: item.type,
      position: { x: centerX, y: centerY },
      dimensions: { width, height },
      rotation: rotation,
      id: item.id
    };
  });
}

/**
 * Build detailed room-specific prompt for FULL interior generation
 */
function buildRoomSpecificPrompt(room, style, styleEnhancement, viewType) {
  const roomName = room.name || room.type || 'Room';
  const itemCount = room.items ? room.items.length : 0;

  // Room dimensions
  let roomWidth = 0, roomHeight = 0;
  if (room.bounds) {
    roomWidth = Math.round((room.bounds.maxX - room.bounds.minX) * 2.54 / 100); // approx cm
    roomHeight = Math.round((room.bounds.maxY - room.bounds.minY) * 2.54 / 100);
  }

  // Build furniture with spatial context
  const furnitureWithPositions = (room.items || []).map(item => {
    const cx = Math.round(item.x + (item.width || 0) / 2);
    const cy = Math.round(item.y + (item.height || 0) / 2);
    const desc = FURNITURE_DESCRIPTIONS[item.type] || item.type;
    // Normalise position as % of room bounds
    const bounds = room.bounds || { minX: 0, maxX: 1000, minY: 0, maxY: 1000 };
    const relX = Math.round(((cx - bounds.minX) / (bounds.maxX - bounds.minX)) * 100);
    const relY = Math.round(((cy - bounds.minY) / (bounds.maxY - bounds.minY)) * 100);
    const side = relX < 35 ? 'left side' : relX > 65 ? 'right side' : 'center';
    const depth = relY < 35 ? 'near wall' : relY > 65 ? 'far wall' : 'middle of room';
    return `${desc} (${side}, ${depth})`;
  });

  // Pairwise spacing descriptions for main items (first 4 items only to keep prompt short)
  const spacingNotes = [];
  const mainItems = (room.items || []).slice(0, 4);
  for (let i = 0; i < mainItems.length - 1; i++) {
    const a = mainItems[i];
    const b = mainItems[i + 1];
    const acx = a.x + (a.width || 0) / 2;
    const bcx = b.x + (b.width || 0) / 2;
    const acy = a.y + (a.height || 0) / 2;
    const bcy = b.y + (b.height || 0) / 2;
    const dx = Math.abs(bcx - acx);
    const dy = Math.abs(bcy - acy);
    const distCm = Math.round(Math.max(dx, dy) * 0.026 * 100); // ~pixel to cm
    if (distCm > 20) {
      const dir = dx > dy ? (bcx > acx ? 'to the right of' : 'to the left of') : (bcy > acy ? 'below' : 'above');
      const aDesc = FURNITURE_DESCRIPTIONS[a.type] || a.type;
      const bDesc = FURNITURE_DESCRIPTIONS[b.type] || b.type;
      spacingNotes.push(`${bDesc} is ~${distCm}cm ${dir} the ${aDesc}`);
    }
  }

  const viewInstructions = viewType === 'insider'
    ? 'eye-level DSLR interior photograph'
    : 'elevated perspective view showing complete room layout';

  const spacingLine = spacingNotes.length > 0
    ? `Layout: ${spacingNotes.join('; ')}.`
    : '';

  // SHORT prompt: style = aesthetic only; layout must stay identical.
  return `Photorealistic interior. Apply ${style} style ONLY to materials, colors, and lighting — do not change layout or move anything. \
${roomName} with exactly ${itemCount} pieces only: ${furnitureWithPositions.join(', ')}. \
${spacingLine} \
${viewInstructions}. Professional 4K. Preserve exact layout and positions. Do not add any new items.`.trim();
}


/**
 * Build the main AI prompt with detailed geometry and Flux 2 best practices
 */
function buildMainPrompt(rooms, style, styleEnhancement, roomType, plan, viewType = 'perspective') {
  // If a specific room is selected (plan.selectedArea), build focused prompt
  if (plan && plan.selectedArea) {
    const selectedRoom = rooms.find(r => r.type === plan.selectedArea.roomType) || rooms[0];
    if (selectedRoom) {
      // Use architectural prompt for single room focus
      const roomStructure = plan.metadata?.rooms?.find(r => r.type === selectedRoom.type) || selectedRoom;
      const basePrompt = generateArchitecturalPrompt(
        {
          ...roomStructure,
          name: selectedRoom.name || selectedRoom.type,
          items: selectedRoom.items
        },
        style,
        'mid', // quality level
        'mixed', // lighting
        viewType === 'insider' ? 'insider' : 'perspective'
      );
      return `${PHOTOREALISM_PREFIX}\n\n${DESTROY_3D_DIRECTIVE}\n\n${LIGHTING_DIRECTIVE}\n\n${basePrompt}`;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // BUG FIX: For insider/FPS view, NEVER use the multi-room overhead prompt.
  // `generateMultiRoomPrompt` generates a bird's-eye floor plan description,
  // causing FLUX Depth Pro to generate top-down or perspective 3D views.
  // Always use focused single-room architectural prompt for insider view.
  // ──────────────────────────────────────────────────────────────────────────────
  if (viewType === 'insider') {
    const primaryRoom = rooms[0]; // Use the first (most prominent) room
    if (primaryRoom) {
      const basePrompt = generateArchitecturalPrompt(
        {
          ...primaryRoom,
          name: primaryRoom.name || primaryRoom.type,
          items: primaryRoom.items
        },
        style,
        'mid',    // material quality
        'mixed',  // lighting scenario
        'insider' // ← ALWAYS insider for FPS view
      );
      return `${PHOTOREALISM_PREFIX}\n\n${DESTROY_3D_DIRECTIVE}\n\n${LIGHTING_DIRECTIVE}\n\n${basePrompt}`;
    }
  }

  // For multiple rooms in non-insider views, use multi-room architectural prompt
  if (rooms.length > 1) {
    const structure = generateFloorPlanStructure(plan);
    if (structure) {
      const basePrompt = generateMultiRoomPrompt(rooms, style, structure);
      return `${PHOTOREALISM_PREFIX}\n\n${DESTROY_3D_DIRECTIVE}\n\n${LIGHTING_DIRECTIVE}\n\n${basePrompt}`;
    }
  }

  // Fallback to enhanced prompt for single room
  const roomDescriptions = rooms.map(room => {
    const furniture = generateFurnitureDescription(room.items);
    const furnitureGeom = generateFurnitureGeometry(room.items);
    const furnitureDetails = furnitureGeom.map(f =>
      `${f.type} at (${f.position.x},${f.position.y}) ${f.rotation}°`
    ).join(', ');
    return `${room.type}: ${furniture}. Positions: ${furnitureDetails}`;
  }).join('. ');

  const roomCount = rooms.length;
  const totalItems = rooms.reduce((sum, r) => sum + r.items.length, 0);

  const geometry = plan ? generateGeometryDescription(plan) : null;

  let geometrySection = '';
  if (geometry) {
    geometrySection = `
FLOOR PLAN GEOMETRY:
- Total Walls: ${geometry.totalWalls}
- Dimensions: ${geometry.dimensions.width} x ${geometry.dimensions.height} units
- Area: ${geometry.dimensions.area} sq meters`;
  }

  const viewInstructions = viewType === 'insider'
    ? `VIEW: Interior perspective from inside`
    : `VIEW: 3D perspective view`;

  // FLUX 2 OPTIMIZED PROMPT - Natural language, clear structure
  const mainPrompt = `Professional photorealistic interior render of ${roomCount} rooms containing ${totalItems} furniture items.
  
STRUCTURE AND LAYOUT PRESERVATION:
- Maintain exact wall positions, door locations, and window placements
- Keep all furniture in their precise locations as specified
- Preserve room proportions and architectural accuracy
${geometrySection}

ROOM CONFIGURATION:
${roomDescriptions}

CAMERA AND VIEW:
${viewInstructions} view with professional architectural visualization quality

DESIGN SPECIFICATIONS (style applies to materials and colors only — do not change layout or positions):
Style: ${style} — apply only to surfaces and finishes: ${styleEnhancement.materials}, ${styleEnhancement.lighting}, ${styleEnhancement.colors}, ${styleEnhancement.furniture}. Keep every item in the same place.

TECHNICAL REQUIREMENTS:
- Photorealistic 4K quality rendering
- Professional interior design magazine style
- Accurate materials, textures, and lighting
- No layout changes or furniture repositioning — style does not mean redesign the space
- Maintain exact spatial relationships and positions
- Do not add any new furniture, objects, or decorations — only the items listed above`;

  return `${PHOTOREALISM_PREFIX}\n\n${DESTROY_3D_DIRECTIVE}\n\n${LIGHTING_DIRECTIVE}\n\n${mainPrompt}`;
}

/**
 * Build negative prompt to avoid unwanted elements
 * Uses architectural-specific negative prompts
 */
function buildNegativePrompt() {
  return `3D render, CGI, Blender, Unreal Engine, Unity, V-Ray, Corona, Octane, game engine, 
video game graphics, low poly, flat shading, uniform lighting, plastic texture, 
smooth featureless walls, perfect symmetry, cartoon, illustration, digital art,
perfectly clean surfaces, no texture, toy-like, prototype, generic furniture,
flat colors, no shadows, ambient occlusion only, HDRI dome lighting, 
overexposed uniform white windows, green ball plant, geometric foliage,
uniform floor texture, no grain, noise-free, too bright, too clean, sterile`;
}

/**
 * Generate a summary of the floor plan for API requests
 * @param {Object} plan - The floor plan data
 * @returns {string} Summary string
 */
function generatePlanSummary(plan) {
  if (!plan || !plan.items) return 'empty floor plan';

  const rooms = analyzeFloorPlan(plan);

  if (rooms.length === 0) {
    return 'empty floor plan';
  }

  const roomSummaries = rooms.map(room => {
    const furnitureCount = room.items.length;
    const furnitureTypes = [...new Set(room.items.map(i => i.type))];
    return `${room.type} with ${furnitureCount} items (${furnitureTypes.join(', ')})`;
  });

  return roomSummaries.join('; ');
}

/**
 * Generate prompt for specific view/camera angle
 * @param {string} viewType - Type of view (perspective, top, side, etc.)
 * @param {Object} plan - The floor plan data
 * @param {string} style - The interior style
 * @returns {string} View-specific prompt
 */
function generateViewPrompt(viewType, plan, style = 'modern') {
  const basePrompt = generateInteriorPrompt(plan, style);

  const viewEnhancements = {
    perspective: 'eye-level perspective view, natural viewing angle, immersive',
    top: 'bird\'s eye view, floor plan perspective, from above',
    side: 'side elevation view, profile perspective',
    front: 'front elevation view, straight-on perspective',
    insider: 'first-person view from inside the room, immersive perspective',
  };

  return `${basePrompt.mainPrompt}

VIEW SPECIFICATION:
${viewEnhancements[viewType] || viewEnhancements.perspective}`;
}

/**
 * Generate detailed floor plan structure for AI (text-only generation)
 * Returns structured data about walls, rooms, dimensions
 */
function generateFloorPlanStructure(plan) {
  if (!plan) return null;

  // Calculate plan bounds
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const walls = [];

  if (plan.walls) {
    plan.walls.forEach((group, groupIdx) => {
      if (group.walls) {
        group.walls.forEach((wall, wallIdx) => {
          minX = Math.min(minX, wall.x1, wall.x2);
          maxX = Math.max(maxX, wall.x1, wall.x2);
          minY = Math.min(minY, wall.y1, wall.y2);
          maxY = Math.max(maxY, wall.y1, wall.y2);

          const length = Math.sqrt(Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2));
          walls.push({
            id: `W${groupIdx}-${wallIdx}`,
            x1: Math.round(wall.x1),
            y1: Math.round(wall.y1),
            x2: Math.round(wall.x2),
            y2: Math.round(wall.y2),
            length: Math.round(length),
            height: 250 // Standard wall height in cm
          });
        });
      }
    });
  }

  const planWidth = Math.round(maxX - minX);
  const planHeight = Math.round(maxY - minY);
  const planArea = Math.round((planWidth * planHeight) / 10000); // sq meters

  // Analyze rooms
  const rooms = analyzeFloorPlan(plan);
  const roomStructures = rooms.map((room, idx) => {
    const roomWidth = room.bounds ? Math.round(room.bounds.maxX - room.bounds.minX) : 0;
    const roomHeight = room.bounds ? Math.round(room.bounds.maxY - room.bounds.minY) : 0;
    const roomArea = Math.round((roomWidth * roomHeight) / 10000);

    return {
      id: idx + 1,
      type: room.type,
      name: room.type.charAt(0).toUpperCase() + room.type.slice(1),
      dimensions: {
        width: roomWidth,
        height: roomHeight,
        area: roomArea,
        widthFt: Math.round(roomWidth / 30.48), // Convert to feet
        heightFt: Math.round(roomHeight / 30.48),
        areaSqFt: Math.round(roomArea * 10.764)
      },
      itemCount: room.items ? room.items.length : 0,
      items: room.items ? room.items.map(item => ({
        type: item.type,
        width: Math.round(item.width || 0),
        height: Math.round(item.height || 0),
        widthCm: Math.round((item.width || 0) * 2.54),
        heightCm: Math.round((item.height || 0) * 2.54),
        x: Math.round(item.x),
        y: Math.round(item.y),
        rotation: Math.round(item.rotation || 0)
      })) : []
    };
  });

  return {
    totalWalls: walls.length,
    totalRooms: rooms.length,
    planDimensions: {
      width: planWidth,
      height: planHeight,
      area: planArea,
      widthFt: Math.round(planWidth / 30.48),
      heightFt: Math.round(planHeight / 30.48),
      areaSqFt: Math.round(planArea * 10.764)
    },
    walls: walls,
    rooms: roomStructures
  };
}

/**
 * Generate text-only prompt for AI (no image reference)
 * Creates detailed description from floor plan structure
 * Optimized for INTERIOR VIEW (inside the room, not top-down)
 */
function generateTextOnlyPrompt(plan, style = 'modern', roomType = null) {
  const structure = generateFloorPlanStructure(plan);
  if (!structure) return null;

  // DEBUG: Log structure analysis
  console.log('=== STRUCTURE ANALYSIS ===');
  console.log('Total rooms detected:', structure.rooms?.length || 0);
  console.log('Room details:', structure.rooms);
  console.log('Plan items:', plan.items);
  console.log('Structure items:', structure.rooms?.[0]?.items);

  const styleEnhancement = STYLE_ENHANCEMENTS[style] || STYLE_ENHANCEMENTS.modern;

  // Filter to specific room if requested
  let targetRooms = structure.rooms;
  if (roomType && roomType !== 'auto') {
    targetRooms = structure.rooms.filter(r => r.type === roomType);
    if (targetRooms.length === 0) {
      targetRooms = structure.rooms;
    }
  }

  // Get the primary room (first one if multiple)
  const primaryRoom = targetRooms[0];
  if (!primaryRoom) {
    console.error('No rooms detected in plan structure');
    return null;
  }

  // Build furniture list for primary room
  const furnitureList = primaryRoom.items?.map(item => item.type)?.join(', ') || '';

  // CRITICAL: If no furniture detected, this is a major issue
  if (!furnitureList) {
    console.error('CRITICAL ERROR: No furniture items detected in room!');
    console.error('Plan items:', plan.items);
    console.error('Detected room items:', primaryRoom.items);
  }

  // Determine view type from plan
  const viewType = plan.viewType || 'insider';

  let prompt;

  if (viewType === 'insider') {
    // INTERIOR VIEW - standing inside the room looking around
    // FLUX 2 OPTIMIZED: Natural language, detailed architectural description

    // SAFETY CHECK: Ensure we have furniture data
    if (!furnitureList) {
      console.error('CRITICAL: No furniture list generated!');
      return `ERROR: No furniture items detected in floor plan. Cannot generate interior render without furniture data.`;
    }

    // Build explicit furniture inventory with positions
    const furnitureInventory = primaryRoom.items?.map((item, idx) =>
      `${idx + 1}. ${item.type} at position (${item.x}, ${item.y}), size: ${item.width}x${item.height}`
    ).join('\n') || 'NONE';

    prompt = `Professional interior architectural photograph of ${primaryRoom.name.toLowerCase()}, captured from eye-level perspective inside the room. Camera positioned centrally, looking toward the main focal wall. 
    
ROOM SPECIFICATIONS:
- Dimensions: ${primaryRoom.dimensions.widthFt} feet by ${primaryRoom.dimensions.heightFt} feet (${primaryRoom.dimensions.areaSqFt} square feet)
- Ceiling height: 9 feet standard

MANDATORY FURNITURE INVENTORY - EXACT ITEMS TO RENDER:
The following ${primaryRoom.items?.length || 0} furniture items MUST be rendered with precise placement:
${furnitureInventory}

ABSOLUTE CONSTRAINTS - DO NOT VIOLATE:
1. ONLY render the furniture items listed above - NO additional furniture allowed
2. DO NOT add any chairs, tables, sofas, beds, cabinets, or other furniture beyond what is listed
3. DO NOT add decorative items not specified in the inventory
4. Preserve exact positions as specified - do not relocate items
5. Maintain room dimensions exactly - do not alter wall positions
6. Do not remove any listed furniture items

ARCHITECTURAL DESIGN (apply ${style} only to materials, colors, lighting — do not change layout or positions):
${style} — surfaces and finishes: ${styleEnhancement.materials}. Lighting: ${styleEnhancement.lighting}. Colors: ${styleEnhancement.colors}. Furniture look: ${styleEnhancement.furniture}. Layout must stay identical.

STRICT PROHIBITIONS:
- NO extra furniture beyond the listed items
- NO additional decorative objects unless specified
- NO rearrangement of furniture positions
- NO removal of any listed furniture
- NO changes to room layout or dimensions
- NO artistic interpretation that adds elements

PHOTOGRAPHIC QUALITY:
- Professional architectural photography style
- Wide-angle lens (24mm equivalent) for comprehensive room view
- Natural lighting with supplemental architectural lighting
- High-resolution 4K quality with realistic textures
- Interior design magazine publication standard
- Accurate perspective and proportional relationships

TECHNICAL SPECIFICATIONS:
- Photorealistic rendering with precise material representation
- Proper shadows, reflections, and lighting physics
- Architectural accuracy in proportions and measurements
- Professional color grading and post-processing
- Render ONLY the specified furniture items`;
  } else {
    // 3D PERSPECTIVE VIEW - style = aesthetic only, same layout
    prompt = `Photorealistic 3D render of ${primaryRoom.name.toLowerCase()} interior, elevated angled perspective view. Room dimensions ${primaryRoom.dimensions.widthFt}ft x ${primaryRoom.dimensions.heightFt}ft. Contains: ${furnitureList || 'minimal furniture'}. Apply ${style} only to materials and colors — ${styleEnhancement.materials}, ${styleEnhancement.lighting}, ${styleEnhancement.colors}. Preserve exact layout and positions. Professional 4K.`;
  }

  return {
    prompt: `${PHOTOREALISM_PREFIX}\n\n${DESTROY_3D_DIRECTIVE}\n\n${LIGHTING_DIRECTIVE}\n\n${prompt}`,
    structure,
    style,
    roomType,
    viewType
  };
}

module.exports = {
  generateInteriorPrompt,
  generatePlanSummary,
  generateViewPrompt,
  generateFloorPlanStructure,
  generateTextOnlyPrompt,
  getFurnitureDescription,
  generateFurnitureDescription,
  STYLE_ENHANCEMENTS,
  ROOM_CONTEXT,
  FURNITURE_DESCRIPTIONS,
};
