/* eslint-disable react/no-unknown-property, react/prop-types, react/display-name */
// ============================================
// FILE: src/components/FloorPlan3D/furnitureModels.jsx
// All furniture 3D models for your APNAHOMZ
// ============================================

import React, { useMemo, memo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

// Helper to calculate scale based on props vs default size
const getScale = (w, d, defW, defD) => [w ? w / defW : 1, 1, d ? d / defD : 1];

/** 
 * ENTERPRISE SHARED ASSETS - Phase 2, 3, 6 
 * Defining once outside to share across 100+ components 
 */
export const SharedGeometries = {
  Leg: new THREE.CylinderGeometry(0.04, 0.03, 0.3, 8),
  LegThick: new THREE.CylinderGeometry(0.05, 0.04, 0.3, 8),
  StandardBox: new THREE.BoxGeometry(1, 1, 1),
};

export const SharedMaterials = {
  Fabric: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.8 }),
  Wood: new THREE.MeshStandardMaterial({ color: "#D2B48C", roughness: 0.6, metalness: 0.1 }),
  Metal: new THREE.MeshStandardMaterial({ color: "#757575", roughness: 0.3, metalness: 0.8 }),
  Glass: new THREE.MeshPhysicalMaterial({
    color: "#B0E0E6",
    transparent: true,
    opacity: 0.4,
    roughness: 0,
    metalness: 0.1,
    transmission: 0.6,
    thickness: 0.1,
  }),
};

// Shared Material Components (for backward compatibility if needed, but direct use is better)
const FabricMaterial = ({ color }) => (
  <meshStandardMaterial color={color} roughness={0.8} />
);

const WoodMaterial = ({ color }) => (
  <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
);

const MetalMaterial = ({ color }) => (
  <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
);

const GlassMaterial = ({ color = "#B0E0E6", opacity = 0.4 }) => (
  <meshPhysicalMaterial
    color={color}
    transparent
    opacity={opacity}
    roughness={0}
    metalness={0.1}
    transmission={0.6}
    thickness={0.1}
  />
);

// BEDROOM FURNITURE
export const SingleBed = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(depth, width, 1.9, 1);
  return (
    <group position={position} rotation={[0, rotation - Math.PI / 2, 0]} scale={scale}>
      {/* Legs - Shared Geometry & Material */}
      {[[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]].map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, 0.15, z]}
          geometry={SharedGeometries.Leg}
          material={SharedMaterials.Wood}
          castShadow
        />
      ))}
      {/* Frame */}
      <group position={[0, 0.35, 0]}>
        <RoundedBox args={[1.9, 0.2, 1]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#5a7fa6" roughness={0.6} />
        </RoundedBox>
      </group>
      {/* Mattress */}
      <group position={[0, 0.5, 0]}>
        <RoundedBox args={[1.85, 0.25, 0.95]} radius={0.05} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Fabric} attach="material" />
        </RoundedBox>
      </group>
      {/* Headboard */}
      <group position={[-0.92, 0.7, 0]}>
        <RoundedBox args={[0.08, 0.9, 1.05]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#3d5a80" roughness={0.6} />
        </RoundedBox>
      </group>
      {/* Pillow */}
      <group position={[-0.7, 0.65, 0]}>
        <RoundedBox args={[0.3, 0.1, 0.6]} radius={0.05} smoothness={2} castShadow>
          <meshStandardMaterial color="#eeeeee" roughness={0.8} />
        </RoundedBox>
      </group>
    </group>
  );
});

export const DoubleBed = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(depth, width, 2.6, 2);
  return (
    <group position={position} rotation={[0, rotation - Math.PI / 2, 0]} scale={scale}>
      {/* Legs */}
      {[[-1.2, -0.9], [1.2, -0.9], [-1.2, 0.9], [1.2, 0.9]].map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, 0.15, z]}
          geometry={SharedGeometries.LegThick}
          material={SharedMaterials.Metal}
          castShadow
        />
      ))}
      {/* Frame */}
      <group position={[0, 0.35, 0]}>
        <RoundedBox args={[2.6, 0.2, 2]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#2c3e50" roughness={0.6} />
        </RoundedBox>
      </group>
      {/* Mattress */}
      <group position={[0, 0.5, 0]}>
        <RoundedBox args={[2.55, 0.3, 1.95]} radius={0.05} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Fabric} attach="material" />
        </RoundedBox>
      </group>
      {/* Headboard */}
      <group position={[-1.25, 0.7, 0]}>
        <RoundedBox args={[0.1, 1.0, 2.1]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#2c3e50" roughness={0.6} />
        </RoundedBox>
      </group>
      {/* Pillows */}
      {[[-0.9, -0.5], [-0.9, 0.5]].map(([x, z], i) => (
        <group key={i} position={[x, 0.7, z]}>
          <RoundedBox args={[0.4, 0.15, 0.7]} radius={0.05} smoothness={2} castShadow>
            <meshStandardMaterial color="#eeeeee" roughness={0.8} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
});

export const Wardrobe = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.5, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Main body */}
      <group position={[0, 1, 0]}>
        <RoundedBox args={[1.5, 2, 0.6]} radius={0.02} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      {/* Doors */}
      <group position={[-0.38, 1, 0.31]}>
        <RoundedBox args={[0.72, 1.95, 0.03]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#654321" roughness={0.7} />
        </RoundedBox>
      </group>
      <group position={[0.38, 1, 0.31]}>
        <RoundedBox args={[0.72, 1.95, 0.03]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#654321" roughness={0.7} />
        </RoundedBox>
      </group>
      {/* Handles */}
      <mesh position={[-0.2, 1, 0.33]} geometry={SharedGeometries.Leg} material={SharedMaterials.Metal} castShadow />
      <mesh position={[0.2, 1, 0.33]} geometry={SharedGeometries.Leg} material={SharedMaterials.Metal} castShadow />
    </group>
  );
});

export const KingBed = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(depth, width, 2.4, 2.0);
  return (
    <group position={position} rotation={[0, rotation - Math.PI / 2, 0]} scale={scale}>
      {[[-1.1, -0.85], [1.1, -0.85], [-1.1, 0.85], [1.1, 0.85]].map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, 0.15, z]}
          geometry={SharedGeometries.LegThick}
          material={SharedMaterials.Wood}
          castShadow
        />
      ))}
      <group position={[0, 0.35, 0]}>
        <RoundedBox args={[2.4, 0.2, 2.0]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#2c3e50" roughness={0.6} />
        </RoundedBox>
      </group>
      <group position={[0, 0.55, 0]}>
        <RoundedBox args={[2.35, 0.25, 1.95]} radius={0.05} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Fabric} attach="material" />
        </RoundedBox>
      </group>
      <group position={[-1.15, 0.75, 0]}>
        <RoundedBox args={[0.1, 1.1, 2.1]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#3d5a80" roughness={0.6} />
        </RoundedBox>
      </group>
      {[-0.6, 0.1].map((z, i) => (
        <group key={i} position={[-0.9, 0.65, z]}>
          <RoundedBox args={[0.4, 0.15, 0.6]} radius={0.05} smoothness={2} castShadow>
            <meshStandardMaterial color="#eeeeee" roughness={0.8} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
});

export const Headboard = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(depth, width, 2.0, 0.25);
  return (
    <group position={position} rotation={[0, rotation - Math.PI / 2, 0]} scale={scale}>
      <group position={[0, 0.8, 0]}>
        <RoundedBox args={[2.0, 1.0, 0.25]} radius={0.03} smoothness={2} castShadow>
          <meshStandardMaterial color="#3d5a80" roughness={0.6} />
        </RoundedBox>
      </group>
    </group>
  );
});

export const BedsideTable = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.45, 0.45);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.25, 0]}>
        <RoundedBox args={[0.45, 0.5, 0.45]} radius={0.02} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      <mesh position={[0, 0.4, 0.23]} geometry={SharedGeometries.StandardBox} scale={[0.35, 0.02, 0.02]} material={SharedMaterials.Metal} castShadow />
      <mesh position={[0, 0.15, 0.23]} geometry={SharedGeometries.StandardBox} scale={[0.35, 0.02, 0.02]} material={SharedMaterials.Metal} castShadow />
    </group>
  );
});

export const WardrobeSliding = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.6, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 1.05, 0]}>
        <RoundedBox args={[1.6, 2.1, 0.6]} radius={0.02} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      <group position={[0.1, 1.05, 0.31]}>
        <RoundedBox args={[0.78, 2.0, 0.03]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#5c4033" roughness={0.7} />
        </RoundedBox>
      </group>
      <group position={[-0.3, 1.05, 0.34]}>
        <RoundedBox args={[0.78, 2.0, 0.03]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#6b4f3f" roughness={0.7} />
        </RoundedBox>
      </group>
      <mesh position={[0.35, 1.05, 0.36]} geometry={SharedGeometries.StandardBox} scale={[0.05, 0.4, 0.02]} material={SharedMaterials.Metal} castShadow />
      <mesh position={[-0.15, 1.05, 0.36]} geometry={SharedGeometries.StandardBox} scale={[0.05, 0.4, 0.02]} material={SharedMaterials.Metal} castShadow />
    </group>
  );
});

export const WardrobeHinged = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.6, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 1.05, 0]}>
        <RoundedBox args={[1.6, 2.1, 0.6]} radius={0.02} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      {[-0.52, 0, 0.52].map((x, i) => (
        <group key={i} position={[x, 1.05, 0.31]}>
          <RoundedBox args={[0.5, 2.0, 0.03]} radius={0.01} smoothness={2} castShadow>
            <meshStandardMaterial color="#5c4033" roughness={0.7} />
          </RoundedBox>
        </group>
      ))}
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 1.05, 0.35]} geometry={SharedGeometries.Leg} scale={[0.5, 0.65, 0.5]} material={SharedMaterials.Metal} castShadow />
      ))}
    </group>
  );
});

export const WalkInCloset = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 2.0, 1.4);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 1.05, -0.4]}>
        <RoundedBox args={[2.0, 2.1, 0.3]} radius={0.02} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      <group position={[-0.8, 1.05, 0.4]}>
        <RoundedBox args={[0.4, 2.1, 1.1]} radius={0.02} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      {[-0.6, 0, 0.6].map((x, i) => (
        <mesh
          key={i}
          position={[x, 1.05, -0.25]}
          geometry={SharedGeometries.StandardBox}
          scale={[0.02, 2.0, 0.25]}
          material={SharedMaterials.Wood}
          castShadow
        />
      ))}
    </group>
  );
});

export const Dresser = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.2, 0.5);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.5, 0]}>
        <RoundedBox args={[1.2, 1.0, 0.5]} radius={0.02} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      {[0.25, 0, -0.25].map((y, i) => (
        <mesh key={i} position={[0, 0.5 + y, 0.26]} geometry={SharedGeometries.StandardBox} scale={[1.1, 0.02, 0.02]} material={SharedMaterials.Metal} castShadow />
      ))}
    </group>
  );
});

export const ChestOfDrawers = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.9, 0.5);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.6, 0]}>
        <RoundedBox args={[0.9, 1.2, 0.5]} radius={0.02} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      {[0.35, 0.1, -0.15, -0.4].map((y, i) => (
        <mesh key={i} position={[0, 0.6 + y, 0.26]} geometry={SharedGeometries.StandardBox} scale={[0.8, 0.02, 0.02]} material={SharedMaterials.Metal} castShadow />
      ))}
    </group>
  );
});

export const VanityTable = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.2, 0.5);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Marble Top */}
      <group position={[0, 0.72, 0]}>
        <RoundedBox args={[1.2, 0.04, 0.5]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#f0f2f5" roughness={0.1} />
        </RoundedBox>
      </group>
      {/* Wood Base/Drawers */}
      <group position={[0, 0.6, 0]}>
        <RoundedBox args={[1.15, 0.2, 0.45]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#4a3b32" roughness={0.6} />
        </RoundedBox>
      </group>
      {/* Drawer Details/Handles */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={`handle-${i}`} position={[x, 0.6, 0.23]} castShadow>
          <boxGeometry args={[0.2, 0.02, 0.02]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} />
        </mesh>
      ))}
      {/* Slim Metal Legs */}
      {[[-0.55, 0.25, -0.2], [0.55, 0.25, -0.2], [-0.55, 0.25, 0.2], [0.55, 0.25, 0.2]].map(([x, y, z], i) => (
        <mesh key={`leg-${i}`} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.02, 0.01, 0.5, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} />
        </mesh>
      ))}
      {/* Mirror - Adjusted Width and valid geometry */}
      <group position={[0, 1.15, -0.2]}>
        {/* Mirror Frame */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.02, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} />
        </mesh>
        {/* Glass */}
        <mesh position={[0, 0, 0.011]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.01, 32]} />
          <meshStandardMaterial color="#888" metalness={1} roughness={0} />
        </mesh>
      </group>
    </group>
  );
});

export const AccentChair = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.8, 0.7);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.35, 0]}>
        <RoundedBox args={[0.8, 0.5, 0.7]} radius={0.06} smoothness={2} castShadow>
          <meshStandardMaterial color="#4a5568" roughness={0.8} />
        </RoundedBox>
      </group>
      <group position={[0, 0.75, -0.2]}>
        <RoundedBox args={[0.8, 0.6, 0.2]} radius={0.06} smoothness={2} castShadow>
          <meshStandardMaterial color="#4a5568" roughness={0.8} />
        </RoundedBox>
      </group>
    </group>
  );
});

