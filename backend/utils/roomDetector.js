/**
 * Room Detector - Analyzes floor plan data to detect room types
 *
 * Examines furniture types and spatial clustering to determine what
 * type of room each area represents.  Updated to include ALL item
 * types found in FloorPlanItems/index.js (97 types).
 */

// ──────────────────────────────────────────────────────────────────────────
// COMPLETE item-type → room-type mapping
// Covers every key defined in FloorPlanItems/index.js
// ──────────────────────────────────────────────────────────────────────────
const ROOM_INDICATORS = {
  bedroom: {
    furniture: [
      // beds (old keys)
      'bad', 'singleBad',
      // beds (new keys)
      'kingBed', 'guestDoubleBed', 'guestSingleBed', 'bunkBed',
      // bedroom storage
      'wordrobe', 'wardrobeSliding', 'wardrobeHinged', 'walkInCloset',
      'guestWardrobe', 'dresser', 'chestOfDrawers',
      // bedroom accessories
      'headboard', 'bedsideTable', 'guestBedsideTable',
      'vanityTable', 'wallMirror', 'accentChair',
      // kids bedroom
      'toyStorage', 'toyStorageUnit', 'beanBag',
      // study in bedroom
      'studyDesk', 'studyChair', 'studyTable',
      // misc
      'luggageRack',
    ],
    weight: 1.0,
  },

  living: {
    furniture: [
      // sofas / seating
      'sofa', 'lShapeSofa', 'armchair', 'reclinerChair', 'ottoman', 'beanBag',
      'accentChair',
      // tables
      'coffeeTable', 'sideTable', 'table', 'table2', 'roundTable',
      // entertainment
      'tv',
      // storage / decor
      'bookshelf', 'cabinet',
      // accessories
      'rug', 'lamp', 'curtains', 'flower', 'flower2',
    ],
    weight: 1.0,
  },

  kitchen: {
    furniture: [
      // counters / appliances
      'worktop', 'stove', 'sink', 'refrigerator',
      'baseCabinet', 'wallCabinet', 'tallPantryUnit',
      'kitchenIsland', 'breakfastCounter',
      'spiceRack', 'pullOutBasket', 'plateRack',
      // seating
      'barStool',
    ],
    weight: 1.0,
  },

  dining: {
    furniture: [
      'table', 'table2', 'roundTable',
      'barStool', 'breakfastCounter',
      'cabinet',
    ],
    weight: 0.7, // lower — tables appear in other rooms too
  },

  bathroom: {
    furniture: [
      'bath', 'toilet', 'sink',
      'showerEnclosure', 'mirrorCabinet',
      'towelRack', 'medicineCabinet',
      'laundryBasket', 'washingMachine', 'washingMachineBase',
    ],
    weight: 1.0,
  },

  office: {
    furniture: [
      // desks
      'officeDesk', 'executiveDesk', 'studyTableOffice', 'studyDesk', 'studyTable',
      // chairs
      'ergonomicChair', 'visitorChair', 'studyChair',
      // storage / accessories
      'filingCabinet', 'wallShelves', 'bookshelf', 'cabinet',
      'deskLamp', 'whiteboard', 'desktopLaptop', 'pinBoard',
    ],
    weight: 1.0,
  },

  entryway: {
    furniture: [
      'consoleTable', 'shoeRack', 'shoeCabinet',
      'entrywayBench', 'coatRack', 'umbrellaStand', 'wallHook',
      'wallMirror',
    ],
    weight: 1.0,
  },

  laundry: {
    furniture: [
      'washingMachine', 'washingMachineBase',
      'dryerStand', 'ironingBoardCabinet',
      'laundryBasket', 'utilitySink', 'storageRack',
    ],
    weight: 1.0,
  },

  outdoor: {
    furniture: [
      'outdoorChair', 'outdoorSofa', 'swingChair',
      'planter', 'storageBench', 'barbecueStation',
    ],
    weight: 1.0,
  },

  garage: {
    furniture: [
      'storageRack', 'toolCabinet', 'workbench',
      'bicycleStand', 'storageBench',
    ],
    weight: 1.0,
  },
};

