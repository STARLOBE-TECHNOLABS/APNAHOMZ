import React, { useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import { RepeatWrapping } from 'three';

// MATERIAL MAP for AI-driven textures/colors
export const MATERIAL_MAP = {
  // Fabrics
  "fabric_light_gray": { 
    type: "fabric", 
    color: "#d1d5db",
    textures: {
      map: "/materials/fabric/gray/color.jpg",
      normalMap: "/materials/fabric/gray/normal.jpg",
      roughnessMap: "/materials/fabric/gray/roughness.jpg"
    }
  },
  "fabric_blue": { color: "#3b82f6", type: "fabric" },
  "fabric_dark": { color: "#1f2937", type: "fabric" },
  
  // Woods
  "wood_oak": { 
    type: "wood", 
    color: "#d4a574",
    textures: {
      map: "/materials/wood/oak/color.jpg",
      normalMap: "/materials/wood/oak/normal.jpg",
      roughnessMap: "/materials/wood/oak/roughness.jpg"
    }
  },
  "wood_dark_walnut": { color: "#5d4037", type: "wood" },
  "wood_birch": { color: "#e8ddcb", type: "wood" },
  
  // Laminates / Paints
  "laminate_black_matte": { 
    type: "laminate", 
    color: "#1f2937",
    textures: {
      map: "/materials/laminate/black/color.jpg",
      normalMap: "/materials/laminate/black/normal.jpg",
      roughnessMap: "/materials/laminate/black/roughness.jpg"
    }
  },
  "laminate_white_gloss": { color: "#ffffff", type: "laminate" },
  "paint_white": { color: "#ffffff", type: "paint" },
  
  // Stone / Metal
  "stone_marble": { color: "#f3f4f6", type: "stone" },
  "metal_brushed": { color: "#9ca3af", type: "metal" },
  "metal_gold": { color: "#ffd700", type: "metal" },
  
  // Fallbacks
  "fabric": { color: "#9ca3af", type: "fabric" },
  "wood": { color: "#8b4513", type: "wood" },
  "metal": { color: "#b0c4de", type: "metal" }
};

export const resolveMaterial = (config, defaultColor) => {
  if (typeof config === 'string') {
    return MATERIAL_MAP[config] || { color: defaultColor };
  }
  if (config && config.color) return config;
  return { color: defaultColor };
};

// Component that handles texture loading or fallback color
const TexturedMaterial = ({ textures, color, roughness, metalness, ...props }) => {
  // Safe load: If files are missing, this might warn in console but shouldn't crash
  // unless Suspense is missing higher up (it is present in FloorPlan3DViewer)
  const maps = useTexture(textures);

  useEffect(() => {
    if (maps.map) {
      maps.map.wrapS = maps.map.wrapT = RepeatWrapping;
      maps.map.repeat.set(2, 2); // Default tiling
    }
    if (maps.normalMap) {
      maps.normalMap.wrapS = maps.normalMap.wrapT = RepeatWrapping;
      maps.normalMap.repeat.set(2, 2);
    }
    if (maps.roughnessMap) {
      maps.roughnessMap.wrapS = maps.roughnessMap.wrapT = RepeatWrapping;
      maps.roughnessMap.repeat.set(2, 2);
    }
  }, [maps]);

  return (
    <meshStandardMaterial 
      {...maps} 
      color={color || '#ffffff'} // Tint the texture if needed, or white to show raw texture
      roughness={roughness}
      metalness={metalness}
      {...props} 
    />
  );
};

export const SmartMaterial = ({ materialConfig, defaultColor, roughness, metalness, ...props }) => {
  const resolved = resolveMaterial(materialConfig, defaultColor);
  const { color, textures, ...rest } = resolved;
  
  // Use passed props as overrides or defaults
  const finalRoughness = resolved.roughness ?? roughness ?? 0.8;
  const finalMetalness = resolved.metalness ?? metalness ?? 0.1;

  if (textures && Object.keys(textures).length > 0) {
    return (
      <TexturedMaterial 
        textures={textures} 
        color={color} 
        roughness={finalRoughness} 
        metalness={finalMetalness} 
        {...props} 
        {...rest} 
      />
    );
  }
  
  return (
    <meshStandardMaterial 
      color={color} 
      roughness={finalRoughness} 
      metalness={finalMetalness} 
      {...props} 
      {...rest} 
    />
  );
};