// LIVING ROOM FURNITURE
// Classic colorful sofa with tufted design
export const Sofa = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 2.2, 0.9);
  // Premium brown color options only
  const brownColors = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#654321', '#8B5A2B', '#A0785A', '#C19A6B', '#8B7355', '#6B4423'];
  const sofaColor = brownColors[Math.floor(Math.random() * brownColors.length)];

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Wooden Legs - Classic turned style */}
      {[[-0.9, -0.35], [0.9, -0.35], [-0.9, 0.35], [0.9, 0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.15, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.3, 8]} />
          <meshStandardMaterial color="#3d2817" roughness={0.6} />
        </mesh>
      ))}

      {/* Seat Cushions - 3 separate cushions */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <group key={i} position={[x, 0.45, 0]}>
          <RoundedBox args={[0.65, 0.25, 0.85]} radius={0.08} smoothness={4} castShadow>
            <meshStandardMaterial color={sofaColor} roughness={0.8} metalness={0.1} />
          </RoundedBox>
          {/* Tufted buttons */}
          <mesh position={[0, 0.13, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color={sofaColor} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Backrest - Tufted classic style */}
      <group position={[0, 0.75, -0.35]}>
        <RoundedBox args={[2.1, 0.6, 0.2]} radius={0.05} smoothness={4} castShadow>
          <meshStandardMaterial color={sofaColor} roughness={0.8} metalness={0.1} />
        </RoundedBox>
        {/* Tufted pattern on backrest */}
        {[-0.5, 0, 0.5].map((x, i) => (
          <mesh key={i} position={[x, 0.05, 0.11]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color={sofaColor} roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Armrests - Rolled classic style */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 1.05, 0.55, 0]}>
          <RoundedBox args={[0.25, 0.5, 0.9]} radius={0.12} smoothness={4} castShadow>
            <meshStandardMaterial color={sofaColor} roughness={0.8} />
          </RoundedBox>
        </group>
      ))}

      {/* Decorative piping trim */}
      <mesh position={[0, 0.58, 0.43]}>
        <boxGeometry args={[2.0, 0.02, 0.02]} />
        <meshStandardMaterial color="#2d1f14" roughness={0.7} />
      </mesh>
    </group>
  );
});

export const LShapeSofa = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 2.2, 2.2);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.45, -0.65]}>
        <RoundedBox args={[2.2, 0.5, 0.9]} radius={0.05} smoothness={2} castShadow>
          <meshStandardMaterial color="#4a5568" roughness={0.7} />
        </RoundedBox>
      </group>
      <group position={[0.65, 0.45, 0.25]}>
        <RoundedBox args={[0.9, 0.5, 1.3]} radius={0.05} smoothness={2} castShadow>
          <meshStandardMaterial color="#4a5568" roughness={0.7} />
        </RoundedBox>
      </group>
      <group position={[0, 0.85, -1.0]}>
        <RoundedBox args={[2.2, 0.8, 0.2]} radius={0.05} smoothness={2} castShadow>
          <meshStandardMaterial color="#4a5568" roughness={0.7} />
        </RoundedBox>
      </group>
      <group position={[1.0, 0.85, 0.25]}>
        <RoundedBox args={[0.2, 0.8, 2.2]} radius={0.05} smoothness={2} castShadow>
          <meshStandardMaterial color="#4a5568" roughness={0.7} />
        </RoundedBox>
      </group>
    </group>
  );
});

export const Armchair = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.9, 0.9);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.4, 0]}>
        <RoundedBox args={[0.9, 0.5, 0.9]} radius={0.05} smoothness={2} castShadow>
          <meshStandardMaterial color="#2d3748" roughness={0.7} />
        </RoundedBox>
      </group>
      <group position={[0, 0.8, -0.35]}>
        <RoundedBox args={[0.9, 0.8, 0.2]} radius={0.05} smoothness={2} castShadow>
          <meshStandardMaterial color="#2d3748" roughness={0.7} />
        </RoundedBox>
      </group>
      {[-0.4, 0.4].map((x, i) => (
        <group key={i} position={[x, 0.6, 0]}>
          <RoundedBox args={[0.15, 0.5, 0.9]} radius={0.05} smoothness={2} castShadow>
            <meshStandardMaterial color="#2d3748" roughness={0.7} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
});

export const ReclinerChair = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.0, 1.0);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.8, -0.2]} rotation={[-0.2, 0, 0]}>
        <RoundedBox args={[0.9, 1.0, 0.25]} radius={0.1} smoothness={2} castShadow>
          <meshStandardMaterial color="#1a202c" roughness={0.7} />
        </RoundedBox>
      </group>
      <group position={[0, 0.4, 0.1]}>
        <RoundedBox args={[0.9, 0.5, 0.8]} radius={0.1} smoothness={2} castShadow>
          <meshStandardMaterial color="#1a202c" roughness={0.7} />
        </RoundedBox>
      </group>
      {[-0.45, 0.45].map((x, i) => (
        <group key={i} position={[x, 0.55, 0]}>
          <RoundedBox args={[0.2, 0.6, 1.0]} radius={0.1} smoothness={2} castShadow>
            <meshStandardMaterial color="#1a202c" roughness={0.7} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
});

export const Ottoman = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.6, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.25, 0]}>
        <RoundedBox args={[0.6, 0.3, 0.6]} radius={0.05} smoothness={2} castShadow>
          <meshStandardMaterial color="#5c4033" roughness={0.8} />
        </RoundedBox>
      </group>
      {/* Legs */}
      {[[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]} geometry={SharedGeometries.Leg} scale={[0.8, 1, 0.8]} material={SharedMaterials.Wood} castShadow />
      ))}
    </group>
  );
});

// Classic colorful coffee table with ornate design
export const CoffeeTable = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.2, 0.6);
  // Classic wood colors
  const woodColors = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#654321', '#5D4E37'];
  const tableColor = woodColors[Math.floor(Math.random() * woodColors.length)];
  const accentColor = ['#FFD700', '#C0C0C0', '#B8860B'][Math.floor(Math.random() * 3)]; // Gold, Silver, DarkGoldenrod

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Table Top - Ornate carved look */}
      <group position={[0, 0.45, 0]}>
        {/* Main surface */}
        <RoundedBox args={[1.2, 0.06, 0.6]} radius={0.03} smoothness={4} castShadow>
          <meshStandardMaterial color={tableColor} roughness={0.5} metalness={0.1} />
        </RoundedBox>
        {/* Decorative inlay border */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.1, 0.01, 0.5]} />
          <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Carved edge detail */}
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[1.25, 0.04, 0.65]} />
          <meshStandardMaterial color={tableColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Ornate carved legs */}
      {[[-0.5, -0.22], [0.5, -0.22], [-0.5, 0.22], [0.5, 0.22]].map(([x, z], i) => (
        <group key={i} position={[x, 0.22, z]}>
          {/* Upper leg - carved */}
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.03, 0.25, 8]} />
            <meshStandardMaterial color={tableColor} roughness={0.5} />
          </mesh>
          {/* Decorative ball */}
          <mesh position={[0, -0.15, 0]} castShadow>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.5} />
          </mesh>
          {/* Lower leg */}
          <mesh position={[0, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.02, 0.2, 8]} />
            <meshStandardMaterial color={tableColor} roughness={0.5} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.03, 0.05, 8]} />
            <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Lower shelf */}
      <group position={[0, 0.15, 0]}>
        <RoundedBox args={[0.9, 0.03, 0.4]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color={tableColor} roughness={0.6} />
        </RoundedBox>
      </group>
    </group>
  );
});

export const SideTable = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.45, 0.45);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.5, 0]}>
        <RoundedBox args={[0.45, 0.05, 0.45]} radius={0.01} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      <mesh position={[0, 0.25, 0]} geometry={SharedGeometries.StandardBox} scale={[0.04, 0.5, 0.04]} material={SharedMaterials.Metal} castShadow />
      <mesh position={[0, 0.02, 0]} geometry={SharedGeometries.StandardBox} scale={[0.3, 0.04, 0.3]} material={SharedMaterials.Metal} castShadow />
    </group>
  );
});

export const Bookshelf = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.2, 0.35);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 1.0, 0]}>
        <RoundedBox args={[1.2, 2.0, 0.35]} radius={0.01} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
        {[0.6, 0.2, -0.2, -0.6].map((y, i) => (
          <mesh key={i} position={[0, y, 0.01]} geometry={SharedGeometries.StandardBox} scale={[1.15, 0.02, 0.34]} material={SharedMaterials.Wood} />
        ))}
        {/* Books - Simplified boxes, no casting shadows for small items */}
        <group position={[-0.3, 0.3, 0.1]}>
          <mesh geometry={SharedGeometries.StandardBox} scale={[0.05, 0.3, 0.2]}>
            <meshStandardMaterial color="#e53e3e" roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
});

export function Rug({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 2.0, 1.4);

  // Colors for "Earthy Elegance" palette
  const navy = "#1e293b";
  const gold = "#d97706";
  const slate = "#475569";
  const ivory = "#f8fafc";
  const accent = "#b91c1c";

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* 1. Main Base Layer (Heavy Wool Texture) */}
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <boxGeometry args={[2.0, 0.01, 1.4]} />
        <meshStandardMaterial color={navy} roughness={1} />
      </mesh>

      {/* 2. Outer Guard Border (Ivory) */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[1.94, 0.002, 1.34]} />
        <meshStandardMaterial color={ivory} roughness={0.9} />
      </mesh>

      {/* 3. Main Pattern Border (Gold) */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <boxGeometry args={[1.85, 0.002, 1.25]} />
        <meshStandardMaterial color={gold} roughness={0.9} opacity={0.8} transparent />
      </mesh>

      {/* 4. FIELD PATTERN - Trellis Grid */}
      <group position={[0, 0.02, 0]}>
        {[-0.6, -0.3, 0, 0.3, 0.6].map((x) =>
          [-0.4, -0.2, 0, 0.2, 0.4].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[0, Math.PI / 4, 0]}>
              <boxGeometry args={[0.04, 0.001, 0.04]} />
              <meshStandardMaterial color={slate} roughness={1} />
            </mesh>
          ))
        )}
      </group>

      {/* 5. CENTRAL MEDALLION - Multi-layered Geometric */}
      <group position={[0, 0.025, 0]}>
        {/* Large outer star */}
        <mesh rotation={[0, Math.PI / 8, 0]}>
          <boxGeometry args={[0.45, 0.002, 0.45]} />
          <meshStandardMaterial color={gold} />
        </mesh>
        {/* Main Diamond */}
        <mesh position={[0, 0.001, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.4, 0.002, 0.4]} />
          <meshStandardMaterial color={ivory} />
        </mesh>
        {/* Red Accent Heart */}
        <mesh position={[0, 0.002, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.15, 0.003, 0.15]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        {/* Center dot */}
        <mesh position={[0, 0.004, 0]}>
          <circleGeometry args={[0.02, 16]} rotation={[-Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color={navy} />
        </mesh>
      </group>

      {/* 6. CORNER FILIGREE CLUSTERS */}
      {[[-0.8, -0.5], [0.8, -0.5], [-0.8, 0.5], [0.8, 0.5]].map((p, i) => (
        <group key={i} position={[p[0], 0.025, p[1]]}>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.12, 0.002, 0.12]} />
            <meshStandardMaterial color={gold} />
          </mesh>
          <mesh position={[0, 0.001, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.06, 0.002, 0.06]} />
            <meshStandardMaterial color={accent} />
          </mesh>
        </group>
      ))}

      {/* 7. REALISTIC FRINGE */}
      <group position={[1.0, 0.005, 0]}>
        {[...Array(30)].map((_, i) => (
          <mesh key={i} position={[0.02, 0.001, (i / 29 - 0.5) * 1.35]}>
            <boxGeometry args={[0.04, 0.001, 0.003]} />
            <meshStandardMaterial color="#e5e7eb" />
          </mesh>
        ))}
      </group>
      <group position={[-1.0, 0.005, 0]}>
        {[...Array(30)].map((_, i) => (
          <mesh key={i} position={[-0.02, 0.001, (i / 29 - 0.5) * 1.35]}>
            <boxGeometry args={[0.04, 0.001, 0.003]} />
            <meshStandardMaterial color="#e5e7eb" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export const FloorLamp = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.3, 0.3); // Adjusted scale to match original Lamp's effective size
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.02, 0]} geometry={SharedGeometries.Leg} scale={[6, 0.2, 6]} material={SharedMaterials.Metal} castShadow />
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
        <primitive object={SharedMaterials.Metal} attach="material" />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.4, 12, 1, true]} />
        <primitive object={SharedMaterials.Fabric} attach="material" />
      </mesh>
      <pointLight position={[0, 1.4, 0]} intensity={0.4} color="#fff" />
    </group>
  );
});

export const Curtains = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.2, 0.1); // Slightly wider default
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 1.2, 0]}>
        {/* Realistic Curtain Rod with Finials */}
        <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 1.3, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Finials */}
        {[-0.66, 0.66].map((x, i) => (
          <mesh key={`f-${i}`} position={[x, 1.1, 0]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} />
          </mesh>
        ))}

        {/* Drapery with multiple folds for realism */}
        {[-0.45, 0.45].map((sideX, sideKey) => (
          <group key={sideKey} position={[sideX, 0, 0]}>
            {[...Array(6)].map((_, foldIdx) => (
              <mesh key={foldIdx} position={[foldIdx * 0.035 - 0.1, 0.1, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.05, 2.0, 12, 1, false, 0, Math.PI]} />
                <meshStandardMaterial
                  color="#1e293b"
                  roughness={0.9}
                  side={THREE.DoubleSide}
                  opacity={0.95}
                  transparent
                />
              </mesh>
            ))}
            {/* Curtain Tie-back area (middle bulge) */}
            <mesh position={[0, -0.1, 0.02]} scale={[1, 0.5, 1]}>
              <torusGeometry args={[0.12, 0.01, 8, 24]} />
              <meshStandardMaterial color="#d97706" metalness={0.5} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
});

export const TV = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.4, 0.3);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.9, 0]}>
        <RoundedBox args={[1.4, 0.8, 0.05]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
        </RoundedBox>
      </group>
      <mesh position={[0, 0.05, 0]} geometry={SharedGeometries.Leg} scale={[5, 0.5, 5]} material={SharedMaterials.Metal} castShadow />
      <mesh position={[0, 0.35, 0]} geometry={SharedGeometries.Leg} scale={[1.6, 2.5, 1.6]} material={SharedMaterials.Metal} castShadow />
    </group>
  );
});

