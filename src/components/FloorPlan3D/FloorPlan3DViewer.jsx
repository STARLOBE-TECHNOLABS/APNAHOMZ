import React, { useState, Suspense, useMemo, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid as ThreeGrid, Environment, PointerLockControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { BiDownload } from 'react-icons/bi';
import { ComplexWall } from './Wall';
import { FurnitureComponents } from './furnitureModels';

const SCALE = 0.02; // Global scale for 2D to 3D conversion

// Helper to calculate plan bounds
const getPlanBounds = (plan) => {
  if (!plan || (!plan.walls?.length && !plan.items?.length)) {
    return null;
  }

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let hasData = false;

  // Check walls
  plan.walls?.forEach(group => {
    group.walls.forEach(w => {
      minX = Math.min(minX, w.x1, w.x2);
      maxX = Math.max(maxX, w.x1, w.x2);
      minY = Math.min(minY, w.y1, w.y2);
      maxY = Math.max(maxY, w.y1, w.y2);
      hasData = true;
    });
  });

  // Check items
  plan.items?.forEach(i => {
    minX = Math.min(minX, i.x);
    maxX = Math.max(maxX, i.x + (i.width || 0));
    minY = Math.min(minY, i.y);
    maxY = Math.max(maxY, i.y + (i.height || 0));
    hasData = true;
  });

  if (!hasData) return null;

  return { minX, maxX, minY, maxY };
};

function FirstPersonController({ onLock, onUnlock }) {
  const { camera } = useThree();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    const onKeyDown = (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': setMoveForward(true); break;
        case 'ArrowLeft':
        case 'KeyA': setMoveLeft(true); break;
        case 'ArrowDown':
        case 'KeyS': setMoveBackward(true); break;
        case 'ArrowRight':
        case 'KeyD': setMoveRight(true); break;
      }
    };
    const onKeyUp = (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': setMoveForward(false); break;
        case 'ArrowLeft':
        case 'KeyA': setMoveLeft(false); break;
        case 'ArrowDown':
        case 'KeyS': setMoveBackward(false); break;
        case 'ArrowRight':
        case 'KeyD': setMoveRight(false); break;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (moveForward || moveBackward || moveLeft || moveRight) {
      const speed = 10 * delta; // Adjust walking speed

      // Get camera direction (ignoring Y for floor movement)
      const frontVector = new THREE.Vector3(0, 0, Number(moveBackward) - Number(moveForward));
      const sideVector = new THREE.Vector3(Number(moveLeft) - Number(moveRight), 0, 0);

      direction.current
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(speed)
        .applyEuler(camera.rotation);
      
      // Flatten movement on Y axis to prevent flying into ground/sky
      // We want to move on XZ plane relative to camera look
      // But simple applyEuler makes us fly if we look up.
      // Better approach for FPS:
      // Forward moves in the direction projected on XZ.
      
      // Let's use a simpler approach that works well:
      // Move camera.position based on direction
      
      // Correct projection for "walking":
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      camDir.y = 0;
      camDir.normalize();

      const camSide = new THREE.Vector3();
      camSide.crossVectors(camera.up, camDir).normalize(); // Left vector?
      // Actually cross(up, fwd) is Left (or Right depending on system).
      // Standard: Right = Cross(Fwd, Up)? No, Cross(Up, Fwd) is Left?
      // Let's trust ThreeJS: 
      // Right is cross(dir, up).
      
      const moveVec = new THREE.Vector3();
      
      if (moveForward) moveVec.add(camDir);
      if (moveBackward) moveVec.sub(camDir);
      if (moveRight) moveVec.add(new THREE.Vector3().crossVectors(camera.up, camDir).negate()); // Right
      if (moveLeft) moveVec.add(new THREE.Vector3().crossVectors(camera.up, camDir)); // Left

      moveVec.normalize().multiplyScalar(speed);

      camera.position.x += moveVec.x;
      camera.position.z += moveVec.z;
      
      // Lock Y height
      camera.position.y = 1.7;
    }
  });

  return <PointerLockControls onLock={onLock} onUnlock={onUnlock} />;
}

// The infinite ground plane
function Ground({ width = 100, depth = 100 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color="#eeeeee" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

// The specific floor for the room(s)
function RoomFloor({ bounds, color }) {
  const { minX, maxX, minY, maxY } = bounds;
  const width = (maxX - minX) * SCALE;
  const depth = (maxY - minY) * SCALE;
  const centerX = ((minX + maxX) / 2) * SCALE;
  const centerZ = ((minY + maxY) / 2) * SCALE;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, -0.01, centerZ]} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

// Helper to calculate distance from point to line segment
function distancePointToSegment(px, py, x1, y1, x2, y2) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq !== 0) // in case of 0 length line
      param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  }
  else if (param > 1) {
    xx = x2;
    yy = y2;
  }
  else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

