/* eslint-disable react/no-unknown-property, react/prop-types, react/display-name */
import React, { useState, Suspense, useMemo, useEffect, useRef, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid as ThreeGrid, Environment, PointerLockControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { BiDownload } from 'react-icons/bi';
import { ComplexWall, getPlasterBumpMap } from './Wall';
import { FurnitureComponents } from './furnitureModels';
import AIEnhanceButton from './AIEnhanceButton';
import { captureDepthMap } from './AIRenderCapture';

const SCALE = 0.02; // Global scale for 2D to 3D conversion
const FPS_POPUP_STORAGE_KEY = 'floorlite_fps_popup_seen';

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

// Helper to calculate strictly wall-based bounds
const getWallBounds = (plan) => {
  if (!plan || !plan.walls?.length) {
    return null;
  }

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let hasData = false;

  plan.walls.forEach(group => {
    group.walls.forEach(w => {
      minX = Math.min(minX, w.x1, w.x2);
      maxX = Math.max(maxX, w.x1, w.x2);
      minY = Math.min(minY, w.y1, w.y2);
      maxY = Math.max(maxY, w.y1, w.y2);
      hasData = true;
    });
  });

  if (!hasData) return null;

  // Add padding for half of wall thickness (thickness = 0.15 -> 0.075 radius in 3D)
  const padding = 0.075 / SCALE;

  return {
    minX: minX - padding,
    maxX: maxX + padding,
    minY: minY - padding,
    maxY: maxY + padding
  };
};

function FirstPersonController({ onLock, onUnlock, enabled = true }) {
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

  return <PointerLockControls onLock={onLock} onUnlock={onUnlock} enabled={enabled} />;
}

/**
 * CameraController - Manages camera position strictly on view changes.
 * This prevents React component re-renders (like unlocking PointerLockControls)
 * from snapping the camera back to its initial positions. 
 */
function CameraController({ view, positions, targets, center }) {
  const { camera } = useThree();

  useEffect(() => {
    if (view === 'insider') {
      // For insider view, we only set the position when explicitly switching TO it.
      // After that, the FirstPersonController manages the position.
      const pos = positions[view];
      camera.position.set(...pos);
      // Look forward initially
      camera.lookAt(pos[0], pos[1], pos[2] - 10);
    } else {
      // For other views, set position and update orbit controls target
      const pos = positions[view] || positions.perspective;
      camera.position.set(...pos);

      const target = targets[view] || center;
      camera.lookAt(...target);
    }
  }, [view, positions, targets, center, camera]);

  return null;
}

/**
 * Lives inside <Canvas> — grabs scene + camera refs for AI depth capture
 */
function SceneCapture({ sceneRef, cameraRef }) {
  const { scene, camera } = useThree();
  useEffect(() => {
    sceneRef.current = scene;
    cameraRef.current = camera;
  }, [scene, camera, sceneRef, cameraRef]);
  return null;
}

// The infinite ground plane with grid
function Ground({ width = 100, depth = 100 }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0.1} />
      </mesh>
      <ThreeGrid
        position={[0, -0.09, 0]}
        args={[width, depth]}
        cellSize={1}
        cellThickness={1}
        cellColor="#e0e0e0"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#cccccc"
        fadeDistance={50}
        fadeStrength={1}
      />
    </group>
  );
}