// TABLES
export const RoundTable = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.3, 1.3);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Table Top */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.05, 32]} />
        <meshStandardMaterial color="#8b4513" roughness={0.6} />
      </mesh>
      {/* Pedestal Base Pole */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color="#6b340a" roughness={0.7} />
      </mesh>
      {/* Base Footing */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.04, 32]} />
        <meshStandardMaterial color="#6b340a" roughness={0.7} />
      </mesh>
    </group>
  );
});

export const RectangularTable = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.8, 0.9);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.75, 0]}>
        <RoundedBox args={[1.8, 0.05, 0.9]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.6} />
        </RoundedBox>
      </group>
      {/* Table apron */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.7, 0.08, 0.8]} />
        <meshStandardMaterial color="#6b340a" roughness={0.7} />
      </mesh>
      {[[0.8, 0.35], [-0.8, 0.35], [0.8, -0.35], [-0.8, -0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]} castShadow>
          <boxGeometry args={[0.06, 0.7, 0.06]} />
          <meshStandardMaterial color="#6b340a" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
});

// KITCHEN & BATHROOM
export const Stove = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.6, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.45, 0]}>
        <RoundedBox args={[0.6, 0.9, 0.6]} radius={0.02} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Metal} attach="material" />
        </RoundedBox>
      </group>
      <mesh position={[0, 0.91, 0]} geometry={SharedGeometries.StandardBox} scale={[0.58, 0.02, 0.58]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
      </mesh>
      {[[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.93, z]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
      <group position={[0, 0.3, 0.31]}>
        <RoundedBox args={[0.55, 0.5, 0.02]} radius={0.01} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Glass} attach="material" />
        </RoundedBox>
      </group>
    </group>
  );
});

export const Sink = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.7, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Base Cabinet */}
      <group position={[0, 0.45, 0]}>
        <RoundedBox args={[0.7, 0.9, 0.6]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
        </RoundedBox>
      </group>
      {/* Counter Rim */}
      <group position={[0, 0.91, 0]}>
        <RoundedBox args={[0.72, 0.04, 0.62]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#e0e0e0" roughness={0.2} />
        </RoundedBox>
      </group>
      {/* actual sink depression/metal plate */}
      <mesh position={[0, 0.931, 0.05]} castShadow>
        <boxGeometry args={[0.55, 0.01, 0.4]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Sink Bowl */}
      <mesh position={[0, 0.88, 0.05]} castShadow>
        <boxGeometry args={[0.5, 0.1, 0.35]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Drain */}
      <mesh position={[0, 0.835, 0.05]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 16]} />
        <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.4} />
      </mesh>
      {/* Faucet Base */}
      <mesh position={[0, 0.96, -0.2]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.05, 16]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Faucet Neck */}
      <mesh position={[0, 1.1, -0.15]} rotation={[-0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 16]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Handles */}
      <mesh position={[-0.08, 0.96, -0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.06, 8]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[0.08, 0.96, -0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.06, 8]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.1} />
      </mesh>
    </group>
  );
});

export const Worktop = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 2.4, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Cabinet base - Modern White */}
      <group position={[0, 0.4, 0]}>
        <RoundedBox args={[2.4, 0.8, 0.6]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#f5f5f5" roughness={0.5} />
        </RoundedBox>
      </group>
      {/* Counter top - Granite/Stone look */}
      <group position={[0, 0.82, 0]}>
        <RoundedBox args={[2.45, 0.05, 0.65]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.2} />
        </RoundedBox>
      </group>

      {/* SINK INTEGRATION (Left Side) */}
      <group position={[-0.6, 0.83, 0]}>
        {/* Sink Basin (Visual representation sitting slightly on top/in) */}
        <mesh position={[0, 0.01, 0]} geometry={SharedGeometries.StandardBox} scale={[0.8, 0.02, 0.5]} material={SharedMaterials.Metal} />
        {/* Faucet */}
        <mesh position={[0, 0.05, -0.2]} geometry={SharedGeometries.Leg} scale={[0.4, 1.0, 0.4]} material={SharedMaterials.Metal} castShadow />
        {/* Drain */}
        <mesh position={[0, 0.025, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.01, 12]} />
          <MetalMaterial color="#333333" />
        </mesh>
      </group>

      {/* Cabinet doors - White with slight detail */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <group key={i} position={[x, 0.4, 0.31]}>
          <RoundedBox args={[0.75, 0.75, 0.02]} radius={0.01} smoothness={2} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </RoundedBox>
          {/* Handle - Horizontal Bar */}
          <mesh position={[0, 0.25, 0.03]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.15, 8]} />
            <MetalMaterial color="#c0c0c0" />
          </mesh>
        </group>
      ))}
    </group>
  );
});

export const Refrigerator = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.7, 0.7);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Main Body */}
      <group position={[0, 0.9, 0]}>
        <RoundedBox args={[0.7, 1.8, 0.65]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#f0f0f0" roughness={0.2} metalness={0.2} />
        </RoundedBox>
      </group>
      {/* Left Door - Freezer */}
      <group position={[-0.18, 0.9, 0.34]}>
        <RoundedBox args={[0.33, 1.76, 0.04]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#e5e5e5" metalness={0.5} roughness={0.3} />
        </RoundedBox>
      </group>
      {/* Left Handle */}
      <mesh position={[-0.05, 0.9, 0.37]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Right Door - Fridge */}
      <group position={[0.18, 0.9, 0.34]}>
        <RoundedBox args={[0.33, 1.76, 0.04]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#e5e5e5" metalness={0.5} roughness={0.3} />
        </RoundedBox>
      </group>
      {/* Right Handle */}
      <mesh position={[0.05, 0.9, 0.37]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Ice maker display */}
      <mesh position={[-0.18, 1.2, 0.361]} castShadow>
        <boxGeometry args={[0.15, 0.25, 0.002]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[-0.18, 1.15, 0.362]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.002]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
    </group>
  );
});

export const Cabinet = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 2.4, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Cabinet Body */}
      <group position={[0, 0.4, 0]}>
        <RoundedBox args={[2.4, 0.8, 0.58]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#f0f2f5" roughness={0.4} />
        </RoundedBox>
      </group>
      {/* 4 Doors Front */}
      {[-0.85, -0.28, 0.28, 0.85].map((x, i) => (
        <group key={`cb-door-${i}`} position={[x, 0.35, 0.29]}>
          <RoundedBox args={[0.55, 0.65, 0.02]} radius={0.01} smoothness={2} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0.2, 0.02]} castShadow>
            <boxGeometry args={[0.15, 0.02, 0.015]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* 4 Top Drawers */}
      {[-0.85, -0.28, 0.28, 0.85].map((x, i) => (
        <group key={`cb-draw-${i}`} position={[x, 0.73, 0.29]}>
          <RoundedBox args={[0.55, 0.1, 0.02]} radius={0.01} smoothness={2} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0, 0.02]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Granite Countertop */}
      <group position={[0, 0.82, 0]}>
        <RoundedBox args={[2.44, 0.04, 0.62]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#374151" roughness={0.2} metalness={0.3} />
        </RoundedBox>
      </group>
    </group>
  );
});

export const Toilet = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.45, 0.65);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Premium One-Piece Base & Bowl */}
      <group position={[0, 0.22, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.45, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.05} />
        </mesh>
        {/* Forward Taper for Bowl */}
        <mesh position={[0, 0.1, 0.12]} scale={[1.1, 1, 1.4]} castShadow>
          <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} rotation={[Math.PI, 0, 0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.05} />
        </mesh>
      </group>

      {/* Tank - Unified with Base */}
      <group position={[0, 0.55, -0.2]}>
        <RoundedBox args={[0.42, 0.6, 0.2]} radius={0.08} smoothness={4} castShadow>
          <meshStandardMaterial color="#f8fafc" roughness={0.05} metalness={0.05} />
        </RoundedBox>
        {/* Designer Brushed Gold Flush Lever */}
        <mesh position={[-0.18, 0.2, 0.1]} castShadow>
          <boxGeometry args={[0.06, 0.02, 0.02]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Seat - High-end Soft Close */}
      <group position={[0, 0.45, 0.08]}>
        <mesh rotation={[0, 0, 0]} scale={[1.1, 0.04, 1.3]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.4, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        {/* Hinge Details */}
        {[-0.08, 0.08].map((x, i) => (
          <mesh key={i} position={[x, 0.02, -0.22]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.04, 16]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
});

export const Bath = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.8, 0.85);

  const tileSize = 0.12;
  const tileGap = 0.008;
  const apronWidth = 1.8;
  const apronHeight = 0.58;
  const apronDepth = 0.85;

  const tiles = useMemo(() => {
    const list = [];
    const cols = Math.floor(apronWidth / (tileSize + tileGap));
    const rows = Math.floor(apronHeight / (tileSize + tileGap));
    const sideCols = Math.floor(apronDepth / (tileSize + tileGap));

    // Front Panel Tiles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push({
          pos: [(c * (tileSize + tileGap)) - apronWidth / 2 + tileSize / 2, (r * (tileSize + tileGap)) - apronHeight / 2 + tileSize / 2, apronDepth / 2 + 0.005],
          rot: [0, 0, 0]
        });
      }
    }
    // Side Panel Tiles (Left)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < sideCols; c++) {
        list.push({
          pos: [-apronWidth / 2 - 0.005, (r * (tileSize + tileGap)) - apronHeight / 2 + tileSize / 2, (c * (tileSize + tileGap)) - apronDepth / 2 + tileSize / 2],
          rot: [0, -Math.PI / 2, 0]
        });
      }
    }
    // Side Panel Tiles (Right)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < sideCols; c++) {
        list.push({
          pos: [apronWidth / 2 + 0.005, (r * (tileSize + tileGap)) - apronHeight / 2 + tileSize / 2, (c * (tileSize + tileGap)) - apronDepth / 2 + tileSize / 2],
          rot: [0, Math.PI / 2, 0]
        });
      }
    }
    return list;
  }, []);

  const tileMeshRef = useRef();
  useEffect(() => {
    if (!tileMeshRef.current) return;
    const dummy = new THREE.Object3D();
    tiles.forEach((t, i) => {
      dummy.position.set(...t.pos);
      dummy.rotation.set(...t.rot);
      dummy.updateMatrix();
      tileMeshRef.current.setMatrixAt(i, dummy.matrix);
    });
    tileMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [tiles]);

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* 1. SOLID BASE BLOCK */}
      <mesh position={[0, 0.29, 0]}>
        <boxGeometry args={[1.78, 0.56, 0.83]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* 2. INSTANCED DECORATIVE TILES - Designer Slate/Gold Scheme */}
      <group position={[0, 0.29, 0]}>
        <instancedMesh ref={tileMeshRef} args={[null, null, tiles.length]} castShadow>
          <boxGeometry args={[tileSize, tileSize, 0.012]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.1} />
        </instancedMesh>
      </group>

      {/* 3. PREMIUM PORCELAIN RIM (Thick & Rounded) */}
      <group position={[0, 0.58, 0]}>
        {/* Main Rim segments */}
        <mesh position={[0, 0.01, 0.38]}>
          <RoundedBox args={[1.86, 0.06, 0.12]} radius={0.03} smoothness={4} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.01} metalness={0.05} />
          </RoundedBox>
        </mesh>
        <mesh position={[0, 0.01, -0.38]}>
          <RoundedBox args={[1.86, 0.06, 0.12]} radius={0.03} smoothness={4} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.01} metalness={0.05} />
          </RoundedBox>
        </mesh>
        <mesh position={[0.88, 0.01, 0]}>
          <RoundedBox args={[0.12, 0.06, 0.88]} radius={0.03} smoothness={4} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.01} metalness={0.05} />
          </RoundedBox>
        </mesh>
        <mesh position={[-0.88, 0.01, 0]}>
          <RoundedBox args={[0.12, 0.06, 0.88]} radius={0.03} smoothness={4} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.01} metalness={0.05} />
          </RoundedBox>
        </mesh>
      </group>

      {/* 4. LARGE MOLDED INNER BASIN */}
      <group position={[0, 0.35, 0]}>
        {/* Upper Walls (White) */}
        <mesh scale={[2.2, 0.5, 1.05]} position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.4, 0.38, 0.28, 64, 1, true]} />
          <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={0.02} metalness={0.05} />
        </mesh>
        {/* Lower Walls (Grey for depth) */}
        <mesh scale={[2.2, 0.5, 1.05]} position={[0, -0.14, 0]}>
          <cylinderGeometry args={[0.38, 0.35, 0.28, 64, 1, true]} />
          <meshStandardMaterial color="#e2e8f0" side={THREE.DoubleSide} roughness={0.05} />
        </mesh>

        {/* Basin Floor (Dark Slate for depth perception) */}
        <mesh position={[0, -0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 0.75]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.1} />
        </mesh>

        {/* Polished Gold Drain Cover */}
        <mesh position={[0.6, -0.26, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <circleGeometry args={[0.045, 32]} />
          <meshStandardMaterial color="#d97706" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[0.6, -0.258, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.018, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Realistic Water Surface with Depth Shadow */}
        <group position={[0, -0.05, 0]}>
          {/* Waterline Shadow (Simulates AO) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
            <planeGeometry args={[1.62, 0.77]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.12} />
          </mesh>
          {/* Volume Water */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.6, 0.75]} />
            <meshStandardMaterial
              color="#0284c7"
              transparent
              opacity={0.25}
              roughness={0}
              metalness={0.3}
            />
          </mesh>
        </group>
      </group>

      {/* 5. MODERN LUXURY FIXTURES (Deck-Mounted Gold) */}
      <group position={[0.8, 0.63, 0]}>
        {/* Mixer Base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 32]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Curved Spout */}
        <mesh position={[-0.05, 0.08, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.015, 0.02, 0.15, 16]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.02, 0.04, 0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.08, 16]} />
          <meshStandardMaterial color="#d97706" metalness={1} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
});

