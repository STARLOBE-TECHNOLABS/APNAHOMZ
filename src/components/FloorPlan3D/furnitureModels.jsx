// ============================================
// FILE: src/components/FloorPlan3D/furnitureModels.jsx
// All furniture 3D models for your FloorLiteDemo
// ============================================

import React from 'react';
import { RoundedBox } from '@react-three/drei';

// Helper to calculate scale based on props vs default size
// w: prop width, d: prop depth (Z), defW: default width, defD: default depth
const getScale = (w, d, defW, defD) => [w ? w / defW : 1, 1, d ? d / defD : 1];

// Shared Materials
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
    transmission={0.6} // Add glass-like refraction
    thickness={0.1}
  />
);

// BEDROOM FURNITURE
export function SingleBed({ position, rotation = 0, width, depth }) {
  const scale = getScale(depth, width, 1.9, 1); 
  return (
    <group position={position} rotation={[0, rotation - Math.PI / 2, 0]} scale={scale}>
      {/* Legs */}
      {[[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]].map(([x, z], i) => (
         <mesh key={i} position={[x, 0.15, z]} castShadow>
           <cylinderGeometry args={[0.04, 0.03, 0.3, 8]} />
           <WoodMaterial color="#3d2817" />
         </mesh>
      ))}
      {/* Frame */}
      <group position={[0, 0.35, 0]}>
         <RoundedBox args={[1.9, 0.2, 1]} radius={0.02} smoothness={4} castShadow>
            <WoodMaterial color="#5a7fa6" />
         </RoundedBox>
      </group>
      {/* Mattress */}
      <group position={[0, 0.5, 0]}>
        <RoundedBox args={[1.85, 0.25, 0.95]} radius={0.05} smoothness={4} castShadow>
           <FabricMaterial color="#ffffff" />
        </RoundedBox>
      </group>
      {/* Headboard */}
      <group position={[-0.92, 0.7, 0]}>
        <RoundedBox args={[0.08, 0.9, 1.05]} radius={0.02} smoothness={4} castShadow>
          <WoodMaterial color="#3d5a80" />
        </RoundedBox>
      </group>
      {/* Pillow */}
      <group position={[-0.7, 0.65, 0]}>
         <RoundedBox args={[0.3, 0.1, 0.6]} radius={0.05} smoothness={4} castShadow>
           <FabricMaterial color="#eeeeee" />
         </RoundedBox>
      </group>
    </group>
  );
}

export function DoubleBed({ position, rotation = 0, width, depth }) {
  const scale = getScale(depth, width, 2.6, 2);
  return (
    <group position={position} rotation={[0, rotation - Math.PI / 2, 0]} scale={scale}>
      {/* Legs */}
       {[[-1.2, -0.9], [1.2, -0.9], [-1.2, 0.9], [1.2, 0.9]].map(([x, z], i) => (
         <mesh key={i} position={[x, 0.15, z]} castShadow>
           <cylinderGeometry args={[0.05, 0.04, 0.3, 8]} />
           <WoodMaterial color="#1a1a1a" />
         </mesh>
      ))}
      {/* Frame */}
      <group position={[0, 0.35, 0]}>
         <RoundedBox args={[2.6, 0.2, 2]} radius={0.02} smoothness={4} castShadow>
            <WoodMaterial color="#2c3e50" />
         </RoundedBox>
      </group>
      {/* Mattress */}
      <group position={[0, 0.5, 0]}>
        <RoundedBox args={[2.55, 0.3, 1.95]} radius={0.05} smoothness={4} castShadow>
          <FabricMaterial color="#ffffff" />
        </RoundedBox>
      </group>
      {/* Headboard */}
      <group position={[-1.28, 0.75, 0]}>
        <RoundedBox args={[0.1, 1.1, 2.1]} radius={0.02} smoothness={4} castShadow>
          <WoodMaterial color="#2c3e50" />
        </RoundedBox>
      </group>
      {/* Pillows */}
      <group position={[-1.1, 0.7, -0.5]}>
        <RoundedBox args={[0.4, 0.15, 0.6]} radius={0.05} smoothness={4} castShadow>
          <FabricMaterial color="#eeeeee" />
        </RoundedBox>
      </group>
      <group position={[-1.1, 0.7, 0.5]}>
        <RoundedBox args={[0.4, 0.15, 0.6]} radius={0.05} smoothness={4} castShadow>
          <FabricMaterial color="#eeeeee" />
        </RoundedBox>
      </group>
    </group>
  );
}

