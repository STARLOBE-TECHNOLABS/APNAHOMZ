import { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';

/**
 * AIRenderCapture - Captures control maps from 3D scene for AI rendering
 * 
 * This component provides utilities to capture:
 * 1. Color Render - Standard 3D view
 * 2. Depth Map - Grayscale depth information
 * 3. Segmentation Map - Color-coded by object type
 */

// Segmentation colors for different object types
export const SEGMENTATION_COLORS = {
  WALL: new THREE.Color(1, 0, 0),        // Red
  FLOOR: new THREE.Color(0, 1, 0),       // Green
  FURNITURE: new THREE.Color(0, 0, 1),   // Blue
  WINDOW: new THREE.Color(1, 1, 0),      // Yellow
  DOOR: new THREE.Color(1, 0, 1),        // Magenta
  BED: new THREE.Color(0, 1, 1),         // Cyan
  SOFA: new THREE.Color(1, 0.5, 0),      // Orange
  TABLE: new THREE.Color(0.5, 0, 1),     // Purple
  CHAIR: new THREE.Color(0.5, 0.5, 0.5), // Gray
  TV: new THREE.Color(0, 0.5, 0.5),      // Teal
  KITCHEN: new THREE.Color(0.8, 0.2, 0.2), // Dark Red
  BATHROOM: new THREE.Color(0.2, 0.2, 0.8), // Dark Blue
};

// Map furniture types to segmentation colors
const FURNITURE_TYPE_MAP = {
  // Beds
  singleBed: 'BED',
  doubleBed: 'BED',
  kingBed: 'BED',
  queenBed: 'BED',
  bunkBed: 'BED',
  // Sofas
  sofa: 'SOFA',
  lShapedSofa: 'SOFA',
  sofa2Seater: 'SOFA',
  sofa3Seater: 'SOFA',
  sofaWithChaise: 'SOFA',
  // Tables
  diningTable: 'TABLE',
  diningTableRound: 'TABLE',
  coffeeTable: 'TABLE',
  coffeeTableRound: 'TABLE',
  sideTable: 'TABLE',
  desk: 'TABLE',
  // Chairs
  diningChair: 'CHAIR',
  officeChair: 'CHAIR',
  armchair: 'CHAIR',
  // TV
  tv: 'TV',
  tvStand: 'FURNITURE',
  // Kitchen
  kitchenCounter: 'KITCHEN',
  kitchenIsland: 'KITCHEN',
  stove: 'KITCHEN',
  refrigerator: 'KITCHEN',
  sink: 'KITCHEN',
  // Bathroom
  toilet: 'BATHROOM',
  bathtub: 'BATHROOM',
  shower: 'BATHROOM',
  bathroomSink: 'BATHROOM',
  washingMachine: 'BATHROOM',
  // Storage
  wardrobe: 'FURNITURE',
  bookshelf: 'FURNITURE',
  cabinet: 'FURNITURE',
  // Default
  default: 'FURNITURE',
};

/**
 * Get segmentation color for a furniture item type
 */
export const getSegmentationColor = (itemType) => {
  const category = FURNITURE_TYPE_MAP[itemType] || 'FURNITURE';
  return SEGMENTATION_COLORS[category] || SEGMENTATION_COLORS.FURNITURE;
};

/**
 * Segmentation material - assigns colors based on object type
 */
export const createSegmentationMaterial = (color) => {
  return new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
  });
};

/**
 * Capture depth map from a Three.js scene
 * @param {THREE.WebGLRenderer} renderer - The Three.js renderer
 * @param {THREE.Scene} scene - The scene to render
 * @param {THREE.Camera} camera - The camera to use
 * @param {number} width - Render target width
 * @param {number} height - Render target height
 * @returns {string} Base64 encoded depth map image
 */