// KITCHEN CABINETS & APPLIANCES
export const BaseCabinet = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.6, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.45, 0]}>
        {/* Main Body - Midnight Navy */}
        <RoundedBox args={[0.6, 0.9, 0.58]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.1} />
        </RoundedBox>
      </group>
      {/* Doors Dual */}
      {[-0.14, 0.14].map((x, i) => (
        <group key={`door-${i}`} position={[x, 0.35, 0.29]}>
          <RoundedBox args={[0.27, 0.65, 0.02]} radius={0.01} smoothness={2} castShadow>
            <meshStandardMaterial color="#1e293b" roughness={0.3} />
          </RoundedBox>
          {/* Brushed Gold Handle */}
          <mesh position={[0, 0.2, 0.02]} castShadow>
            <boxGeometry args={[0.1, 0.02, 0.02]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
      {/* Top Drawer */}
      <group position={[0, 0.78, 0.29]}>
        <RoundedBox args={[0.55, 0.15, 0.02]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0, 0.02]} castShadow>
          <boxGeometry args={[0.15, 0.02, 0.02]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      {/* Kitchen Countertop (Polished Quartz) */}
      <group position={[0, 0.92, 0]}>
        <RoundedBox args={[0.62, 0.04, 0.62]} radius={0.005} smoothness={2} castShadow>
          <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.05} />
        </RoundedBox>
      </group>
    </group>
  );
});

export const WallCabinet = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.6, 0.35);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 1.8, 0]}>
        {/* Main Body - Midnight Navy */}
        <RoundedBox args={[0.6, 0.7, 0.33]} radius={0.01} smoothness={4} castShadow>
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.1} />
        </RoundedBox>

        {/* Dual Doors with Beveled Edges */}
        {[-0.148, 0.148].map((x, i) => (
          <group key={`wdoor-${i}`} position={[x, 0, 0.17]}>
            <RoundedBox args={[0.29, 0.68, 0.03]} radius={0.005} smoothness={4} castShadow>
              <meshStandardMaterial color="#1e293b" roughness={0.2} />
            </RoundedBox>
            {/* Elegant Slim Gold Handle */}
            <mesh position={[i === 0 ? 0.1 : -0.1, -0.15, 0.02]} castShadow>
              <boxGeometry args={[0.012, 0.25, 0.012]} />
              <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
});

export const TallPantryUnit = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.6, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 1.05, 0]}>
        <RoundedBox args={[0.6, 2.1, 0.6]} radius={0.02} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      <group position={[0, 1.05, 0.31]}>
        {/* Panel Door - Midnight Navy */}
        <RoundedBox args={[0.58, 2.05, 0.02]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </RoundedBox>
        {/* Tall Gold Handle */}
        <mesh position={[0, 0, 0.02]} castShadow>
          <boxGeometry args={[0.02, 0.4, 0.01]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
});

export const KitchenIsland = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.8, 0.9);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.45, 0]}>
        <RoundedBox args={[1.8, 0.9, 0.9]} radius={0.02} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      <group position={[0, 0.92, 0]}>
        <RoundedBox args={[1.9, 0.06, 1.0]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#222222" roughness={0.2} metalness={0.3} />
        </RoundedBox>
      </group>
    </group>
  );
});

export const BreakfastCounter = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 2.2, 0.45);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Counter surface */}
      <group position={[0, 1.05, 0]}>
        <RoundedBox args={[2.2, 0.05, 0.45]} radius={0.01} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      {/* Supports (legs) */}
      {[[-1.05, 0], [1.05, 0], [0, 0]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.525, z]} geometry={SharedGeometries.Leg} scale={[1, 10.5, 1]} material={SharedMaterials.Metal} castShadow />
      ))}
    </group>
  );
});

export const BarStool = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.4, 0.4);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Pedestal Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 32]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.8} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 16]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.8} />
      </mesh>
      {/* Footrest ring attached to pole */}
      <group position={[0, 0.25, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.12, 0.01, 8, 24]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.25]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.8} />
        </mesh>
      </group>
      {/* Premium Seat Cushion */}
      <group position={[0, 0.7, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        {/* Inner tuft/seam line */}
        <mesh position={[0, 0.041, 0]} castShadow>
          <torusGeometry args={[0.12, 0.005, 8, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#d1d5db" />
        </mesh>
        {/* Button */}
        <mesh position={[0, 0.042, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.005, 12]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
      </group>
      {/* Curved backrest */}
      <mesh position={[0, 0.82, -0.16]} rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.2, 32, 1, false, Math.PI + 0.5, Math.PI - 1.0]} />
        <meshStandardMaterial color="#111827" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
});

export const SpiceRack = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.45, 0.15);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 1.4, -0.05]}>
        <mesh position={[0, 0, -0.02]} geometry={SharedGeometries.StandardBox} scale={[0.45, 0.8, 0.02]} material={SharedMaterials.Wood} />
        {[0.3, 0, -0.3].map((y, i) => (
          <group key={i} position={[0, y, 0]}>
            <mesh position={[0, -0.1, 0.05]} geometry={SharedGeometries.StandardBox} scale={[0.43, 0.02, 0.12]} material={SharedMaterials.Wood} />
            <mesh position={[0, -0.05, 0.11]} geometry={SharedGeometries.StandardBox} scale={[0.43, 0.01, 0.01]} material={SharedMaterials.Metal} />
            {[-0.15, -0.05, 0.05, 0.15].map((x, j) => (
              <group key={j} position={[x, 0, 0.05]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.035, 0.035, 0.12, 8]} />
                  <primitive object={SharedMaterials.Glass} attach="material" />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
});

export const PullOutBasket = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.6, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.45, 0.31]}>
        <RoundedBox args={[0.58, 0.85, 0.02]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </RoundedBox>
      </group>
      <group position={[0, 0.2, 0]}>
        <mesh position={[0, -0.1, 0]} geometry={SharedGeometries.StandardBox} scale={[0.5, 0.02, 0.55]} material={SharedMaterials.Metal} />
      </group>
    </group>
  );
});

export const PlateRack = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.8, 0.4);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 1.5, -0.1]}>
        <mesh position={[0, 0, -0.05]} geometry={SharedGeometries.StandardBox} scale={[0.8, 0.6, 0.05]} material={SharedMaterials.Wood} />
        {[-0.3, 0, 0.3].map((x, i) => (
          <group key={i} position={[x, 0, 0.15]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.01, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
});

// STRUCTURAL
export const Door = memo(({ position, rotation = 0, width, depth, flip }) => {
  const w = width || 0.9;
  const h = 2.1;
  const wallT = 0.15;
  const jambT = 0.035;
  const casingW = 0.07;
  const sT = 0.045;

  const lightOak = '#deb887';
  const panelShadow = '#cd9a5b';
  const thresholdMat = '#a8a8a8';
  const handleMat = '#6e6e6e';

  const hsx = flip ? -1 : 1;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <boxGeometry args={[w, 0.01, wallT + 0.02]} />
        <meshStandardMaterial color={thresholdMat} roughness={0.4} metalness={0.6} />
      </mesh>
      <group position={[0, h / 2, 0]}>
        <mesh position={[-w / 2 + jambT / 2, 0, 0]} castShadow>
          <boxGeometry args={[jambT, h, wallT]} />
          <meshStandardMaterial color={lightOak} roughness={0.6} />
        </mesh>
        <mesh position={[w / 2 - jambT / 2, 0, 0]} castShadow>
          <boxGeometry args={[jambT, h, wallT]} />
          <meshStandardMaterial color={lightOak} roughness={0.6} />
        </mesh>
        <mesh position={[0, h / 2 - jambT / 2, 0]} castShadow>
          <boxGeometry args={[w - jambT * 2, jambT, wallT]} />
          <meshStandardMaterial color={lightOak} roughness={0.6} />
        </mesh>
        {[wallT / 2 + 0.005, -(wallT / 2 + 0.005)].map((z, side) => (
          <group key={side} position={[0, 0, z]}>
            <mesh position={[-w / 2 - casingW / 2 + jambT, 0, 0]} castShadow>
              <boxGeometry args={[casingW, h + casingW, 0.015]} />
              <meshStandardMaterial color={lightOak} roughness={0.7} />
            </mesh>
            <mesh position={[w / 2 + casingW / 2 - jambT, 0, 0]} castShadow>
              <boxGeometry args={[casingW, h + casingW, 0.015]} />
              <meshStandardMaterial color={lightOak} roughness={0.7} />
            </mesh>
            <mesh position={[0, h / 2 + casingW / 2, 0]} castShadow>
              <boxGeometry args={[w + casingW * 2 - jambT * 2, casingW, 0.015]} />
              <meshStandardMaterial color={lightOak} roughness={0.7} />
            </mesh>
          </group>
        ))}
        {/* Door Panel Pivoted at Hinge (Left side default, inverted by flip) */}
        <group position={[(w / 2 - jambT) * -hsx, 0, 0]} rotation={[0, hsx * Math.PI / 3, 0]}>
          <group position={[((w - jambT * 2) / 2) * hsx, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[w - jambT * 2 - 0.006, h - jambT - 0.006, sT]} />
              <meshStandardMaterial color={lightOak} roughness={0.6} />
            </mesh>
            {[sT / 2 + 0.002, -(sT / 2 + 0.002)].map((pz, side) => (
              <group key={side} position={[0, 0, pz]}>
                <mesh position={[0, -0.05, -Math.sign(pz) * 0.005]}>
                  <boxGeometry args={[(w - jambT * 2) * 0.65, (h - jambT) * 0.75, 0.01]} />
                  <meshStandardMaterial color={panelShadow} roughness={0.8} emissive='#000000' emissiveIntensity={0.05} />
                </mesh>
                <mesh position={[0, -0.05, -Math.sign(pz) * 0.002]}>
                  <boxGeometry args={[(w - jambT * 2) * 0.68, (h - jambT) * 0.78, 0.005]} />
                  <meshStandardMaterial color={lightOak} roughness={0.7} />
                </mesh>
              </group>
            ))}
            {/* Handle */}
            <group position={[((w - jambT * 2) / 2 - 0.1) * hsx, -h * 0.05, 0]}>
              {[sT / 2 + 0.002, -(sT / 2 + 0.002)].map((hz, hzi) => (
                <group key={hzi} position={[0, 0, hz]}>
                  <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
                    <meshStandardMaterial color={handleMat} metalness={0.7} roughness={0.3} />
                  </mesh>
                  <mesh position={[-0.05 * hsx, 0, Math.sign(hz) * 0.02]}>
                    <boxGeometry args={[0.10, 0.012, 0.012]} />
                    <meshStandardMaterial color={handleMat} metalness={0.7} roughness={0.3} />
                  </mesh>
                  <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.015, 0.015, 0.008, 12]} />
                    <meshStandardMaterial color={handleMat} metalness={0.7} roughness={0.3} />
                  </mesh>
                </group>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
});

export const Window = memo(({ position, rotation = 0, width }) => {
  const w = width || 1.2;
  const h = 1.2;
  const sillHeight = 0.9;
  const wallT = 0.15;
  const frameT = 0.06;
  const frameColor = '#FFFFFF';
  const glassColor = '#B0D4FF';
  const sillColor = '#E5E7EB';

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <group position={[0, sillHeight + h / 2, 0]}>
        <mesh position={[0, -h / 2 - 0.02, wallT / 2 + 0.02]} rotation={[0.05, 0, 0]} castShadow>
          <boxGeometry args={[w + 0.08, 0.04, 0.08]} />
          <meshStandardMaterial color={sillColor} roughness={0.8} />
        </mesh>
        <mesh position={[-w / 2 + frameT / 2, 0, 0]} castShadow>
          <boxGeometry args={[frameT, h, wallT + 0.01]} />
          <meshStandardMaterial color={frameColor} roughness={0.3} />
        </mesh>
        <mesh position={[w / 2 - frameT / 2, 0, 0]} castShadow>
          <boxGeometry args={[frameT, h, wallT + 0.01]} />
          <meshStandardMaterial color={frameColor} roughness={0.3} />
        </mesh>
        <mesh position={[0, -h / 2 + frameT / 2, 0]} castShadow>
          <boxGeometry args={[w - frameT * 2, frameT, wallT + 0.01]} />
          <meshStandardMaterial color={frameColor} roughness={0.3} />
        </mesh>
        <mesh position={[0, h / 2 - frameT / 2, 0]} castShadow>
          <boxGeometry args={[w - frameT * 2, frameT, wallT + 0.01]} />
          <meshStandardMaterial color={frameColor} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[frameT * 0.8, h - frameT * 2, frameT * 0.8]} />
          <meshStandardMaterial color={frameColor} roughness={0.3} />
        </mesh>
        <mesh position={[-w / 4, 0, 0]}>
          <boxGeometry args={[w / 2 - frameT * 1.5, h - frameT * 2, 0.02]} />
          <meshPhysicalMaterial color={glassColor} transmission={0.9} opacity={0.3} transparent roughness={0.05} thickness={0.02} />
        </mesh>
        <mesh position={[w / 4, 0, 0]}>
          <boxGeometry args={[w / 2 - frameT * 1.5, h - frameT * 2, 0.02]} />
          <meshPhysicalMaterial color={glassColor} transmission={0.9} opacity={0.3} transparent roughness={0.05} thickness={0.02} />
        </mesh>
      </group>
    </group>
  );
});


// BEDROOM & STUDY
export const StudyDesk = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.2, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Desk Top */}
      <group position={[0, 0.73, 0]}>
        <RoundedBox args={[1.2, 0.04, 0.6]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#f3f4f6" roughness={0.3} />
        </RoundedBox>
      </group>
      {/* Drawer Unit (Right Side) */}
      <group position={[0.4, 0.365, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.69, 0.55]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Drawers */}
        {[0.15, 0.45].map((y, i) => (
          <mesh key={i} position={[0, y - 0.365, 0.28]} castShadow>
            <boxGeometry args={[0.33, 0.28, 0.02]} />
            <meshStandardMaterial color="#e5e7eb" roughness={0.4} />
          </mesh>
        ))}
      </group>
      {/* Left Metal Leg (Loop) */}
      <mesh position={[-0.55, 0.365, 0]} castShadow>
        <boxGeometry args={[0.04, 0.73, 0.55]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Modesty Panel */}
      <mesh position={[-0.1, 0.5, -0.25]} castShadow>
        <boxGeometry args={[0.9, 0.4, 0.02]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
    </group>
  );
});