export function Wardrobe({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.5, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Main body */}
      <group position={[0, 1, 0]}>
        <RoundedBox args={[1.5, 2, 0.6]} radius={0.02} smoothness={4} castShadow>
           <WoodMaterial color="#8B7355" />
        </RoundedBox>
      </group>
      {/* Doors */}
      <group position={[-0.38, 1, 0.31]}>
        <RoundedBox args={[0.72, 1.95, 0.03]} radius={0.01} smoothness={2} castShadow>
           <WoodMaterial color="#654321" />
        </RoundedBox>
      </group>
      <group position={[0.38, 1, 0.31]}>
        <RoundedBox args={[0.72, 1.95, 0.03]} radius={0.01} smoothness={2} castShadow>
           <WoodMaterial color="#654321" />
        </RoundedBox>
      </group>
      {/* Handles */}
      <mesh position={[-0.2, 1, 0.33]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        <MetalMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0.2, 1, 0.33]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        <MetalMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}

// LIVING ROOM FURNITURE
export function Sofa({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 2.2, 0.9);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Legs */}
       {[[-1, -0.35], [1, -0.35], [-1, 0.35], [1, 0.35]].map(([x, z], i) => (
         <mesh key={i} position={[x, 0.1, z]} castShadow>
           <cylinderGeometry args={[0.05, 0.04, 0.2, 8]} />
           <WoodMaterial color="#3d2817" />
         </mesh>
      ))}
      {/* Seat base */}
      <group position={[0, 0.45, 0]}>
        <RoundedBox args={[2.2, 0.5, 0.9]} radius={0.05} smoothness={4} castShadow>
          <FabricMaterial color="#8b4513" />
        </RoundedBox>
      </group>
      {/* Backrest */}
      <group position={[0, 0.85, -0.35]}>
        <RoundedBox args={[2.2, 0.8, 0.2]} radius={0.05} smoothness={4} castShadow>
          <FabricMaterial color="#8b4513" />
        </RoundedBox>
      </group>
      {/* Left arm */}
      <group position={[-1.05, 0.65, 0]}>
        <RoundedBox args={[0.2, 0.6, 0.9]} radius={0.05} smoothness={4} castShadow>
           <FabricMaterial color="#8b4513" />
        </RoundedBox>
      </group>
      {/* Right arm */}
      <group position={[1.05, 0.65, 0]}>
        <RoundedBox args={[0.2, 0.6, 0.9]} radius={0.05} smoothness={4} castShadow>
           <FabricMaterial color="#8b4513" />
        </RoundedBox>
      </group>
      {/* Cushions */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <group key={i} position={[x, 0.72, 0]}>
          <RoundedBox args={[0.55, 0.15, 0.75]} radius={0.05} smoothness={4} castShadow>
             <FabricMaterial color="#a0522d" />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}

export function TV({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.4, 0.3); // Depth is stand depth
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Screen */}
      <group position={[0, 0.9, 0]}>
        <RoundedBox args={[1.4, 0.8, 0.05]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
        </RoundedBox>
      </group>
      {/* Screen bezel */}
      <mesh position={[0, 0.9, 0.026]}>
        <boxGeometry args={[1.45, 0.85, 0.001]} />
        <meshStandardMaterial color="#000000" roughness={0.5} />
      </mesh>
      {/* Stand base */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.1, 16]} />
        <MetalMaterial color="#2c2c2c" />
      </mesh>
      {/* Stand neck */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 12]} />
        <MetalMaterial color="#2c2c2c" />
      </mesh>
    </group>
  );
}

// TABLES
export function RoundTable({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.3, 1.3);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Tabletop */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.05, 32]} />
        <WoodMaterial color="#d4a574" />
      </mesh>
      {/* Center leg */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.75, 12]} />
        <WoodMaterial color="#8b6f47" />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 16]} />
        <WoodMaterial color="#8b6f47" />
      </mesh>
    </group>
  );
}