// Approximate room size thresholds (sq metres, plan units are cm-ish)
const ROOM_SIZE_THRESHOLDS = {
  bathroom: { min: 1, max: 10 },
  laundry: { min: 2, max: 12 },
  entryway: { min: 2, max: 12 },
  kitchen: { min: 5, max: 25 },
  office: { min: 5, max: 20 },
  bedroom: { min: 8, max: 30 },
  dining: { min: 8, max: 25 },
  living: { min: 12, max: 60 },
  outdoor: { min: 4, max: 100 },
  garage: { min: 15, max: 60 },
};

// ──────────────────────────────────────────────────────────────────────────
// Geometry helpers
// ──────────────────────────────────────────────────────────────────────────

function getItemCenter(item) {
  return {
    x: item.x + (item.width || 0) / 2,
    y: item.y + (item.height || 0) / 2,
  };
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function calculateRoomArea(walls) {
  if (!walls || walls.length === 0) return 0;
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  (Array.isArray(walls) ? walls : []).forEach(group => {
    const segs = group.walls || (group.x1 !== undefined ? [group] : []);
    segs.forEach(w => {
      minX = Math.min(minX, w.x1, w.x2);
      maxX = Math.max(maxX, w.x1, w.x2);
      minY = Math.min(minY, w.y1, w.y2);
      maxY = Math.max(maxY, w.y1, w.y2);
    });
  });

  return ((maxX - minX) * (maxY - minY)) / 10000;
}

function calculateClusterBounds(items) {
  if (!items || items.length === 0) return null;
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  items.forEach(item => {
    minX = Math.min(minX, item.x);
    maxX = Math.max(maxX, item.x + (item.width || 0));
    minY = Math.min(minY, item.y);
    maxY = Math.max(maxY, item.y + (item.height || 0));
  });
  return { minX, maxX, minY, maxY };
}

// ──────────────────────────────────────────────────────────────────────────
// Scoring / detection
// ──────────────────────────────────────────────────────────────────────────

function scoreRoomType(items, roomType) {
  const indicators = ROOM_INDICATORS[roomType];
  if (!indicators) return 0;

  const furnitureTypes = new Set(items.map(i => i.type));
  let score = 0;

  indicators.furniture.forEach(furnitureType => {
    if (furnitureTypes.has(furnitureType)) score += indicators.weight;
  });

  // Bonus for multiple matching items
  const matchingCount = items.filter(i => indicators.furniture.includes(i.type)).length;
  if (matchingCount > 1) score += matchingCount * 0.2;

  return score;
}

function detectRoomType(items, walls) {
  if (!items || items.length === 0) return 'empty';

  const area = calculateRoomArea(walls);
  const scores = {};

  Object.keys(ROOM_INDICATORS).forEach(roomType => {
    scores[roomType] = scoreRoomType(items, roomType);
  });

  // Size-based bonus
  Object.keys(ROOM_SIZE_THRESHOLDS).forEach(roomType => {
    const t = ROOM_SIZE_THRESHOLDS[roomType];
    if (area >= t.min && area <= t.max) {
      scores[roomType] = (scores[roomType] || 0) + 0.3;
    }
  });

  let bestType = 'generic';
  let bestScore = 0;
  Object.entries(scores).forEach(([type, score]) => {
    if (score > bestScore) { bestScore = score; bestType = type; }
  });

  // Fallback when nothing matches well
  if (bestScore < 0.5) {
    if (area < 6) return 'bathroom';
    if (area < 12) return 'bedroom';
    if (area < 20) return 'kitchen';
    return 'living';
  }

  return bestType;
}

// Room type → display name
const ROOM_NAMES = {
  bedroom: 'Bedroom',
  living: 'Living Room',
  kitchen: 'Kitchen',
  dining: 'Dining Room',
  bathroom: 'Bathroom',
  office: 'Home Office',
  entryway: 'Entryway',
  laundry: 'Laundry Room',
  outdoor: 'Outdoor',
  garage: 'Garage',
  empty: 'Empty Room',
  generic: 'Room',
};

// ──────────────────────────────────────────────────────────────────────────
// Spatial clustering  (BFS-style with proximity threshold)
// ──────────────────────────────────────────────────────────────────────────

/**
 * Group items by spatial proximity.
 * threshold is in plan units (pixels / cm).  300 ≈ 3 m — items within
 * 3 m of ANY cluster member are merged into that cluster.
 */
function clusterItems(items, threshold = 350) {
  if (!items || items.length === 0) return [];

  const visited = new Set();
  const clusters = [];

  items.forEach((item, idx) => {
    if (visited.has(idx)) return;

    // BFS expansion
    const cluster = [];
    const queue = [idx];
    visited.add(idx);

    while (queue.length > 0) {
      const currentIdx = queue.shift();
      cluster.push(items[currentIdx]);
      const cc = getItemCenter(items[currentIdx]);

      items.forEach((other, otherIdx) => {
        if (visited.has(otherIdx)) return;
        const oc = getItemCenter(other);
        if (distance(cc.x, cc.y, oc.x, oc.y) < threshold) {
          visited.add(otherIdx);
          queue.push(otherIdx);
        }
      });
    }

    clusters.push(cluster);
  });

  return clusters;
}

// ──────────────────────────────────────────────────────────────────────────
// Main API
// ──────────────────────────────────────────────────────────────────────────

/**
 * Analyze the full floor plan and return an array of detected rooms.
 * Uses spatial clustering so a multi-room plan produces multiple rooms.
 */
function analyzeFloorPlan(plan) {
  if (!plan || !plan.items || plan.items.length === 0) return [];

  const { items, walls } = plan;

  // Ignore non-furniture types
  const furnitureItems = items.filter(i =>
    i.type && !['door', 'window', 'text'].includes(i.type)
  );

  if (furnitureItems.length === 0) return [];

  // Cluster by proximity (BFS, threshold 350 plan-units ≈ ~3.5 m)
  const clusters = clusterItems(furnitureItems, 350);

  const rooms = clusters
    .filter(cluster => cluster.length > 0)
    .map((cluster, index) => {
      const roomType = detectRoomType(cluster, walls);
      const bounds = calculateClusterBounds(cluster);
      return {
        id: `room-${index}`,
        type: roomType,
        name: ROOM_NAMES[roomType] || 'Room',
        items: cluster,
        itemCount: cluster.length,
        bounds,
        area: calculateRoomArea(walls),
        furnitureTypes: [...new Set(cluster.map(i => i.type))],
      };
    });

  console.log(
    `[roomDetector] Detected ${rooms.length} room(s):`,
    rooms.map(r => `${r.name} (${r.itemCount} items)`)
  );

  return rooms;
}

function getRoomDescription(room) {
  const furnitureCount = room.items.length;
  const furnitureList = room.furnitureTypes.slice(0, 3).join(', ');
  return `${ROOM_NAMES[room.type] || room.type} with ${furnitureCount} items including ${furnitureList}`;
}

function getRoomTypeForItem(item, allItems, walls) {
  const itemCenter = getItemCenter(item);
  const nearbyItems = allItems.filter(other => {
    if (other === item) return false;
    const oc = getItemCenter(other);
    return distance(itemCenter.x, itemCenter.y, oc.x, oc.y) < 400;
  });
  return detectRoomType([item, ...nearbyItems], walls);
}

module.exports = {
  analyzeFloorPlan,
  detectRoomType,
  getRoomDescription,
  getRoomTypeForItem,
  calculateRoomArea,
  clusterItems,
  ROOM_INDICATORS,
  ROOM_NAMES,
};