export const StudyChair = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.5, 0.5);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* 4 Wooden Legs */}
      {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.22, z]} castShadow>
          <cylinderGeometry args={[0.02, 0.015, 0.45, 16]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {/* Plastic/Wood Bucket Seat */}
      <group position={[0, 0.45, 0]}>
        <RoundedBox args={[0.45, 0.04, 0.42]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#fbbf24" roughness={0.3} />
        </RoundedBox>
      </group>
      {/* Curved Backrest */}
      <group position={[0, 0.65, -0.2]} rotation={[0.1, 0, 0]}>
        <RoundedBox args={[0.42, 0.35, 0.04]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#fbbf24" roughness={0.3} />
        </RoundedBox>
      </group>
      {/* Seat Cushion */}
      <group position={[0, 0.47, 0.02]}>
        <RoundedBox args={[0.4, 0.04, 0.35]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#374151" roughness={0.9} />
        </RoundedBox>
      </group>
    </group>
  );
});

export const WallMirror = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.8, 0.05);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.6, 0]}>
        {/* Frame - Modern Circular Design */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.04, 64]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Mirror Surface */}
        <mesh position={[0, 0, 0.022]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.01, 64]} />
          <meshPhysicalMaterial
            color="#cbd5e1"
            metalness={1}
            roughness={0}
            transmission={0}
            thickness={0.1}
            envMapIntensity={1}
          />
        </mesh>

        {/* Subtle inner bevel */}
        <mesh position={[0, 0, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.38, 0.01, 64]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
});

export const LuggageRack = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.7, 0.4);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.02, 0]}>
        <RoundedBox args={[0.7, 0.04, 0.4]} radius={0.01} smoothness={2} castShadow>
          <primitive object={SharedMaterials.Wood} attach="material" />
        </RoundedBox>
      </group>
      <mesh position={[-0.3, 0.1, 0]} rotation={[0, 0, 0.3]} geometry={SharedGeometries.StandardBox} scale={[0.02, 0.2, 0.4]} material={SharedMaterials.Wood} castShadow />
      <mesh position={[0.3, 0.1, 0]} rotation={[0, 0, -0.3]} geometry={SharedGeometries.StandardBox} scale={[0.02, 0.2, 0.4]} material={SharedMaterials.Wood} castShadow />
    </group>
  );
});

export const BunkBed = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 1.0, 2.0);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* 4 Corner Posts */}
      {[[-0.48, -0.98], [0.48, -0.98], [-0.48, 0.98], [0.48, 0.98]].map(([x, z], i) => (
        <mesh key={`post-${i}`} position={[x, 0.9, z]} castShadow>
          <boxGeometry args={[0.06, 1.8, 0.06]} />
          <meshStandardMaterial color="#f3f4f6" roughness={0.4} />
        </mesh>
      ))}
      {/* Bottom Bunk Frame & Mattress */}
      <group position={[0, 0.35, 0]}>
        <mesh castShadow><boxGeometry args={[0.96, 0.1, 1.96]} /><meshStandardMaterial color="#f3f4f6" roughness={0.4} /></mesh>
        <group position={[0, 0.12, 0]}>
          <RoundedBox args={[0.92, 0.15, 1.9]} radius={0.04} smoothness={2} castShadow>
            <meshStandardMaterial color="#60a5fa" roughness={0.8} />
          </RoundedBox>
        </group>
      </group>
      {/* Top Bunk Frame & Mattress */}
      <group position={[0, 1.35, 0]}>
        <mesh castShadow><boxGeometry args={[0.96, 0.1, 1.96]} /><meshStandardMaterial color="#f3f4f6" roughness={0.4} /></mesh>
        <group position={[0, 0.12, 0]}>
          <RoundedBox args={[0.92, 0.15, 1.9]} radius={0.04} smoothness={2} castShadow>
            <meshStandardMaterial color="#60a5fa" roughness={0.8} />
          </RoundedBox>
        </group>
      </group>
      {/* Top Bunk Guard Rails */}
      <mesh position={[-0.48, 1.55, 0]} castShadow><boxGeometry args={[0.04, 0.15, 1.9]} /><meshStandardMaterial color="#f3f4f6" roughness={0.4} /></mesh>
      <mesh position={[0.48, 1.55, -0.2]} castShadow><boxGeometry args={[0.04, 0.15, 1.5]} /><meshStandardMaterial color="#f3f4f6" roughness={0.4} /></mesh>
      {/* Ladder */}
      <group position={[0.5, 0.9, 0.7]}>
        <mesh position={[-0.08, 0, 0]} castShadow><boxGeometry args={[0.04, 1.8, 0.04]} /><meshStandardMaterial color="#f3f4f6" /></mesh>
        <mesh position={[0.08, 0, 0]} castShadow><boxGeometry args={[0.04, 1.8, 0.04]} /><meshStandardMaterial color="#f3f4f6" /></mesh>
        {[-0.6, -0.2, 0.2, 0.6].map((y, i) => (
          <mesh key={`rung-${i}`} position={[0, y, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
});

export function ToyStorage({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.8, 0.4);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.4]} />
        <WoodMaterial color="#F0E68C" />
      </mesh>
      {/* Bins */}
      <mesh position={[-0.2, 0.45, 0.1]} castShadow><boxGeometry args={[0.3, 0.2, 0.2]} /><meshStandardMaterial color="#FF6347" /></mesh>
      <mesh position={[0.2, 0.45, 0.1]} castShadow><boxGeometry args={[0.3, 0.2, 0.2]} /><meshStandardMaterial color="#4682B4" /></mesh>
      <mesh position={[-0.2, 0.15, 0.1]} castShadow><boxGeometry args={[0.3, 0.2, 0.2]} /><meshStandardMaterial color="#32CD32" /></mesh>
      <mesh position={[0.2, 0.15, 0.1]} castShadow><boxGeometry args={[0.3, 0.2, 0.2]} /><meshStandardMaterial color="#FFD700" /></mesh>
    </group>
  );
}

export function BeanBag({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.8, 0.8);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Slumped Base */}
      <mesh position={[0, 0.25, 0]} scale={[1, 0.6, 1]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#eab308" roughness={0.9} />
      </mesh>
      {/* Back Support (Tear drop shape effect) */}
      <mesh position={[0, 0.45, -0.1]} scale={[0.7, 0.9, 0.7]} rotation={[-0.2, 0, 0]} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#eab308" roughness={0.9} />
      </mesh>
      {/* Seating Indentation representation */}
      <mesh position={[0, 0.35, 0.15]} scale={[0.7, 0.2, 0.6]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ca8a04" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function PinBoard({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.8, 0.05);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Unified clean board color */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.04]} />
        <meshStandardMaterial color="#E3C5A8" roughness={0.9} metalness={0.05} />
      </mesh>
    </group>
  );
}

// BATHROOM (Additional)
export function MirrorCabinet({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.6, 0.2);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 1.45, 0]}>
        {/* Cabinet Body */}
        <mesh castShadow>
          <RoundedBox args={[0.6, 0.8, 0.18]} radius={0.01}>
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
          </RoundedBox>
        </mesh>

        {/* Premium Mirror Front */}
        <mesh position={[0, 0, 0.095]} castShadow>
          <RoundedBox args={[0.58, 0.78, 0.015]} radius={0.005}>
            <meshPhysicalMaterial
              color="#cbd5e1"
              metalness={1}
              roughness={0}
              transmission={0}
              reflectivity={1}
            />
          </RoundedBox>
        </mesh>

        {/* Subtle LED Underglow (Decorative) */}
        <mesh position={[0, -0.4, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.55, 0.02]} />
          <meshBasicMaterial color="#bae6fd" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export function ShowerEnclosure({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.9, 0.9);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Tray */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.9, 0.1, 0.9]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {/* Glass Walls */}
      <mesh position={[0.44, 1.0, 0]} castShadow>
        <boxGeometry args={[0.02, 2.0, 0.9]} />
        <GlassMaterial opacity={0.2} />
      </mesh>
      <mesh position={[0, 1.0, 0.44]} castShadow>
        <boxGeometry args={[0.9, 2.0, 0.02]} />
        <GlassMaterial opacity={0.2} />
      </mesh>
      {/* Shower Head */}
      <mesh position={[0, 1.9, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
        <MetalMaterial color="silver" />
      </mesh>
    </group>
  );
}

export function TowelRack({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.6, 0.12);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Wall Brackets */}
      {[[-0.25, 1.25], [0.25, 1.25]].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], -0.05]} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Main Bar (The Rack) */}
      <mesh position={[0, 1.25, 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.6, 32]} />
        <meshStandardMaterial color="#cbd5e1" metalness={1} roughness={0.1} />
      </mesh>

      {/* Hung Hand Towel (Realistic Fold) */}
      <group position={[0, 1.1, 0.04]}>
        <RoundedBox args={[0.3, 0.45, 0.05]} radius={0.03} castShadow>
          <meshStandardMaterial color="#0ea5e9" roughness={0.9} />
        </RoundedBox>
        {/* Subtle cloth lines */}
        <mesh position={[0, 0.1, 0.026]}>
          <boxGeometry args={[0.25, 0.005, 0.005]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  );
}

export function MedicineCabinet({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.4, 0.15);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <RoundedBox args={[0.4, 0.5, 0.15]} radius={0.02} smoothness={2}>
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </RoundedBox>
      </mesh>
      {/* Mirror Glass Frame Front */}
      <mesh position={[0, 1.5, 0.076]} castShadow>
        <boxGeometry args={[0.38, 0.48, 0.005]} />
        <meshStandardMaterial color="#888" metalness={1} roughness={0} />
      </mesh>
    </group>
  );
}