export function RectangularTable({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.8, 0.9);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Tabletop */}
      <group position={[0, 0.75, 0]}>
        <RoundedBox args={[1.8, 0.05, 0.9]} radius={0.01} smoothness={2} castShadow>
           <WoodMaterial color="#d4a574" />
        </RoundedBox>
      </group>
      {/* Four legs */}
      {[
        [0.8, 0.3], [-0.8, 0.3], [0.8, -0.3], [-0.8, -0.3]
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.38, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.75, 8]} />
          <WoodMaterial color="#8b6f47" />
        </mesh>
      ))}
    </group>
  );
}

// KITCHEN & BATHROOM
export function Stove({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.6, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Main body */}
      <group position={[0, 0.45, 0]}>
        <RoundedBox args={[0.6, 0.9, 0.6]} radius={0.02} smoothness={2} castShadow>
           <MetalMaterial color="#e8e8e8" />
        </RoundedBox>
      </group>
      {/* Cooktop */}
      <mesh position={[0, 0.91, 0]}>
        <boxGeometry args={[0.58, 0.02, 0.58]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
      </mesh>
      {/* Burners */}
      {[[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.93, z]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
      {/* Oven door */}
      <group position={[0, 0.3, 0.31]}>
        <RoundedBox args={[0.55, 0.5, 0.02]} radius={0.01} smoothness={2} castShadow>
           <GlassMaterial color="#222222" opacity={0.8} />
        </RoundedBox>
      </group>
       {/* Handle */}
       <mesh position={[0, 0.5, 0.33]}>
        <boxGeometry args={[0.4, 0.03, 0.03]} />
        <MetalMaterial color="#dddddd" />
      </mesh>
    </group>
  );
}

export function Sink({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.7, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Counter */}
      <group position={[0, 0.45, 0]}>
         <RoundedBox args={[0.7, 0.9, 0.6]} radius={0.02} smoothness={2} castShadow>
            <WoodMaterial color="#c0c0c0" />
         </RoundedBox>
      </group>
      {/* Sink basin */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.15, 24]} />
        <MetalMaterial color="#8899aa" />
      </mesh>
      {/* Faucet base */}
      <mesh position={[0, 0.93, -0.15]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.08, 12]} />
        <MetalMaterial color="#708090" />
      </mesh>
      {/* Faucet spout */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.025, 0.2, 12]} />
        <MetalMaterial color="#708090" />
      </mesh>
    </group>
  );
}

export function Worktop({ position, rotation = 0, width, depth }) {
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
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.8, 0.02, 0.5]} />
          <MetalMaterial color="#8899aa" />
        </mesh>
        {/* Inner Basin Depth Effect (Darker slightly smaller box on top) */}
        <mesh position={[0, 0.02, 0]}>
           <boxGeometry args={[0.7, 0.01, 0.4]} />
           <meshStandardMaterial color="#556677" roughness={0.2} />
        </mesh>
        {/* Faucet */}
        <group position={[0, 0.05, -0.2]}>
           <mesh position={[0, 0.1, 0]}>
             <cylinderGeometry args={[0.02, 0.03, 0.2, 8]} />
             <MetalMaterial color="#c0c0c0" />
           </mesh>
           <mesh position={[0, 0.2, 0.1]} rotation={[Math.PI/4, 0, 0]}>
             <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
             <MetalMaterial color="#c0c0c0" />
           </mesh>
        </group>
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
}

export function Cabinet({ position, rotation = 0, width, depth }) {
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
}

export function Toilet({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.45, 0.6);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Bowl */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.5, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.61, 0]}>
        <torusGeometry args={[0.25, 0.04, 16, 32]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.2} />
      </mesh>
      {/* Tank */}
      <group position={[0, 0.75, -0.22]}>
         <RoundedBox args={[0.45, 0.6, 0.2]} radius={0.05} smoothness={4} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
         </RoundedBox>
      </group>
      {/* Flush handle */}
      <mesh position={[0.23, 0.9, -0.2]}>
        <boxGeometry args={[0.03, 0.08, 0.02]} />
        <MetalMaterial color="#c0c0c0" />
      </mesh>
    </group>
  );
}

export function Bath({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 1.8, 0.85);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Tub body */}
      <group position={[0, 0.35, 0]}>
        <RoundedBox args={[1.8, 0.6, 0.85]} radius={0.1} smoothness={8} castShadow>
           <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </RoundedBox>
      </group>
      {/* Inner tub */}
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[1.7, 0.05, 0.75]} />
        <meshStandardMaterial color="#f0f8ff" roughness={0.1} />
      </mesh>
      {/* Faucet */}
      <mesh position={[0, 0.7, -0.38]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 12]} />
        <MetalMaterial color="#c0c0c0" />
      </mesh>
    </group>
  );
}