export const captureDepthMap = (renderer, scene, camera, width = 1024, height = 1024) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // ROOT CAUSE FIX: The default camera near=0.1, far=1000 causes ALL interior
  // surfaces (5–20 Three.js units from camera) to compress into a 0.005–0.020
  // normalized depth range — resulting in a nearly pure-white, zero-contrast
  // depth map. FLUX Depth Pro cannot distinguish anything from it.
  //
  // Fix: Temporarily override near/far to match the indoor scale, then normalize
  // the output to full 0-255 so Depth Pro gets clear structural information.
  // ─────────────────────────────────────────────────────────────────────────────
  const origNear = camera.near;
  const origFar = camera.far;
  // Our scene SCALE = 0.02; a typical interior spans 3–20 Three.js units from camera
  camera.near = 0.05;   // ~2.5cm of physical space
  camera.far = 30;     // ~1500cm = 15m, covers even large rooms
  camera.updateProjectionMatrix();

  // Create render target for depth
  const depthTarget = new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
  });

  // Store original materials
  const originalMaterials = [];
  scene.traverse((child) => {
    if (child.isMesh) {
      originalMaterials.push({ mesh: child, material: child.material });
    }
  });

  // Apply depth material
  const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
  });
  scene.traverse((child) => {
    if (child.isMesh) child.material = depthMaterial;
  });

  // Render depth
  renderer.setRenderTarget(depthTarget);
  renderer.render(scene, camera);

  // Read pixels
  const pixels = new Uint8Array(width * height * 4);
  renderer.readRenderTargetPixels(depthTarget, 0, 0, width, height, pixels);

  // ── Step 1: Decode all depth values ──────────────────────────────────────────
  // THREE.RGBADepthPacking encodes linear depth across R,G,B,A channels.
  // WebGL readRenderTargetPixels returns bottom-up rows; we Y-flip below.
  const rawDepth = new Float32Array(width * height);
  let minD = Infinity, maxD = -Infinity;

  for (let row = 0; row < height; row++) {
    const srcRow = height - 1 - row; // Y-flip
    for (let col = 0; col < width; col++) {
      const srcIdx = (srcRow * width + col) * 4;
      const depth =
        pixels[srcIdx] / 255 +   // R: most significant
        pixels[srcIdx + 1] / 65025 +   // G: /255²
        pixels[srcIdx + 2] / 16581375 +   // B: /255³
        pixels[srcIdx + 3] / 4228250625;      // A: /255⁴

      rawDepth[row * width + col] = depth;
      if (depth < minD) minD = depth;
      if (depth > maxD) maxD = depth;
    }
  }

  // ── Step 2: Normalize to full 0-255 range ────────────────────────────────────
  // This is the key fix: instead of mapping 0.995–0.999 → 1–2 gray values,
  // we stretch the actual min–max to 0–255 for maximum contrast.
  const range = maxD - minD || 1; // avoid division by zero

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);

  for (let i = 0; i < width * height; i++) {
    // Normalize: 0.0 = minDepth (closest) → 255 (white), maxDepth → 0 (black)
    const normalized = (rawDepth[i] - minD) / range;
    // Invert: close = white (255), far = black (0) — standard ControlNet convention
    const gray = Math.round((1 - normalized) * 255);
    const dstIdx = i * 4;
    imageData.data[dstIdx] = gray;
    imageData.data[dstIdx + 1] = gray;
    imageData.data[dstIdx + 2] = gray;
    imageData.data[dstIdx + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);

  // ── Restore everything ───────────────────────────────────────────────────────
  originalMaterials.forEach(({ mesh, material }) => { mesh.material = material; });
  renderer.setRenderTarget(null);
  depthTarget.dispose();

  // Restore original camera clipping
  camera.near = origNear;
  camera.far = origFar;
  camera.updateProjectionMatrix();

  return canvas.toDataURL('image/png');
};

/**
 * Capture segmentation map from a Three.js scene
 * @param {THREE.WebGLRenderer} renderer - The Three.js renderer
 * @param {THREE.Scene} scene - The scene to render
 * @param {THREE.Camera} camera - The camera to use
 * @param {Object} plan - The floor plan data with items
 * @param {number} width - Render target width
 * @param {number} height - Render target height
 * @returns {string} Base64 encoded segmentation map image
 */