export function LaundryBasket({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.5, 0.5);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Woven Wicker Body */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.2, 0.55, 32]} />
        <meshStandardMaterial color="#a16207" roughness={1} />
      </mesh>

      {/* Top Rim */}
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[0.26, 0.02, 16, 64]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#854d0e" />
      </mesh>

      {/* Realistic Clothes volume */}
      <group position={[0, 0.52, 0]}>
        <mesh rotation={[0.5, 0.2, 0]}>
          <sphereGeometry args={[0.23, 16, 16]} scale={[1, 0.4, 1.1]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
        <mesh rotation={[-0.4, -0.6, 0.2]} position={[0.05, 0.02, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} scale={[1.1, 0.5, 0.9]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

export function WashingMachine({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.6, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Container Group - Shifted up slightly to ground correctly */}
      <group position={[0, 0.05, 0]}>
        {/* Main Body */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <RoundedBox args={[0.6, 0.8, 0.6]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.4} />
          </RoundedBox>
        </mesh>
        {/* Front Panel Cutout/Detail */}
        <mesh position={[0, 0.4, 0.301]} castShadow>
          <boxGeometry args={[0.58, 0.78, 0.01]} />
          <meshStandardMaterial color="#4b5563" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Outer Door Frame (Torus naturally faces Z-axis in Three.js, so no rotation needed here) */}
        <mesh position={[0, 0.35, 0.306]} castShadow>
          <torusGeometry args={[0.2, 0.015, 16, 32]} />
          <meshStandardMaterial color="#111827" metalness={0.8} />
        </mesh>
        {/* Inner Door Frame */}
        <mesh position={[0, 0.35, 0.308]} castShadow>
          <torusGeometry args={[0.18, 0.01, 16, 32]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} />
        </mesh>
        {/* Glass Door (Cylinder faces Y by default, so we rotate around X to make it face Z) */}
        <mesh position={[0, 0.35, 0.305]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.01, 32]} />
          <meshStandardMaterial color="#111827" opacity={0.8} transparent />
        </mesh>
        {/* Control Panel Area */}
        <mesh position={[0, 0.73, 0.302]}>
          <boxGeometry args={[0.6, 0.14, 0.01]} />
          <meshStandardMaterial color="#1f2937" metalness={0.6} />
        </mesh>
        {/* Dial */}
        <mesh position={[0, 0.73, 0.31]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.015, 16]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.8} />
        </mesh>
        {/* Dispenser Drawer */}
        <mesh position={[-0.2, 0.73, 0.305]} castShadow>
          <boxGeometry args={[0.15, 0.08, 0.01]} />
          <meshStandardMaterial color="#4b5563" metalness={0.4} />
        </mesh>
        {/* Digital Display */}
        <mesh position={[0.2, 0.73, 0.306]} castShadow>
          <boxGeometry args={[0.12, 0.06, 0.01]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
    </group>
  );
}

export function OfficeDesk({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.4, 0.7);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Desk Top */}
      <mesh position={[0, 0.73, 0]} castShadow>
        <boxGeometry args={[1.4, 0.04, 0.7]} />
        <meshStandardMaterial color="#4b5563" roughness={0.4} />
      </mesh>
      {/* Left Solid Leg Panel */}
      <mesh position={[-0.68, 0.365, 0]} castShadow>
        <boxGeometry args={[0.04, 0.73, 0.7]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>
      {/* Right Drawer Cabinet */}
      <group position={[0.5, 0.365, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.73, 0.68]} />
          <meshStandardMaterial color="#1f2937" roughness={0.5} />
        </mesh>
        {/* Drawers Fronts */}
        {[0.15, 0.4, 0.65].map((y, i) => (
          <mesh key={`od-dr-${i}`} position={[0, y - 0.365, 0.345]} castShadow>
            <boxGeometry args={[0.36, 0.22, 0.02]} />
            <meshStandardMaterial color="#4b5563" roughness={0.4} />
          </mesh>
        ))}
      </group>
      {/* Modesty Panel (Back cover) */}
      <mesh position={[-0.1, 0.45, -0.33]} castShadow>
        <boxGeometry args={[1.1, 0.5, 0.02]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function ExecutiveDesk({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.8, 0.85);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Main Heavy Desk Top */}
      <mesh position={[0, 0.73, 0]} castShadow>
        <boxGeometry args={[1.8, 0.06, 0.85]} />
        <meshStandardMaterial color="#2d1d13" roughness={0.6} />
      </mesh>
      {/* Side Storage/Filing Units */}
      <group position={[-0.6, 0.365, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.73, 0.75]} />
          <meshStandardMaterial color="#1c120c" roughness={0.7} />
        </mesh>
        {/* Drawers */}
        {[0.12, 0.35, 0.6].map((y, i) => (
          <mesh key={`ex-dr1-${i}`} position={[0, y - 0.365, 0.38]} castShadow>
            <boxGeometry args={[0.45, 0.2, 0.02]} />
            <meshStandardMaterial color="#3e2723" />
          </mesh>
        ))}
      </group>
      <group position={[0.6, 0.365, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.73, 0.75]} />
          <meshStandardMaterial color="#1c120c" roughness={0.7} />
        </mesh>
        {/* Drawers */}
        {[0.12, 0.35, 0.6].map((y, i) => (
          <mesh key={`ex-dr2-${i}`} position={[0, y - 0.365, 0.38]} castShadow>
            <boxGeometry args={[0.45, 0.2, 0.02]} />
            <meshStandardMaterial color="#3e2723" />
          </mesh>
        ))}
      </group>
      {/* Heavy Back panel (Modesty Panel) */}
      <mesh position={[0, 0.365, -0.35]} castShadow>
        <boxGeometry args={[1.6, 0.73, 0.04]} />
        <meshStandardMaterial color="#2d1d13" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function ErgonomicChair({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.7, 0.7);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Base & Wheels */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 5]} />
        <MetalMaterial color="#111" />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
        <MetalMaterial color="#444" />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <RoundedBox args={[0.5, 0.1, 0.5]} radius={0.05}>
          <FabricMaterial color="#333" />
        </RoundedBox>
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.8, -0.22]} rotation={[-0.1, 0, 0]} castShadow>
        <RoundedBox args={[0.45, 0.7, 0.08]} radius={0.04}>
          <FabricMaterial color="#222" />
        </RoundedBox>
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.3, 0.55, 0]} castShadow>
        <boxGeometry args={[0.08, 0.02, 0.3]} />
        <MetalMaterial color="#111" />
      </mesh>
      <mesh position={[0.3, 0.55, 0]} castShadow>
        <boxGeometry args={[0.08, 0.02, 0.3]} />
        <MetalMaterial color="#111" />
      </mesh>
    </group>
  );
}

export function VisitorChair({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.55, 0.5);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.45, 0.05, 0.4]} />
        <FabricMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0.55, -0.18]} rotation={[-0.05, 0, 0]} castShadow>
        <boxGeometry args={[0.45, 0.4, 0.05]} />
        <FabricMaterial color="#555" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2, 0.1, 0.15]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <MetalMaterial color="#888" />
      </mesh>
      <mesh position={[0.2, 0.1, 0.15]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <MetalMaterial color="#888" />
      </mesh>
      <mesh position={[-0.2, 0.1, -0.15]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <MetalMaterial color="#888" />
      </mesh>
      <mesh position={[0.2, 0.1, -0.15]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <MetalMaterial color="#888" />
      </mesh>
    </group>
  );
}

export function FilingCabinet({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.45, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.45, 0.6, 0.6]} />
        <MetalMaterial color="#CFD8DC" />
      </mesh>
      {/* Drawers separation */}
      {[0.1, 0.3, 0.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0.301]}>
          <boxGeometry args={[0.4, 0.15, 0.01]} />
          <MetalMaterial color="#90A4AE" />
        </mesh>
      ))}
    </group>
  );
}

export function WallShelves({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.0, 0.2);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Higher shelf */}
      <mesh position={[0, 1.5, -0.05]} castShadow>
        <boxGeometry args={[1.0, 0.02, 0.2]} />
        <WoodMaterial color="#8D6E63" />
      </mesh>
      {/* Lower shelf */}
      <mesh position={[0, 1.2, -0.05]} castShadow>
        <boxGeometry args={[0.8, 0.02, 0.2]} />
        <WoodMaterial color="#8D6E63" />
      </mesh>
    </group>
  );
}

export function DeskLamp({ position, rotation = 0, width, depth }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
        <MetalMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
        <MetalMaterial color="#444" />
      </mesh>
      <mesh position={[0, 0.3, 0.05]} rotation={[1.2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.1, 16]} />
        <MetalMaterial color="#333" />
      </mesh>
      {/* Light bulb emission effect (symbolic) */}
      <mesh position={[0, 0.3, 0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#FFF9C4" emissive="#FFF9C4" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

export function Whiteboard({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.5, 0.1);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[1.5, 1.0, 0.03]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.05} />
      </mesh>
      {/* Frame - Sleek silver/light gray */}
      <mesh position={[0, 1.4, -0.01]}>
        <boxGeometry args={[1.54, 1.04, 0.02]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

export function DesktopLaptop({ position, rotation = 0, width, depth }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Laptop Base */}
      <mesh position={[0, 0.01, 0]} castShadow>
        <boxGeometry args={[0.4, 0.02, 0.3]} />
        <MetalMaterial color="#silver" />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.15, -0.14]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.28, 0.01]} />
        <MetalMaterial color="#silver" />
      </mesh>
      <mesh position={[0, 0.15, -0.13]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.38, 0.26, 0.005]} />
        <meshStandardMaterial color="#000" emissive="#111" />
      </mesh>
    </group>
  );
}

export function ConsoleTable({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.2, 0.35);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1.2, 0.04, 0.35]} />
        <WoodMaterial color="#5D4037" />
      </mesh>
      {/* Slim legs */}
      <mesh position={[-0.55, 0.375, 0.15]} castShadow>
        <boxGeometry args={[0.03, 0.75, 0.03]} />
        <MetalMaterial color="#222" />
      </mesh>
      <mesh position={[0.55, 0.375, 0.15]} castShadow>
        <boxGeometry args={[0.03, 0.75, 0.03]} />
        <MetalMaterial color="#222" />
      </mesh>
      <mesh position={[-0.55, 0.375, -0.15]} castShadow>
        <boxGeometry args={[0.03, 0.75, 0.03]} />
        <MetalMaterial color="#222" />
      </mesh>
      <mesh position={[0.55, 0.375, -0.15]} castShadow>
        <boxGeometry args={[0.03, 0.75, 0.03]} />
        <MetalMaterial color="#222" />
      </mesh>
    </group>
  );
}

export function ShoeRack({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.8, 0.3);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Shelf levels */}
      {[0.1, 0.3, 0.5].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          {[-0.1, 0, 0.1].map((z, j) => (
            <mesh key={j} position={[0, 0, z]}>
              <boxGeometry args={[0.8, 0.02, 0.02]} />
              <WoodMaterial color="#A1887F" />
            </mesh>
          ))}
        </group>
      ))}
      {/* Vertical supports */}
      <mesh position={[-0.38, 0.3, 0]}>
        <boxGeometry args={[0.04, 0.6, 0.3]} />
        <WoodMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[0.38, 0.3, 0]}>
        <boxGeometry args={[0.04, 0.6, 0.3]} />
        <WoodMaterial color="#8D6E63" />
      </mesh>
    </group>
  );
}

export function ShoeCabinet({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.8, 0.3);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Recessed Base/Legs */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.75, 0.1, 0.25]} />
        <meshStandardMaterial color="#1e293b" roughness={1} />
      </mesh>

      {/* Main Body - Charcoal Finish */}
      <group position={[0, 0.55, 0]}>
        <RoundedBox args={[0.8, 0.9, 0.3]} radius={0.01} smoothness={4} castShadow>
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </RoundedBox>
      </group>

      {/* Top Panel - Natural Walnut Wood */}
      <group position={[0, 1.01, 0]}>
        <RoundedBox args={[0.82, 0.04, 0.32]} radius={0.01} smoothness={4} castShadow>
          <meshStandardMaterial color="#5d4037" roughness={0.3} metalness={0.1} />
        </RoundedBox>
      </group>

      {/* Decorative Door Segments */}
      <group position={[0, 0.55, 0.155]}>
        {/* Vertical Split Line */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.005, 0.85, 0.01]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Horizontal Split Lines for tiers */}
        {[0.15, -0.15].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[0.75, 0.005, 0.01]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}

        {/* Polished Chrome Handles */}
        {[[-0.2, 0.3], [0.2, 0.3], [-0.2, 0], [0.2, 0], [-0.2, -0.3], [0.2, -0.3]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.005]} castShadow>
            <boxGeometry args={[0.08, 0.01, 0.01]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function EntrywayBench({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.0, 0.4);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[1.0, 0.4, 0.4]} />
        <WoodMaterial color="#5D4037" />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <RoundedBox args={[0.95, 0.05, 0.38]} radius={0.02}>
          <FabricMaterial color="#E0E0E0" />
        </RoundedBox>
      </mesh>
    </group>
  );
}

export function CoatRack({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
        <MetalMaterial color="#444" />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
        <MetalMaterial color="#333" />
      </mesh>
      {/* Hooks */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 1.6, 0]} rotation={[0.5, (i * Math.PI) / 2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
          <MetalMaterial color="#444" />
        </mesh>
      ))}
    </group>
  );
}

export function UmbrellaStand({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 16, 1, true]} />
        <MetalMaterial color="#B0BEC5" />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
        <MetalMaterial color="#546E7A" />
      </mesh>
    </group>
  );
}

export function Plant({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Pot */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.3, 16]} />
        <meshStandardMaterial color="#8B4513" /> {/* Terracotta */}
      </mesh>
      {/* Earth */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05, 16]} />
        <meshStandardMaterial color="#3d2b1f" />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
      {/* Leaves/Bush */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color="#447a3d" roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.6, 0.1]} rotation={[0.5, 0, 0.5]} castShadow>
        <sphereGeometry args={[0.15, 12, 12]} scale={[1, 0.5, 1]} />
        <meshStandardMaterial color="#4c8a44" />
      </mesh>
      <mesh position={[-0.1, 0.65, -0.05]} rotation={[-0.3, 0, 0.2]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} scale={[1, 0.6, 1]} />
        <meshStandardMaterial color="#4c8a44" />
      </mesh>
    </group>
  );
}

// LAUNDRY ROOM (Additional)
export function WashingMachineBase({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.64, 0.64);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <RoundedBox args={[0.64, 0.1, 0.64]} radius={0.01}>
          <meshStandardMaterial color="#f3f4f6" />
        </RoundedBox>
      </mesh>
      {/* Indentation for the machine */}
      <mesh position={[0, 0.101, 0]}>
        <boxGeometry args={[0.6, 0.01, 0.6]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
    </group>
  );
}

export function DryerStand({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.64, 0.64);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Frame */}
      <mesh position={[-0.3, 0.4, -0.3]} castShadow><boxGeometry args={[0.04, 0.8, 0.04]} /><MetalMaterial color="#4b5563" /></mesh>
      <mesh position={[0.3, 0.4, -0.3]} castShadow><boxGeometry args={[0.04, 0.8, 0.04]} /><MetalMaterial color="#4b5563" /></mesh>
      <mesh position={[-0.3, 0.4, 0.3]} castShadow><boxGeometry args={[0.04, 0.8, 0.04]} /><MetalMaterial color="#4b5563" /></mesh>
      <mesh position={[0.3, 0.4, 0.3]} castShadow><boxGeometry args={[0.04, 0.8, 0.04]} /><MetalMaterial color="#4b5563" /></mesh>
      {/* Shelf */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <RoundedBox args={[0.64, 0.04, 0.64]} radius={0.01}>
          <meshStandardMaterial color="#f9fafb" />
        </RoundedBox>
      </mesh>
    </group>
  );
}