// STRUCTURAL
export function Door({ position, rotation = 0, width, depth, flip }) {
  const scale = getScale(width, depth, 1, 0.1);
  // Mirror if flipped to change door handing
  if (flip) scale[0] *= -1;
  
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group position={[0, 1.05, 0]}>
        <RoundedBox args={[1, 2.1, 0.05]} radius={0.02} smoothness={4} castShadow>
          <WoodMaterial color="#5c4033" />
        </RoundedBox>
        <mesh position={[0.35, 0, 0.04]}>
          <sphereGeometry args={[0.03]} />
          <MetalMaterial color="#FFD700" />
        </mesh>
      </group>
    </group>
  );
}

export function Window({ position, rotation = 0, width }) {
  // Parametric Window
  const w = width || 1.2;
  const h = 1.2; // Height matches Wall hole
  const sillHeight = 0.9;
  const wallThickness = 0.15;
  
  // Frame dimensions
  const frameW = 0.05; // Width of the frame profile
  const frameD = 0.16; // Depth of frame (slightly deeper than wall)

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Center the window vertically in the hole */}
      <group position={[0, sillHeight + h/2, 0]}>
        
        {/* Outer Frame (Jamb) */}
        {/* Bottom Sill */}
        <mesh position={[0, -h/2 + frameW/2, 0]} castShadow>
           <boxGeometry args={[w + 0.1, frameW, frameD + 0.05]} /> {/* Protruding Sill */}
           <WoodMaterial color="#ffffff" />
        </mesh>
        {/* Top Header */}
        <mesh position={[0, h/2 - frameW/2, 0]} castShadow>
           <boxGeometry args={[w, frameW, frameD]} />
           <WoodMaterial color="#ffffff" />
        </mesh>
        {/* Left Side */}
        <mesh position={[-w/2 + frameW/2, 0, 0]} castShadow>
           <boxGeometry args={[frameW, h - frameW*2, frameD]} />
           <WoodMaterial color="#ffffff" />
        </mesh>
        {/* Right Side */}
        <mesh position={[w/2 - frameW/2, 0, 0]} castShadow>
           <boxGeometry args={[frameW, h - frameW*2, frameD]} />
           <WoodMaterial color="#ffffff" />
        </mesh>

        {/* Inner Sash (The part holding the glass) */}
        <group>
           <mesh position={[0, 0, 0]}>
              {/* Top Sash */}
              <boxGeometry args={[w - frameW*2, frameW, 0.05]} />
           </mesh>
           {/* We'll just do a simple glass pane for modern look, minimal sash */}
           <mesh position={[0, 0, 0]}>
             <boxGeometry args={[w - frameW*2, h - frameW*2, 0.02]} />
             <GlassMaterial color="#aaddff" opacity={0.3} />
           </mesh>
           
           {/* Muntins / Grid (Optional - make them thin) */}
           <mesh position={[0, 0, 0.015]}>
              <boxGeometry args={[w - frameW*2, 0.02, 0.01]} /> {/* Horizontal */}
              <WoodMaterial color="#ffffff" />
           </mesh>
           <mesh position={[0, 0, 0.015]}>
              <boxGeometry args={[0.02, h - frameW*2, 0.01]} /> {/* Vertical */}
              <WoodMaterial color="#ffffff" />
           </mesh>
        </group>

      </group>
    </group>
  );
}

// DECOR
export function Plant({ position, rotation = 0, width, depth }) {
  const scale = getScale(width, depth, 0.4, 0.4);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Pot */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.35, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.02, 16]} />
        <meshStandardMaterial color="#3d2817" roughness={1} />
      </mesh>
      {/* Plant leaves (sphere cluster) */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#228B22" roughness={0.6} />
      </mesh>
      <mesh position={[-0.15, 0.7, 0.1]} castShadow>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#32CD32" roughness={0.6} />
      </mesh>
      <mesh position={[0.15, 0.65, -0.1]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.6} />
      </mesh>
    </group>
  );
}

// FURNITURE COMPONENT MAPPER
export const FurnitureComponents = {
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
};
