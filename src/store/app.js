import { findBoundingBoxCenter } from "@/utils/helpers";
import config from "@/config/config"
import { create } from "zustand";

export const useAppStore = create((set, get) => ({
  activeElement: null,
  wallDrawing: false,
  textEditing: false,
  furniterMenu: false,
  snapToGrid: true,
  showGrid: true,
  lengthUnit: 'cm',
  unitSuffix: ' cm',
  scale: 1,
  translate: {x: 0, y:0},
  svgRef: null,
  setEditorProp: (prop, v) => set((state) => ({...state, [prop]: v})),
  changeLengthUnit: (unit) => {
    // Change unit
    set(state => ({...state, lengthUnit: unit}))
    // Update suffix
    const unitSuffixes = {
      cm: ' cm',
      inch: ' in',
      feet: "'"
    };
    const unitSuffix = unitSuffixes[unit] || ' cm';
    set(state => ({...state, unitSuffix: unitSuffix}))
   
  },
  fitView: (walls) => {
    // Get svg dimensions to fit accordingly
    const { width, height } = get().svgRef.getBoundingClientRect();
    
    // Flatten all walls to one array
    const flattenWallsSegments = walls.reduce((segments, wall) => [...segments, ...wall.walls], [])

    // Cancel if there is no wall segments
    if(flattenWallsSegments.length == 0) return
    
    let scaleToFit = 1;
    const padding = 150

    // Get center of screen and center of walls
    const centerOfScreen = {x: width / 2, y: height /2}
    const wallsBounding = findBoundingBoxCenter(flattenWallsSegments)

    // Calculate how much scale to fit 
    const distanceX = wallsBounding.dx / (width - padding)
    const distanceY = wallsBounding.dy / (height - padding)

    // Take in account min and max scale value
    scaleToFit = Math.max(config.minScale, Math.min(1 / distanceX, 1 / distanceY, 1))

    // Calculate center for svg
    const adjustX = centerOfScreen.x - wallsBounding.x * scaleToFit
    const adjustY = centerOfScreen.y - wallsBounding.y * scaleToFit

    set((state) => ({...state, 
      translate: {x: adjustX, y: adjustY},
      scale: scaleToFit
    }))
  }
}))