export function IroningBoardCabinet({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.45, 1.4);

  // Custom board shape for realism (Surfboard/Paddle shape)
  const boardShape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 0.38;
    const h = 1.0;
    const noseIdx = 0.65; // Start tapering earlier

    shape.moveTo(-w / 2, 0);
    shape.lineTo(w / 2, 0);
    shape.lineTo(w / 2, h * noseIdx);
    // Smooth taper to a rounded nose
    shape.bezierCurveTo(w / 2, h * 0.9, w * 0.15, h, 0, h);
    shape.bezierCurveTo(-w * 0.15, h, -w / 2, h * 0.9, -w / 2, h * noseIdx);
    shape.closePath();
    return shape;
  }, []);

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.7, 0]}>
        {/* Recessed Wall Cabinet */}
        <RoundedBox args={[0.48, 1.45, 0.2]} radius={0.01} castShadow>
          <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.05} />
        </RoundedBox>

        {/* Interior Cavity Background */}
        <mesh position={[0, 0, 0.081]}>
          <boxGeometry args={[0.44, 1.4, 0.01]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>

        {/* Interior Utility Shelf */}
        <mesh position={[0, 0.4, 0.09]} castShadow>
          <boxGeometry args={[0.35, 0.02, 0.12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* --- HIGH-FIDELITY STEAM IRON --- */}
        <group position={[0, 0.48, 0.12]} rotation={[0, -0.6, 0]}>
          {/* Soleplate */}
          <mesh castShadow>
            <cylinderGeometry args={[0.01, 0.05, 0.01, 3]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#cbd5e1" metalness={1} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, -0.06]} castShadow>
            <boxGeometry args={[0.1, 0.01, 0.12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={1} roughness={0.1} />
          </mesh>
          {/* Water Tank */}
          <mesh position={[0, 0.04, -0.02]} castShadow>
            <RoundedBox args={[0.08, 0.07, 0.18]} radius={0.03}>
              <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} roughness={0.1} />
            </RoundedBox>
          </mesh>
          {/* Handle */}
          <mesh position={[0, 0.09, -0.015]} castShadow>
            <torusGeometry args={[0.05, 0.01, 8, 32, Math.PI]} rotation={[0, Math.PI / 2, 0]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* --- PROFESSIONAL IRONING BOARD --- */}
        <group position={[0, -0.1, 0.1]} rotation={[Math.PI / 2 - 0.05, 0, 0]}>
          {/* Custom Extruded Shape */}
          <mesh castShadow>
            <extrudeGeometry args={[boardShape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01 }]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
          </mesh>

          {/* Metallic Heat Pad */}
          <mesh position={[0, 0.05, 0.021]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 0.15]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} />
          </mesh>

          {/* Folding Mechanism legs */}
          <group position={[0, 0.2, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[0, -0.4, 0.3]} rotation={[0.5, 0, 0]} castShadow>
              <cylinderGeometry args={[0.01, 0.01, 1.0]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
            <mesh position={[0.1, -0.4, 0]} rotation={[0.1, 0, 0.1]} castShadow>
              <cylinderGeometry args={[0.006, 0.006, 0.8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
            <mesh position={[-0.1, -0.4, 0]} rotation={[0.1, 0, -0.1]} castShadow>
              <cylinderGeometry args={[0.006, 0.006, 0.8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
          </group>
        </group>

        {/* Cabinet Door */}
        <group position={[0.24, 0, 0.1]} rotation={[0, -1.5, 0]}>
          <RoundedBox args={[0.48, 1.45, 0.02]} radius={0.005} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.15} />
          </RoundedBox>
          <mesh position={[0, 0, 0.011]}>
            <planeGeometry args={[0.4, 1.3]} />
            <meshPhysicalMaterial
              color="#cbd5e1"
              metalness={1}
              roughness={0}
              reflectivity={1}
            />
          </mesh>
          <mesh position={[-0.21, 0, 0.02]} castShadow>
            <cylinderGeometry args={[0.004, 0.004, 0.4, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={1} />
          </mesh>
          {/* Door Hinges */}
          {[-0.5, 0.5].map((y, i) => (
            <mesh key={i} position={[-0.23, y, -0.01]}>
              <boxGeometry args={[0.01, 0.06, 0.01]} />
              <meshStandardMaterial color="#64748b" metalness={1} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

export function UtilitySink({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.6, 0.5);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Base Cabinet */}
      <group position={[0, 0.4, 0]}>
        <RoundedBox args={[0.6, 0.8, 0.5]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#f3f4f6" roughness={0.5} />
        </RoundedBox>
      </group>
      {/* Front Doors */}
      {[-0.145, 0.145].map((x, i) => (
        <group key={`uso-door-${i}`} position={[x, 0.4, 0.252]}>
          <RoundedBox args={[0.28, 0.75, 0.01]} radius={0.01} smoothness={2} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0.2, 0.01]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.8} />
          </mesh>
        </group>
      ))}
      {/* Metal Sink Tub */}
      <group position={[0, 0.85, 0.05]}>
        <RoundedBox args={[0.55, 0.3, 0.4]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#d1d5db" metalness={0.7} roughness={0.3} />
        </RoundedBox>
      </group>
      {/* Sink Basin Inner Cutout */}
      <mesh position={[0, 0.9, 0.05]} castShadow>
        <boxGeometry args={[0.51, 0.22, 0.36]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Drain */}
      <mesh position={[0, 0.8, 0.05]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 16]} />
        <meshStandardMaterial color="#374151" metalness={0.9} />
      </mesh>
      {/* Tall Faucet Neck */}
      <mesh position={[0, 1.05, -0.2]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 16]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} />
      </mesh>
      {/* Faucet Base/Handles */}
      <mesh position={[0, 0.9, -0.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.05, 16]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.92, -0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} />
      </mesh>
    </group>
  );
}

// BALCONY / TERRACE
export function OutdoorChair({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.6, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Rattan/Wicker Base */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <RoundedBox args={[0.5, 0.3, 0.5]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
        </RoundedBox>
      </mesh>
      {/* Plush White Seat Cushion */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <RoundedBox args={[0.48, 0.1, 0.48]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
        </RoundedBox>
      </mesh>
      {/* Rattan Backrest */}
      <mesh position={[0, 0.55, -0.22]} rotation={[-0.1, 0, 0]} castShadow>
        <RoundedBox args={[0.5, 0.5, 0.08]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
        </RoundedBox>
      </mesh>
      {/* Plush White Back Cushion */}
      <mesh position={[0, 0.6, -0.15]} rotation={[-0.1, 0, 0]} castShadow>
        <RoundedBox args={[0.44, 0.4, 0.1]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
        </RoundedBox>
      </mesh>
      {/* Curved Arms */}
      <mesh position={[-0.23, 0.45, 0]} castShadow><boxGeometry args={[0.04, 0.06, 0.45]} /><meshStandardMaterial color="#8b5a2b" roughness={0.9} /></mesh>
      <mesh position={[0.23, 0.45, 0]} castShadow><boxGeometry args={[0.04, 0.06, 0.45]} /><meshStandardMaterial color="#8b5a2b" roughness={0.9} /></mesh>
    </group>
  );
}

export function OutdoorSofa({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.2, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Rattan/Wicker Base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <RoundedBox args={[1.2, 0.3, 0.6]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
        </RoundedBox>
      </mesh>
      {/* Rattan Backrest Base */}
      <mesh position={[0, 0.45, -0.25]} rotation={[-0.1, 0, 0]} castShadow>
        <RoundedBox args={[1.2, 0.5, 0.1]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
        </RoundedBox>
      </mesh>
      {/* Arms */}
      <mesh position={[-0.57, 0.4, 0]} castShadow><boxGeometry args={[0.06, 0.06, 0.6]} /><meshStandardMaterial color="#8b5a2b" roughness={0.9} /></mesh>
      <mesh position={[0.57, 0.4, 0]} castShadow><boxGeometry args={[0.06, 0.06, 0.6]} /><meshStandardMaterial color="#8b5a2b" roughness={0.9} /></mesh>
      {/* Plush White Seat Cushions */}
      <mesh position={[-0.28, 0.35, 0.05]} castShadow><RoundedBox args={[0.55, 0.1, 0.5]} radius={0.04} smoothness={4}><meshStandardMaterial color="#f8f9fa" roughness={0.8} /></RoundedBox></mesh>
      <mesh position={[0.28, 0.35, 0.05]} castShadow><RoundedBox args={[0.55, 0.1, 0.5]} radius={0.04} smoothness={4}><meshStandardMaterial color="#f8f9fa" roughness={0.8} /></RoundedBox></mesh>
      {/* Plush White Backrest Cushions */}
      <mesh position={[-0.28, 0.55, -0.15]} rotation={[-0.1, 0, 0]} castShadow><RoundedBox args={[0.52, 0.4, 0.1]} radius={0.05} smoothness={4}><meshStandardMaterial color="#f8f9fa" roughness={0.8} /></RoundedBox></mesh>
      <mesh position={[0.28, 0.55, -0.15]} rotation={[-0.1, 0, 0]} castShadow><RoundedBox args={[0.52, 0.4, 0.1]} radius={0.05} smoothness={4}><meshStandardMaterial color="#f8f9fa" roughness={0.8} /></RoundedBox></mesh>
    </group>
  );
}

export function SwingChair({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.8, 0.8);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Heavy Duty Base Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.4, 0.02, 16, 32]} />
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Main Support Pole (Curved representation) */}
      <mesh position={[0, 0.95, -0.35]} rotation={[0.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.9, 16]} />
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Wicker Egg Chair Basket */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        {/* Using a wireframe-like trick via material properties or a basic texture substitute */}
        <meshStandardMaterial color="#d4a373" roughness={0.9} wireframe={false} transparent opacity={0.9} />
      </mesh>
      {/* Cutout (to make it an open egg, simulating by intersecting/placing cushions prominently) */}
      {/* Large Plush Interior Cushion */}
      <mesh position={[0, 0.65, 0.05]} castShadow>
        <sphereGeometry args={[0.32, 32, 32]} scale={[1, 0.8, 1]} />
        <meshStandardMaterial color="#fef08a" roughness={0.9} />
      </mesh>
      {/* Hanging Chain */}
      <mesh position={[0, 1.5, -0.1]} castShadow>
        <cylinderGeometry args={[0.005, 0.005, 0.5, 8]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} />
      </mesh>
    </group>
  );
}

export function Planter({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.5, 0.5);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.4, 16]} />
        <meshStandardMaterial color="#a3a3a3" />
      </mesh>
      {/* Plant */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.25, 12, 12]} scale={[1, 0.8, 1]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
    </group>
  );
}

export function StorageBench({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.2, 0.5);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Wooden Slatted Base Box */}
      <mesh position={[0, 0.225, 0]} castShadow>
        <RoundedBox args={[1.2, 0.45, 0.5]} radius={0.02} smoothness={2}>
          <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
        </RoundedBox>
      </mesh>
      {/* Metallic Handle/Latch */}
      <mesh position={[0, 0.35, 0.26]} castShadow>
        <boxGeometry args={[0.15, 0.02, 0.01]} />
        <meshStandardMaterial color="#374151" metalness={0.7} />
      </mesh>
      {/* Upholstered Seat Cushion Top */}
      <group position={[0, 0.48, 0]}>
        <RoundedBox args={[1.16, 0.08, 0.46]} radius={0.03} smoothness={4} castShadow>
          <meshStandardMaterial color="#e5e7eb" roughness={0.9} />
        </RoundedBox>
      </group>
    </group>
  );
}

export function BarbecueStation({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.2, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Rolling Cabinet Base */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <RoundedBox args={[0.8, 0.6, 0.5]} radius={0.02} smoothness={2}>
          <meshStandardMaterial color="#1f2937" metalness={0.4} roughness={0.5} />
        </RoundedBox>
      </mesh>
      {/* Cabinet Doors */}
      <mesh position={[-0.18, 0.3, 0.255]} castShadow><boxGeometry args={[0.35, 0.45, 0.02]} /><meshStandardMaterial color="#374151" /></mesh>
      <mesh position={[0.18, 0.3, 0.255]} castShadow><boxGeometry args={[0.35, 0.45, 0.02]} /><meshStandardMaterial color="#374151" /></mesh>
      {/* Main Grill Body (Silver Stainless Steel) */}
      <group position={[0, 0.7, 0]}>
        <RoundedBox args={[0.85, 0.2, 0.55]} radius={0.05} smoothness={4} castShadow>
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </RoundedBox>
      </group>
      {/* Grill Lid */}
      <mesh position={[0, 0.85, -0.05]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.85, 32, 1, false, 0, Math.PI]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Handle on Lid */}
      <mesh position={[0, 0.95, 0.15]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Control Knobs */}
      {[-0.2, 0, 0.2].map((x, i) => (
        <mesh key={`knob-${i}`} position={[x, 0.68, 0.28]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}
      {/* Left/Right Prep Tables */}
      <mesh position={[-0.6, 0.68, 0]} castShadow><boxGeometry args={[0.4, 0.04, 0.5]} /><meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0.6, 0.68, 0]} castShadow><boxGeometry args={[0.4, 0.04, 0.5]} /><meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} /></mesh>
    </group>
  );
}

// GARAGE
export function StorageRack({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.2, 0.4);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Vertical posts */}
      <mesh position={[-0.58, 0.75, -0.18]}><boxGeometry args={[0.04, 1.5, 0.04]} /><MetalMaterial color="#374151" /></mesh>
      <mesh position={[0.58, 0.75, -0.18]}><boxGeometry args={[0.04, 1.5, 0.04]} /><MetalMaterial color="#374151" /></mesh>
      <mesh position={[-0.58, 0.75, 0.18]}><boxGeometry args={[0.04, 1.5, 0.04]} /><MetalMaterial color="#374151" /></mesh>
      <mesh position={[0.58, 0.75, 0.18]}><boxGeometry args={[0.04, 1.5, 0.04]} /><MetalMaterial color="#374151" /></mesh>
      {/* Shelves */}
      {[0.1, 0.45, 0.8, 1.15, 1.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <boxGeometry args={[1.2, 0.02, 0.4]} />
          <meshStandardMaterial color="#f3f4f6" />
        </mesh>
      ))}
    </group>
  );
}

export function ToolCabinet({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.6, 0.45);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <RoundedBox args={[0.6, 0.8, 0.45]} radius={0.02}>
          <meshStandardMaterial color="#991b1b" />
        </RoundedBox>
      </mesh>
      {/* Drawer handles */}
      {[0.2, 0.4, 0.6, 0.75].map((y, i) => (
        <mesh key={i} position={[0, y, 0.226]}>
          <boxGeometry args={[0.4, 0.02, 0.01]} />
          <MetalMaterial color="#e5e7eb" />
        </mesh>
      ))}
    </group>
  );
}

export function Workbench({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.2, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1.2, 0.06, 0.6]} />
        <WoodMaterial color="#d4d4d8" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.55, 0.375, -0.25]}><boxGeometry args={[0.08, 0.75, 0.08]} /><MetalMaterial color="#111827" /></mesh>
      <mesh position={[0.55, 0.375, -0.25]}><boxGeometry args={[0.08, 0.75, 0.08]} /><MetalMaterial color="#111827" /></mesh>
      <mesh position={[-0.55, 0.375, 0.25]}><boxGeometry args={[0.08, 0.75, 0.08]} /><MetalMaterial color="#111827" /></mesh>
      <mesh position={[0.55, 0.375, 0.25]}><boxGeometry args={[0.08, 0.75, 0.08]} /><MetalMaterial color="#111827" /></mesh>
      {/* Vise */}
      <mesh position={[-0.6, 0.78, 0.15]}><boxGeometry args={[0.1, 0.1, 0.15]} /><MetalMaterial color="#4b5563" /></mesh>
    </group>
  );
}

