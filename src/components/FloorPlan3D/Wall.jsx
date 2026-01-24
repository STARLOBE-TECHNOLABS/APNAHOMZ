// ============================================
// FILE: src/components/FloorPlan3D/Wall.jsx
// 3D Wall component with proper shading and textures
// ============================================

import React from 'react';

// Basic Wall Segment (a simple box)
export function Wall({ position, rotation, length, height, thickness, color }) {
  return (
    <mesh 
      position={position} 
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial 
        color={color || "#e8e4df"}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

// Complex Wall that handles holes for doors/windows
export function ComplexWall({ start, end, height = 2.5, thickness = 0.15, holes = [], scale = 0.02, color }) {
  // Convert 2D coordinates to 3D world units
  const x1 = start.x * scale;
  const y1 = start.y * scale;
  const x2 = end.x * scale;
  const y2 = end.y * scale;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const wallLength = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  // Process holes
  // We need to map hole positions (which are in global 2D coords) to "distance along the wall"
  const openings = holes.map(hole => {
    // Project hole center onto wall line to find 't' (0 to 1)
    const hx = hole.x * scale;
    const hy = hole.y * scale;
    
    // Vector from WallStart to Hole
    const v1x = hx - x1;
    const v1y = hy - y1;
    
    // Dot product to project
    const dot = (v1x * dx + v1y * dy) / (wallLength * wallLength);
    
    // Hole width in 3D units
    const holeWidth = hole.width * scale;
    const holeHeight = hole.height * scale;
    
    // Distance along wall from start
    const centerDist = dot * wallLength;
    
    // Determine hole Y position (sill height) and vertical height
    let sillHeight = 0;
    let openingHeight = 2.1; // Default door height

    if (hole.type === 'window') {
        sillHeight = 0.9; 
        openingHeight = 1.2;
    } else if (hole.type === 'door') {
        sillHeight = 0;
        openingHeight = 2.1;
    }

    return {
      start: Math.max(0, centerDist - holeWidth / 2),
      end: Math.min(wallLength, centerDist + holeWidth / 2),
      sill: sillHeight,
      height: openingHeight,
      type: hole.type
    };
  }).sort((a, b) => a.start - b.start);

  // Merge overlapping openings (simple approach: just don't draw wall there)
  // We'll generate "Solid" segments
  const segments = [];
  let currentPos = 0;

  openings.forEach(opening => {
    // 1. Solid wall before opening
    if (opening.start > currentPos) {
      segments.push({
        start: currentPos,
        length: opening.start - currentPos,
        y: height / 2,
        h: height
      });
    }

    // 2. Wall below opening (Sill)
    if (opening.sill > 0) {
      segments.push({
        start: opening.start,
        length: opening.end - opening.start,
        y: opening.sill / 2,
        h: opening.sill
      });
    }

    // 3. Wall above opening (Header)
    const headerStart = opening.sill + opening.height;
    const headerHeight = height - headerStart;
    if (headerHeight > 0) {
      segments.push({
        start: opening.start,
        length: opening.end - opening.start,
        y: headerStart + headerHeight / 2,
        h: headerHeight
      });
    }

    currentPos = Math.max(currentPos, opening.end);
  });

  // Final segment after last opening
  if (currentPos < wallLength) {
    segments.push({
      start: currentPos,
      length: wallLength - currentPos,
      y: height / 2,
      h: height
    });
  }

  return (
    <group position={[x1, 0, y1]} rotation={[0, -angle, 0]}> 
      {/* Note: ThreeJS rotation is counter-clockwise, and atan2 gives that. 
          But coordinate system might need check. 
          If Z is down (2D Y), and X is right.
          We usually rotate around Y axis.
      */}
      {segments.map((seg, i) => (
        <Wall
          key={i}
          position={[seg.start + seg.length / 2, seg.y, 0]} // Local coords relative to wall start
          rotation={[0, 0, 0]}
          length={seg.length}
          height={seg.h}
          thickness={thickness}
          color={color}
        />
      ))}
    </group>
  );
}