function Scene3D({ plan, floorColor }) {
  const walls = plan?.walls || [];
  const items = plan?.items || [];
  const bounds = useMemo(() => getPlanBounds(plan), [plan]);

  // Separate items into furniture and structural openings (doors/windows)
  const { furniture, openings } = useMemo(() => {
    const furniture = [];
    const openings = [];
    items.forEach(item => {
      if (item.type === 'door' || item.type === 'window') {
        openings.push(item);
      } else {
        furniture.push(item);
      }
    });
    return { furniture, openings };
  }, [items]);

  // Assign openings to walls
  const wallOpeningsMap = useMemo(() => {
    const map = {};
    openings.forEach(opening => {
      let bestDist = Infinity;
      let bestWallKey = null;

      walls.forEach((wallGroup, wIndex) => {
        wallGroup.walls.forEach((segment, sIndex) => {
            const dist = distancePointToSegment(opening.x, opening.y, segment.x1, segment.y1, segment.x2, segment.y2);
            // Threshold: 20 units (pixels)
            if (dist < 20 && dist < bestDist) {
                 bestDist = dist;
                 bestWallKey = `${wIndex}-${sIndex}`;
            }
        });
      });

      if (bestWallKey) {
          if (!map[bestWallKey]) map[bestWallKey] = [];
          map[bestWallKey].push(opening);
      }
    });
    return map;
  }, [walls, openings]);

  return (
    <>
      {/* Atmosphere */}
      <fog attach="fog" args={['#202020', 5, 60]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 15, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      
      {/* Contact Shadows for grounding */}
      <ContactShadows 
        resolution={1024} 
        scale={100} 
        blur={2} 
        opacity={0.5} 
        far={10} 
        color="#000000" 
      />

      {/* Ground Plane (World) */}
      <Ground width={100} depth={100} />

      {/* Room Floor (Interior) */}
      {bounds && <RoomFloor bounds={bounds} color={floorColor} />}

      {/* Walls from your floor plan data */}
      {walls.map((wallGroup, wallIndex) => (
         wallGroup.walls.map((segment, i) => {
          const key = `${wallIndex}-${i}`;
          const assignedOpenings = wallOpeningsMap[key] || [];
          
          return (
            <ComplexWall
              key={key}
              start={{ x: segment.x1, y: segment.y1 }}
              end={{ x: segment.x2, y: segment.y2 }}
              holes={assignedOpenings}
              scale={SCALE}
              height={2.5}
              thickness={0.15}
              color={wallGroup.color} 
            />
          );
        })
      ))}

      {/* Furniture from your floor plan data */}
      {furniture.map((item) => {
        const FurnitureComponent = FurnitureComponents[item.type];
        if (!FurnitureComponent) {
          return null;
        }

        const centerX = item.x + (item.width || 0) / 2;
        const centerY = item.y + (item.height || 0) / 2;

        const position = [centerX * SCALE, 0, centerY * SCALE];
        const width = item.width ? item.width * SCALE : undefined;
        const depth = item.height ? item.height * SCALE : undefined;

        return (
          <FurnitureComponent
            key={item.id}
            position={position}
            rotation={(-item.rotation * Math.PI) / 180} 
            width={width}
            depth={depth}
          />
        );
      })}

      {/* Structural Items (Doors/Windows 3D models) */}
      {openings.map((item) => {
         const FurnitureComponent = FurnitureComponents[item.type];
         if (!FurnitureComponent) return null;

         const centerX = item.x + (item.width || 0) / 2;
         const centerY = item.y + (item.height || 0) / 2;

         const position = [centerX * SCALE, 0, centerY * SCALE];
         const width = item.width ? item.width * SCALE : undefined;
         
         return (
          <FurnitureComponent
            key={item.id}
            position={position}
            rotation={(-item.rotation * Math.PI) / 180}
            width={width}
            flip={item.flip}
          />
        );
      })}

      {/* Environment lighting for better visuals */}
      <Environment preset="apartment" background={false} />
    </>
  );
}

export default function FloorPlan3DViewer({ plan }) {
  const [view, setView] = useState('perspective');
  const [isLocked, setIsLocked] = useState(false);
  const [floorColor, setFloorColor] = useState('#808080');
  const glRef = useRef(null);

  // Calculate the center and size of the floor plan content
  const { center, maxDim } = useMemo(() => {
    if (!plan || (!plan.walls?.length && !plan.items?.length)) {
      return { center: [0, 0, 0], maxDim: 20 };
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let hasData = false;

    // Check walls
    plan.walls?.forEach(group => {
      group.walls.forEach(w => {
        minX = Math.min(minX, w.x1, w.x2);
        maxX = Math.max(maxX, w.x1, w.x2);
        minY = Math.min(minY, w.y1, w.y2);
        maxY = Math.max(maxY, w.y1, w.y2);
        hasData = true;
      });
    });

    // Check items
    plan.items?.forEach(i => {
      minX = Math.min(minX, i.x);
      maxX = Math.max(maxX, i.x + (i.width || 0));
      minY = Math.min(minY, i.y);
      maxY = Math.max(maxY, i.y + (i.height || 0));
      hasData = true;
    });

    if (!hasData) return { center: [0, 0, 0], maxDim: 20 };

    const centerX = ((minX + maxX) / 2) * SCALE;
    const centerZ = ((minY + maxY) / 2) * SCALE;
    const width = (maxX - minX) * SCALE;
    const depth = (maxY - minY) * SCALE;

    return { 
      center: [centerX, 0, centerZ], 
      maxDim: Math.max(width, depth, 10) // Ensure at least 10 units
    };
  }, [plan]);
  
  const cameraPositions = useMemo(() => {
    const [cx, cy, cz] = center;
    const dist = maxDim * 1.5; // Distance based on plan size

    return {
      perspective: [cx + dist * 0.7, dist * 0.8, cz + dist * 0.7],
      top: [cx, dist * 1.5, cz + 0.1], // Top down centered
      side: [cx + dist, dist * 0.4, cz],
      front: [cx, dist * 0.4, cz + dist],
      insider: [cx, 1.7, cz], // Start inside the plan
    };
  }, [center, maxDim]);

  const handleDownload = () => {
    if (glRef.current) {
        const dataUrl = glRef.current.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${plan?.name || 'plan'}_3d_view.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm p-4 text-white border-b border-gray-700 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            3D View: {plan?.name || 'Floor Plan'}
          </h1>
          <p className="text-xs text-gray-400">High-fidelity 3D Rendering</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 mr-4 px-4 py-2 rounded-lg font-medium transition-all text-sm bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-500/30"
          >
             <BiDownload size={18} />
             Download View
          </button>

          <div className="flex items-center gap-2 mr-2 bg-gray-700 px-3 py-1 rounded-lg border border-gray-600">
            <label className="text-sm font-medium text-gray-200">Floor:</label>
            <input 
              type="color" 
              value={floorColor} 
              onChange={(e) => setFloorColor(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
              title="Change Floor Color"
            />
          </div>
          {Object.keys(cameraPositions).map((viewName) => (
            <button
              key={viewName}
              onClick={() => setView(viewName)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                view === viewName 
                  ? 'bg-blue-600 shadow-lg transform scale-105' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {viewName === 'insider' ? 'Insider (FPS)' : viewName.charAt(0).toUpperCase() + viewName.slice(1)} View
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas 
            shadows 
            camera={{ fov: 60 }} 
            gl={{ preserveDrawingBuffer: true }}
            onCreated={({ gl }) => { glRef.current = gl }}
        >
          <PerspectiveCamera 
            makeDefault 
            position={cameraPositions[view]} 
            key={view} // Resets camera on view change
          />
          <Suspense fallback={null}>
            <Scene3D plan={plan} floorColor={floorColor} />
          </Suspense>
          
          {view === 'insider' ? (
            <FirstPersonController 
              onLock={() => setIsLocked(true)} 
              onUnlock={() => setIsLocked(false)} 
            />
          ) : (
            <OrbitControls 
              enableDamping
              dampingFactor={0.05}
              maxPolarAngle={Math.PI / 2 - 0.1}
              minDistance={2}
              maxDistance={maxDim * 3}
              target={center}
            />
          )}
        </Canvas>

        {/* Loading overlay */}
        <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded-lg text-sm border border-gray-700 shadow-lg">
          <span className="font-semibold text-blue-400">Items:</span> {plan?.items?.length || 0} 
          <span className="mx-2 text-gray-600">|</span>
          <span className="font-semibold text-green-400">Walls:</span> {plan?.walls?.reduce((acc, w) => acc + w.walls.length, 0) || 0}
        </div>

        {/* Insider View Instructions */}
        {view === 'insider' && !isLocked && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white text-center bg-black bg-opacity-50 p-4 rounded-xl">
            <p className="font-bold text-xl mb-2">Click to Move</p>
            <p className="text-sm">WASD to Walk • Mouse to Look • ESC to Unlock</p>
          </div>
        )}
      </div>


    </div>
  );
}