export function WallHook({ position, rotation = 0, width, depth }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.5, 0]}><boxGeometry args={[0.15, 0.05, 0.01]} /><MetalMaterial color="#9ca3af" /></mesh>
      <mesh position={[0, 1.45, 0.02]} rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.1]} /><MetalMaterial color="#374151" /></mesh>
    </group>
  );
}

export function BicycleStand({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.8, 0.35);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.02, -0.1]}><boxGeometry args={[0.8, 0.04, 0.04]} /><MetalMaterial color="#4b5563" /></mesh>
      <mesh position={[0, 0.02, 0.1]}><boxGeometry args={[0.8, 0.04, 0.04]} /><MetalMaterial color="#4b5563" /></mesh>
      {/* Bars */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <group key={i} position={[x, 0.2, 0]}>
          <mesh position={[0, 0, -0.05]}><boxGeometry args={[0.02, 0.4, 0.02]} /><MetalMaterial color="#6b7280" /></mesh>
          <mesh position={[0, 0, 0.05]}><boxGeometry args={[0.02, 0.4, 0.02]} /><MetalMaterial color="#6b7280" /></mesh>
        </group>
      ))}
    </group>
  );
}

export function GuestDoubleBed({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.6, 2.0);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Bed Frame */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.2, 2.0]} />
        <WoodMaterial color="#8B4513" />
      </mesh>

      {/* Mattress */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.2, 1.9]} />
        <FabricMaterial color="#FFFFFF" />
      </mesh>

      {/* Headboard */}
      <mesh position={[0, 0.7, -0.95]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.8, 0.1]} />
        <WoodMaterial color="#8B4513" />
      </mesh>

      {/* Pillows */}
      <group>
        <mesh position={[-0.4, 0.45, -0.7]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.2, 0.4]} />
          <FabricMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.4, 0.45, -0.7]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.2, 0.4]} />
          <FabricMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Duvet */}
      <mesh position={[0, 0.4, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.1, 1.5]} />
        <FabricMaterial color="#F0F0F0" />
      </mesh>
    </group>
  );
}

export function GuestSingleBed({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.0, 2.0);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Bed Frame */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.2, 2.0]} />
        <WoodMaterial color="#8B4513" />
      </mesh>

      {/* Mattress */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.2, 1.9]} />
        <FabricMaterial color="#FFFFFF" />
      </mesh>

      {/* Headboard */}
      <mesh position={[0, 0.7, -0.95]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.8, 0.1]} />
        <WoodMaterial color="#8B4513" />
      </mesh>

      {/* Pillow */}
      <mesh position={[0, 0.45, -0.7]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.2, 0.4]} />
        <FabricMaterial color="#FFFFFF" />
      </mesh>

      {/* Duvet */}
      <mesh position={[0, 0.4, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.1, 1.5]} />
        <FabricMaterial color="#F0F0F0" />
      </mesh>
    </group>
  );
}

export function GuestWardrobe({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.5, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2, 0.6]} />
        <WoodMaterial color="#A0522D" />
      </mesh>
      {/* Doors */}
      <mesh position={[-0.375, 1, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 1.9, 0.05]} />
        <WoodMaterial color="#B5651D" />
      </mesh>
      <mesh position={[0.375, 1, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 1.9, 0.05]} />
        <WoodMaterial color="#B5651D" />
      </mesh>
    </group>
  );
}

export function GuestBedsideTable({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.5, 0.4);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.6, 0.4]} />
        <WoodMaterial color="#A0522D" />
      </mesh>
      {/* Drawer */}
      <mesh position={[0, 0.4, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.15, 0.05]} />
        <WoodMaterial color="#B5651D" />
      </mesh>
    </group>
  );
}

export function GuestStudyDesk({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.2, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Desk Top */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.05, 0.6]} />
        <WoodMaterial color="#A0522D" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.55, 0.375, -0.25]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <MetalMaterial color="#333333" />
      </mesh>
      <mesh position={[0.55, 0.375, -0.25]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <MetalMaterial color="#333333" />
      </mesh>
    </group>
  );
}

export function GuestStudyChair({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.45, 0.45);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.1, 0.45]} />
        <FabricMaterial color="#CCCCCC" />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.8, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.4, 0.05]} />
        <FabricMaterial color="#CCCCCC" />
      </mesh>
      {/* Legs */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
        <MetalMaterial color="#333333" />
      </mesh>
    </group>
  );
}

export function GuestWallMirror({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.8, 0.05);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 1, 0.05]} />
        <WoodMaterial color="#A0522D" />
      </mesh>
      <mesh position={[0, 1.2, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.9, 0.01]} />
        <GlassMaterial />
      </mesh>
    </group>
  );
}

export function GuestLuggageRack({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.8, 0.5);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Frame */}
      <mesh position={[-0.35, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.8, 0.5]} />
        <WoodMaterial color="#A0522D" />
      </mesh>
      <mesh position={[0.35, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.8, 0.5]} />
        <WoodMaterial color="#A0522D" />
      </mesh>
      {/* Straps */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <FabricMaterial color="#555555" />
      </mesh>
    </group>
  );
}

export const DisplayCabinet = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.9, 0.4);

  const darkWood = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#3f3222",
    roughness: 0.5,
    metalness: 0.1,
  }), []);

  const cabinetGlass = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#e8e8e8",
    transparent: true,
    opacity: 0.2,
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.9,
    thickness: 0.03,
  }), []);

  const metalHandle = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#555555",
    roughness: 0.2,
    metalness: 1.0,
  }), []);

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 0.9, 0]}>
        <RoundedBox args={[0.9, 1.8, 0.4]} radius={0.02} smoothness={4} castShadow>
          <primitive object={darkWood} />
        </RoundedBox>
      </group>

      <group position={[0, 0.9, 0.18]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 1.7, 0.02]} />
          <primitive object={cabinetGlass} />
        </mesh>
      </group>

      {[0.5, 1.0, 1.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <boxGeometry args={[0.85, 0.02, 0.35]} />
          <primitive object={darkWood} />
        </mesh>
      ))}

      <group position={[0.35, 0.9, 0.19]}>
        <RoundedBox args={[0.03, 0.3, 0.03]} radius={0.01} smoothness={4} castShadow>
          <primitive object={metalHandle} />
        </RoundedBox>
      </group>
    </group>
  );
});

export const ChandelierPendantLight = memo(({ position, rotation = 0, width, depth }) => {
  const scale = getScale(width, depth, 0.7, 0.7);

  const darkMetal = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#2c2c2c",
    roughness: 0.3,
    metalness: 0.9,
  }), []);

  const emissiveLight = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffdcb4",
    emissive: "#ff9a24",
    emissiveIntensity: 3,
  }), []);

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 2.45, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
        <primitive object={darkMetal} />
      </mesh>

      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <primitive object={darkMetal} />
      </mesh>

      <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.05, 16, 100]} />
        <primitive object={emissiveLight} />
      </mesh>

      <mesh position={[0, 1.95, 0]}>
        <torusGeometry args={[0.35, 0.02, 16, 100]} />
        <primitive object={darkMetal} />
      </mesh>
    </group>
  );
});

export const FurnitureComponents = {
  'displayCabinet': DisplayCabinet,
  'chandelier': ChandelierPendantLight,
  'diningChair': VisitorChair,
  'diningBench': EntrywayBench,
  'buffetCabinet': DisplayCabinet,
  'crockeryCabinet': DisplayCabinet,
  'barCabinet': DisplayCabinet,
  'vanityCabinet': Cabinet,
  'singleBad': SingleBed,
  'bad': DoubleBed,
  'wordrobe': Wardrobe,
  'sofa': Sofa,
  'tv': TV,
  'roundTable': RoundTable,
  'table': RectangularTable,
  'table2': RectangularTable,
  'stove': Stove,
  'sink': Sink,
  'worktop': Worktop,
  'cabinet': Cabinet,
  'toilet': Toilet,
  'bath': Bath,
  'door': Door,
  'window': Window,
  'flower': Plant,
  'flower2': Plant,
  'lShapeSofa': LShapeSofa,
  'armchair': Armchair,
  'reclinerChair': ReclinerChair,
  'ottoman': Ottoman,
  'coffeeTable': CoffeeTable,
  'sideTable': SideTable,
  'bookshelf': Bookshelf,
  'rug': Rug,
  'lamp': FloorLamp,
  'curtains': Curtains,
  'baseCabinet': BaseCabinet,
  'wallCabinet': WallCabinet,
  'tallPantryUnit': TallPantryUnit,
  'kitchenIsland': KitchenIsland,
  'breakfastCounter': BreakfastCounter,
  'barStool': BarStool,
  'spiceRack': SpiceRack,
  'pullOutBasket': PullOutBasket,
  'plateRack': PlateRack,
  'refrigerator': Refrigerator,
  'kingBed': KingBed,
  'headboard': Headboard,
  'bedsideTable': BedsideTable,
  'wardrobeSliding': WardrobeSliding,
  'wardrobeHinged': WardrobeHinged,
  'walkInCloset': WalkInCloset,
  'dresser': Dresser,
  'chestOfDrawers': ChestOfDrawers,
  'vanityTable': VanityTable,
  'accentChair': AccentChair,
  // New items
  'guestDoubleBed': GuestDoubleBed,
  'guestSingleBed': GuestSingleBed,
  'guestWardrobe': GuestWardrobe,
  'guestBedsideTable': GuestBedsideTable,
  'studyDesk': StudyDesk,
  'studyChair': StudyChair,
  'wallMirror': WallMirror,
  'luggageRack': LuggageRack,
  'bunkBed': BunkBed,
  'toyStorage': ToyStorage,
  'beanBag': BeanBag,
  'pinBoard': PinBoard,
  'mirrorCabinet': MirrorCabinet,
  'showerEnclosure': ShowerEnclosure,
  'towelRack': TowelRack,
  'medicineCabinet': MedicineCabinet,
  'laundryBasket': LaundryBasket,
  'washingMachine': WashingMachine,
  'studyTable': StudyDesk,
  'toyStorageUnit': ToyStorage,
  // Home Office
  'officeDesk': OfficeDesk,
  'executiveDesk': ExecutiveDesk,
  'studyTableOffice': OfficeDesk,
  'ergonomicChair': ErgonomicChair,
  'visitorChair': VisitorChair,
  'filingCabinet': FilingCabinet,
  'wallShelves': WallShelves,
  'deskLamp': DeskLamp,
  'whiteboard': Whiteboard,
  'desktopLaptop': DesktopLaptop,
  // Entryway
  'consoleTable': ConsoleTable,
  'shoeRack': ShoeRack,
  'shoeCabinet': ShoeCabinet,
  'entrywayBench': EntrywayBench,
  'coatRack': CoatRack,
  'umbrellaStand': UmbrellaStand,
  'washingMachineBase': WashingMachineBase,
  'dryerStand': DryerStand,
  'ironingBoardCabinet': IroningBoardCabinet,
  'utilitySink': UtilitySink,
  'outdoorChair': OutdoorChair,
  'outdoorSofa': OutdoorSofa,
  'swingChair': SwingChair,
  'planter': Planter,
  'storageBench': StorageBench,
  'barbecueStation': BarbecueStation,
  'storageRack': StorageRack,
  'toolCabinet': ToolCabinet,
  'workbench': Workbench,
  'wallHook': WallHook,
  'bicycleStand': BicycleStand,
};