export const captureSegmentationMap = (renderer, scene, camera, plan, width = 1024, height = 1024) => {
  // Create render target
  const segTarget = new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
  });

  // Store original materials and visibility
  const originalState = [];
  scene.traverse((child) => {
    if (child.isMesh) {
      originalState.push({
        mesh: child,
        material: child.material,
        visible: child.visible,
      });
    }
  });

  // Apply segmentation materials based on object type
  scene.traverse((child) => {
    if (child.isMesh) {
      let color = SEGMENTATION_COLORS.FURNITURE;

      // Try to determine object type from name or userData
      const name = child.name || '';
      const userData = child.userData || {};

      if (name.includes('wall') || userData.type === 'wall') {
        color = SEGMENTATION_COLORS.WALL;
      } else if (name.includes('floor') || userData.type === 'floor') {
        color = SEGMENTATION_COLORS.FLOOR;
      } else if (name.includes('window') || userData.type === 'window') {
        color = SEGMENTATION_COLORS.WINDOW;
      } else if (name.includes('door') || userData.type === 'door') {
        color = SEGMENTATION_COLORS.DOOR;
      } else if (userData.itemType) {
        color = getSegmentationColor(userData.itemType);
      }

      child.material = createSegmentationMaterial(color);
    }
  });

  // Render segmentation
  renderer.setRenderTarget(segTarget);
  renderer.render(scene, camera);

  // Read pixels
  const pixels = new Uint8Array(width * height * 4);
  renderer.readRenderTargetPixels(segTarget, 0, 0, width, height, pixels);

  // Create image
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  // Restore original state
  originalState.forEach(({ mesh, material, visible }) => {
    mesh.material = material;
    mesh.visible = visible;
  });

  // Reset render target
  renderer.setRenderTarget(null);
  segTarget.dispose();

  return canvas.toDataURL('image/png');
};

/**
 * Capture color render from scene
 * @param {THREE.WebGLRenderer} renderer - The Three.js renderer
 * @param {THREE.Scene} scene - The scene to render
 * @param {THREE.Camera} camera - The camera to use
 * @param {number} width - Render target width
 * @param {number} height - Render target height
 * @returns {string} Base64 encoded color image
 */
export const captureColorRender = (renderer, scene, camera, width = 1024, height = 1024) => {
  const colorTarget = new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
  });

  renderer.setRenderTarget(colorTarget);
  renderer.render(scene, camera);

  const pixels = new Uint8Array(width * height * 4);
  renderer.readRenderTargetPixels(colorTarget, 0, 0, width, height, pixels);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  renderer.setRenderTarget(null);
  colorTarget.dispose();

  return canvas.toDataURL('image/png');
};

/**
 * Capture all control maps at once
 * @param {THREE.WebGLRenderer} renderer - The Three.js renderer
 * @param {THREE.Scene} scene - The scene to render
 * @param {THREE.Camera} camera - The camera to use
 * @param {Object} plan - The floor plan data
 * @param {Object} options - Capture options
 * @returns {Object} Object containing all captured images
 */
export const captureAllMaps = async (renderer, scene, camera, plan, options = {}) => {
  const { width = 1024, height = 1024 } = options;

  // Capture all three maps
  const colorImage = captureColorRender(renderer, scene, camera, width, height);
  const depthImage = captureDepthMap(renderer, scene, camera, width, height);
  const segmentationImage = captureSegmentationMap(renderer, scene, camera, plan, width, height);

  return {
    colorImage,
    depthImage,
    segmentationImage,
    width,
    height,
  };
};

/**
 * Hook to use AI render capture in React components
 */
export const useAIRenderCapture = () => {
  const captureRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
  });

  const setCaptureContext = useCallback((renderer, scene, camera) => {
    captureRef.current = { renderer, scene, camera };
  }, []);

  const capture = useCallback(async (plan, options = {}) => {
    const { renderer, scene, camera } = captureRef.current;
    if (!renderer || !scene || !camera) {
      throw new Error('Capture context not set. Call setCaptureContext first.');
    }
    return captureAllMaps(renderer, scene, camera, plan, options);
  }, []);

  return {
    setCaptureContext,
    capture,
  };
};

export default {
  captureDepthMap,
  captureSegmentationMap,
  captureColorRender,
  captureAllMaps,
  useAIRenderCapture,
  SEGMENTATION_COLORS,
  getSegmentationColor,
};