// Realistic Wood Plank Floor with individual planks
function RoomFloor({ bounds, color }) {
  const { minX, maxX, minY, maxY } = bounds;
  const width = (maxX - minX) * SCALE;
  const depth = (maxY - minY) * SCALE;
  const centerX = ((minX + maxX) / 2) * SCALE;
  const centerZ = ((minY + maxY) / 2) * SCALE;

  const meshRef = useRef();

  // Generate individual wood planks
  const planks = useMemo(() => {
    const plankWidth = 0.12; // 12cm wide premium planks
    const plankLength = 0.7; // 70cm long planks
    const gap = 0.006; // Clear visible gap to create natural shadows between boards
    const planksList = [];

    // Calculate how many planks fit in each direction
    const planksX = Math.ceil(width / plankLength);
    const planksZ = Math.ceil(depth / plankWidth);

    for (let z = 0; z < planksZ; z++) {
      // Stagger every other row like real wood flooring
      const xOffset = (z % 2) * (plankLength / 2);

      for (let x = 0; x < planksX; x++) {
        const posX = (x * (plankLength + gap)) - width / 2 + plankLength / 2 + xOffset;
        const posZ = (z * (plankWidth + gap)) - depth / 2 + plankWidth / 2;

        // Natural wood color variation (slightly darkened to preserve rich wood tones)
        const hueShift = (Math.random() - 0.5) * 0.02;
        const lightnessShift = (Math.random() - 0.5) * 0.04 - 0.02;

        planksList.push({
          position: [posX, posZ],
          colorOffset: { hue: hueShift, lightness: lightnessShift }
        });
      }
    }

    return planksList;
  }, [width, depth]);

  useEffect(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    const baseColor = new THREE.Color(color);

    planks.forEach((plank, i) => {
      dummy.position.set(plank.position[0], 0, plank.position[1]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Apply color variation
      const plankColor = baseColor.clone();
      plankColor.offsetHSL(plank.colorOffset.hue, 0, plank.colorOffset.lightness);
      meshRef.current.setColorAt(i, plankColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [planks, color]);

  // Subfloor color (darker version of user's chosen color)
  const subfloorColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.4); // Darken by 60% for shadow effect but keep the same hue
    return c;
  }, [color]);

  return (
    <group position={[centerX, -0.01, centerZ]}>
      {/* Subfloor to prevent ground showing through the 6mm plank gaps */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial color={subfloorColor} />
      </mesh>
      <instancedMesh
        ref={meshRef}
        args={[null, null, planks.length]}
        receiveShadow // Crucial for catching shadows from the gap and walls
        frustumCulled={false} // Prevent disappearing when looking away from center
      >
        <boxGeometry args={[0.7, 0.015, 0.12]} /> {/* Match plank size + add depth */}
        <meshStandardMaterial
          color={color} // Pure crisp color tint
          roughness={0.4} // Give it a polished hardwood reflectivity
          metalness={0.1} // Slight metallic property to catch the environment map
        />
      </instancedMesh>
    </group>
  );
}

// Room Ceiling/Roof (Solid block for visibility and shadow casting)
function RoomRoof({ bounds }) {
  const { minX, maxX, minY, maxY } = bounds;
  const width = (maxX - minX) * SCALE;
  const depth = (maxY - minY) * SCALE;
  const centerX = ((minX + maxX) / 2) * SCALE;
  const centerZ = ((minY + maxY) / 2) * SCALE;

  const bumpMap = useMemo(() => getPlasterBumpMap(), []);

  return (
    <mesh
      position={[centerX, 3.2, centerZ]} // Raised to sit on top of taller walls
      receiveShadow
      castShadow
    >
      <boxGeometry args={[width, 0.2, depth]} /> {/* 20cm thick solid roof */}
      <meshStandardMaterial
        color="#808080" // Changed to match grey walls
        roughness={0.95} // Matte interior paint
        metalness={0.0}
        bumpMap={bumpMap}
        bumpScale={0.003}
      />
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

function Scene3D({ plan, floorColor, showRoof }) {
  const walls = plan?.walls || [];
  const items = plan?.items || [];
  const bounds = useMemo(() => getPlanBounds(plan), [plan]);
  const actualWallBounds = useMemo(() => getWallBounds(plan), [plan]);
  const wallBounds = useMemo(() => actualWallBounds || bounds, [actualWallBounds, bounds]);
  
  const hasWalls = !!actualWallBounds;

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

  // Assign openings to walls + compute snapped 3D position on the wall line
  const wallOpeningsMap = useMemo(() => {
    const map = {};
    openings.forEach(opening => {
      let bestDist = Infinity;
      let bestWallKey = null;
      let bestSegment = null;

      // Use center of opening bounding box for proximity check
      const openCenterX = opening.x + (opening.width || 0) / 2;
      const openCenterY = opening.y + (opening.height || 0) / 2;

      walls.forEach((wallGroup, wIndex) => {
        wallGroup.walls.forEach((segment, sIndex) => {
          const dist = distancePointToSegment(openCenterX, openCenterY, segment.x1, segment.y1, segment.x2, segment.y2);
          // Threshold: 60 units (pixels) — generous to catch doors near walls
          if (dist < 60 && dist < bestDist) {
            bestDist = dist;
            bestWallKey = `${wIndex}-${sIndex}`;
            bestSegment = segment;
          }
        });
      });

      if (bestWallKey && bestSegment) {
        if (!map[bestWallKey]) map[bestWallKey] = [];

        const dx = bestSegment.x2 - bestSegment.x1;
        const dy = bestSegment.y2 - bestSegment.y1;
        const wallLenSq = dx * dx + dy * dy;
        const wallAngle = Math.atan2(dy, dx);

        // Project the bounding-box center onto the wall segment to get the
        // true on-wall position (snaps door to the wall's centre line)
        const vx = openCenterX - bestSegment.x1;
        const vy = openCenterY - bestSegment.y1;
        const t = Math.max(0, Math.min(1, (vx * dx + vy * dy) / wallLenSq));
        const snappedX = (bestSegment.x1 + t * dx) * SCALE;
        const snappedZ = (bestSegment.y1 + t * dy) * SCALE;
        opening.snappedPosition = [snappedX, 0, snappedZ];

        // Determine rotation so door faces along the wall
        const itemAngleRad = (-opening.rotation * Math.PI) / 180;
        const target1 = -wallAngle;
        const target2 = -wallAngle + Math.PI;

        const normalizeAngle = (a) => {
          let res = a % (2 * Math.PI);
          if (res < -Math.PI) res += 2 * Math.PI;
          if (res > Math.PI) res -= 2 * Math.PI;
          return res;
        };

        const diff1 = Math.abs(normalizeAngle(itemAngleRad - target1));
        const diff2 = Math.abs(normalizeAngle(itemAngleRad - target2));
        opening.alignedRotation = diff1 < diff2 ? target1 : target2;

        map[bestWallKey].push(opening);
      }
    });
    return map;
  }, [walls, openings]);

  return (
    <>
      {/* Atmosphere */}
      <fog attach="fog" args={['#e0f2fe', 10, 60]} />

      {/* Lighting - Balanced to show rich wood colors without turning items black under the roof */}
      <ambientLight intensity={0.8} />
      <hemisphereLight intensity={0.4} skyColor="#ffffff" groundColor="#444444" />
      <directionalLight
        position={[10, 15, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Removed Contact Shadows to avoid dark spots */}

      {/* Ground Plane (World) */}
      <Ground width={100} depth={100} />

      {/* Room Floor (Interior) */}
      {wallBounds && <RoomFloor bounds={wallBounds} color={floorColor} />}

      {/* Room Roof (Ceiling limits lighting and provides architecture feeling) */}
      {showRoof && hasWalls && wallBounds && <RoomRoof bounds={wallBounds} />}

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
              height={3.2}
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

        // Use wall-snapped position if available; otherwise fall back to bbox center.
        // Snapped position places the door frame exactly on the wall's centre line,
        // matching real architecture where the jamb fills the full wall thickness.
        const position = item.snappedPosition ||
          [(
            (item.x + (item.width || 0) / 2)) * SCALE,
            0,
          (item.y + (item.height || 0) / 2) * SCALE
          ];

        const width = item.width ? item.width * SCALE : undefined;

        const finalRotation = item.alignedRotation !== undefined
          ? item.alignedRotation
          : (-item.rotation * Math.PI) / 180;

        return (
          <FurnitureComponent
            key={item.id}
            position={position}
            rotation={finalRotation}
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
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [floorColor, setFloorColor] = useState('#d4a574'); // Restored to original wood color
  const [showRoof, setShowRoof] = useState(true);
  const glRef = useRef(null);
  // Store Three.js scene + camera refs for depth capture
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

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
    const dist = maxDim * 1.5;
    const inset = maxDim * 0.3; // How far inside room camera sits

    return {
      perspective: [cx + dist * 0.7, dist * 0.8, cz + dist * 0.7],
      top: [cx, dist * 1.5, cz + 0.1],
      side: [cx + dist, dist * 0.4, cz],
      front: [cx, dist * 0.4, cz + dist],
      insider: [cx, 1.7, cz],
      // Interior wall presets — camera inside room at eye height facing each wall
      wallNorth: [cx, 1.7, cz + inset],   // Camera south of center, looking north
      wallSouth: [cx, 1.7, cz - inset],   // Camera north of center, looking south
      wallEast: [cx - inset, 1.7, cz],   // Camera west of center, looking east
      wallWest: [cx + inset, 1.7, cz],   // Camera east of center, looking west
    };
  }, [center, maxDim]);

  // OrbitControls target for each wall preset (what the camera looks AT)
  const cameraTargets = useMemo(() => {
    const [cx, cy, cz] = center;
    const reach = maxDim * 0.6;
    return {
      wallNorth: [cx, 1.7, cz - reach],
      wallSouth: [cx, 1.7, cz + reach],
      wallEast: [cx + reach, 1.7, cz],
      wallWest: [cx - reach, 1.7, cz],
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

  // Capture the current 3D view + depth map for AI rendering
  const handleCapture = useCallback(async () => {
    if (!glRef.current) throw new Error('3D canvas not ready');
    const gl = glRef.current;

    // 1. Color screenshot — already rendered, just read from canvas
    const colorImage = gl.domElement.toDataURL('image/png');

    // 2. Depth map — render scene with MeshDepthMaterial using stored refs
    let depthImage = null;
    if (sceneRef.current && cameraRef.current) {
      depthImage = captureDepthMap(gl, sceneRef.current, cameraRef.current, 1024, 1024);
    }

    // Wall views are interior perspective shots — tell backend to use flux-depth-pro
    const isWallView = view.startsWith('wall');
    const effectiveViewType = (view === 'insider') ? 'insider' : 'perspective';

    return {
      colorImage,
      depthImage,
      segmentationImage: null,
      viewType: effectiveViewType,
      wallView: isWallView ? view : null, // e.g. 'wallNorth'
    };
  }, [view]);

  // NEW: Capture 360 (N, S, E, W) for ALL detected rooms
  const handleCaptureAllRooms360 = useCallback(async (detectedRooms) => {
    if (!glRef.current || !sceneRef.current || !cameraRef.current) {
      throw new Error('3D canvas not ready');
    }

    const gl = glRef.current;
    const scene = sceneRef.current;

    // Store original camera state
    const originalPosition = cameraRef.current.position.clone();
    const originalRotation = cameraRef.current.rotation.clone();

    const results = {};

    // Loop through each detected room
    for (const room of detectedRooms) {
      // Calculate room center
      const cx = ((room.bounds.minX + room.bounds.maxX) / 2) * SCALE;
      const cz = ((room.bounds.minY + room.bounds.maxY) / 2) * SCALE;
      // Eye level height
      const cy = 1.7;

      const directions = [
        { name: 'North', target: [cx, cy, cz - 10] }, // Looking -Z
        { name: 'South', target: [cx, cy, cz + 10] }, // Looking +Z
        { name: 'East', target: [cx + 10, cy, cz] },  // Looking +X
        { name: 'West', target: [cx - 10, cy, cz] }   // Looking -X
      ];

      for (const dir of directions) {
        // Move camera to center of room
        cameraRef.current.position.set(cx, cy, cz);

        // Look at the specific direction
        cameraRef.current.lookAt(dir.target[0], dir.target[1], dir.target[2]);

        // Force render update
        cameraRef.current.updateMatrixWorld();
        gl.render(scene, cameraRef.current);

        // 1. Capture Color
        const colorImage = gl.domElement.toDataURL('image/png');

        // 2. Capture Depth Map
        const depthImage = captureDepthMap(gl, scene, cameraRef.current, 1024, 1024);

        // Store result using a unique key per room per direction
        const key = `${room.id}-${dir.name}`;
        results[key] = {
          roomId: room.id,
          roomName: room.name,
          dirName: dir.name,
          colorImage,
          depthImage,
          viewType: 'insider'
        };
      }
    }

    // Restore original camera state
    cameraRef.current.position.copy(originalPosition);
    cameraRef.current.rotation.copy(originalRotation);
    cameraRef.current.updateMatrixWorld();
    gl.render(scene, cameraRef.current);

    return results;
  }, []);

  // NEW: Capture Custom Group (Interactive 3D selection)
  const handleCaptureCustomGroup = useCallback(async (selectedItems, viewAngle) => {
    if (!glRef.current || !sceneRef.current || !cameraRef.current) {
      throw new Error('3D canvas not ready');
    }
    if (!selectedItems || selectedItems.length === 0) {
      throw new Error('No items selected');
    }

    const gl = glRef.current;
    const scene = sceneRef.current;

    // Store original camera state
    const originalPosition = cameraRef.current.position.clone();
    const originalRotation = cameraRef.current.rotation.clone();

    // 1. Calculate Combined Bounding Box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    selectedItems.forEach(item => {
      minX = Math.min(minX, item.x);
      minY = Math.min(minY, item.y);
      maxX = Math.max(maxX, item.x + (item.width || 0));
      maxY = Math.max(maxY, item.y + (item.height || 0));
    });

    const cx = ((minX + maxX) / 2) * SCALE;
    const cz = ((minY + maxY) / 2) * SCALE;

    // Size of the bounding box
    const width = (maxX - minX) * SCALE;
    const depth = (maxY - minY) * SCALE;
    const maxDim = Math.max(width, depth, 3); // minimum 3 units away

    // Eye level height
    const cy = 1.6;

    // Distance to pull the camera back to frame the objects
    const distanceOffset = maxDim * 1.5;

    // 2. Determine Camera Position based on viewAngle string
    let camX = cx;
    let camZ = cz;

    // Default assumes front view is looking from negative Z towards positive Z (depending on your coordinate setup)
    if (viewAngle === 'front') {
      camZ = cz - distanceOffset;
    } else if (viewAngle === 'back') {
      camZ = cz + distanceOffset;
    } else if (viewAngle === 'left') {
      camX = cx - distanceOffset;
    } else if (viewAngle === 'right') {
      camX = cx + distanceOffset;
    }

    // Move Camera
    cameraRef.current.position.set(camX, cy, camZ);
    cameraRef.current.lookAt(cx, cy, cz);

    // Force Render Update
    cameraRef.current.updateMatrixWorld();
    gl.render(scene, cameraRef.current);

    // Capture
    const colorImage = gl.domElement.toDataURL('image/png');
    const depthImage = captureDepthMap(gl, scene, cameraRef.current, 1024, 1024);

    // Restore original camera state
    cameraRef.current.position.copy(originalPosition);
    cameraRef.current.rotation.copy(originalRotation);
    cameraRef.current.updateMatrixWorld();
    gl.render(scene, cameraRef.current);

    return { colorImage, depthImage, viewType: 'insider' };

  }, []);

  return (
    <div className="w-full h-screen bg-sky-100 flex flex-col">
      {/* Header - Brand (#142725) */}
      <div className="bg-[#142725] px-6 py-2.5 shadow-sm border-b border-white/10 flex flex-wrap justify-between items-center gap-4 z-10 sticky top-0">
        {/* Left: Logo only */}
        <div className="flex items-center">
          <div className="flex items-center transition-opacity hover:opacity-80">
            <img src="/landing/logo.png" alt="APNAHOMZ" className="h-16 object-contain" />
          </div>
        </div>

        {/* Center: View Mode Switcher */}
        <nav className="flex bg-white/10 p-1 rounded-xl border border-white/10">
          {['perspective', 'top', 'side', 'front', 'insider'].map((viewName) => (
            <button
              key={viewName}
              onClick={() => setView(viewName)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap ${view === viewName
                ? 'bg-[#B38F4B] text-white shadow-sm active:scale-95'
                : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              {viewName === 'insider' ? 'FPS Mode' : viewName.charAt(0).toUpperCase() + viewName.slice(1)}
            </button>
          ))}
        </nav>

        {/* Right: Controls & AI Actions */}
        <div className="flex items-center gap-3">
          {/* View Toggles */}
          <div className="hidden xl:flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 group cursor-pointer relative">
              <div className="w-5 h-5 rounded-lg border border-white/20 shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: floorColor }}></div>
              <input
                type="color"
                value={floorColor}
                onChange={(e) => setFloorColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Floor Tone"
              />
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Floor</span>
            </div>

            <div className="w-px h-4 bg-white/20"></div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRoof(!showRoof)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showRoof ? 'bg-[#B38F4B]' : 'bg-white/30'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showRoof ? 'translate-x-4' : 'translate-x-0'}`}></span>
              </button>
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Roof</span>
            </div>
          </div>

          {/* AI Orientations */}
          <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/10" title="AI Camera Lock (N/S/E/W)">
            {[
              { key: 'wallNorth', label: 'N' },
              { key: 'wallSouth', label: 'S' },
              { key: 'wallEast', label: 'E' },
              { key: 'wallWest', label: 'W' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-black transition-all ${view === key
                  ? 'bg-[#B38F4B] text-white shadow-md transform scale-105 active:scale-95'
                  : 'text-white/80 hover:bg-white/10 hover:text-white active:scale-95'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-white/20 mx-1"></div>

          {/* Final Actions */}
          <div className="flex items-center gap-2">
            <AIEnhanceButton
              onCapture={handleCapture}
              onCaptureAll360={handleCaptureAllRooms360}
              onCaptureCustomGroup={handleCaptureCustomGroup}
              plan={plan}
              onModalStateChange={setIsAiModalOpen}
            />

            <button
              onClick={handleDownload}
              className="group p-2.5 bg-[#142725] border border-[#B38F4B]/50 text-white rounded-xl hover:bg-[#1a3332] shadow-md transition-all active:scale-95 flex items-center justify-center"
              title="Export Snapshot"
            >
              <BiDownload size={20} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
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
          // Removed position={cameraPositions[view]} and key={view}
          // to stop React from forcing the camera back to default
          // on every re-render (like when unlocking the pointer)
          />
          <CameraController
            view={view}
            positions={cameraPositions}
            targets={cameraTargets}
            center={center}
          />
          {/* Capture scene+camera refs for AI depth map */}
          <SceneCapture sceneRef={sceneRef} cameraRef={cameraRef} />
          <Suspense fallback={null}>
            <Scene3D plan={plan} floorColor={floorColor} showRoof={showRoof} />
          </Suspense>

          {view === 'insider' ? (
            <FirstPersonController
              onLock={() => {
              setIsLocked(true);
              try { localStorage.setItem(FPS_POPUP_STORAGE_KEY, 'true'); } catch (_) {}
            }}
              onUnlock={() => setIsLocked(false)}
              enabled={!isAiModalOpen}
            />
          ) : (
            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              maxPolarAngle={view.startsWith('wall') ? Math.PI : Math.PI / 2 - 0.1}
              minDistance={1}
              maxDistance={maxDim * 3}
              target={cameraTargets[view] || center}
              enabled={!isAiModalOpen}
            />
          )}
        </Canvas>

        {/* Loading overlay */}
        <div className="absolute bottom-6 left-6 flex gap-3 pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Objects:</span>
            <span className="text-xs font-black text-gray-700">{plan?.items?.length || 0}</span>
          </div>
          <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Segments:</span>
            <span className="text-xs font-black text-gray-700">{plan?.walls?.reduce((acc, w) => acc + w.walls.length, 0) || 0}</span>
          </div>
        </div>

        {/* Insider View Instructions - show only first time */}
        {view === 'insider' && !isLocked && !isAiModalOpen && typeof window !== 'undefined' && localStorage.getItem(FPS_POPUP_STORAGE_KEY) !== 'true' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] transition-all duration-500">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 text-center transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Immersive FPS Mode</h3>
              <p className="text-slate-500 text-sm font-medium mb-6 px-4">Click anywhere to enter the scene and explore in first-person</p>
              <div className="flex items-center justify-center gap-3">
                <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 border border-slate-200 uppercase tracking-widest">WASD Walk</div>
                <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 border border-slate-200 uppercase tracking-widest">Mouse Look</div>
                <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 border border-slate-200 uppercase tracking-widest">ESC Release</div>
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
