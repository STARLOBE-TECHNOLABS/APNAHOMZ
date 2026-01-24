import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app"
import config from "@/config/config"

const WallControlPoint = ({x, y, index, first=false, last = false, updateWall}) => {

  const svgRef = useAppStore(state => state.svgRef)
  const scale = useAppStore(state => state.scale)

  const [isMoving, setIsMoving] = useState(false)
  const [itemPosition, setItemPosition] = useState({startX: 0, startY: 0})

  const snapToGrid = useAppStore(state => state.snapToGrid)
  const snapGridSize = config.snapGridSize

  const snapSize = snapToGrid ? snapGridSize : 1

  const handleMouseDown = (e) => {
    e.stopPropagation()
    e.preventDefault()

    setIsMoving(true)
    const {left, top } = svgRef.getBoundingClientRect()
    setIsMoving(true)

    // Set initial position
    setItemPosition({
      startX: e.clientX - left - (x * scale), 
      startY: e.clientY - top - (y * scale)
    })
  }

  const handleMouseMove = (e) => {

    if(isMoving) {
      // Get position of svg 
      const {left, top} = svgRef.getBoundingClientRect()

      // Calculate delta changes relative to svg
      const dx = (e.clientX - left - itemPosition.startX) / scale;
      const dy = (e.clientY - top - itemPosition.startY) / scale;

      // Sanp to the grid
      const snappedX = Math.round(dx / snapSize) * snapSize
      const snappedY = Math.round(dy / snapSize) * snapSize
      
      // Update
      if(last) {
        updateWall(index, {x2: snappedX, y2: snappedY})
        // updateWall(0, {x1: snappedX, y1: snappedY})
      } else if (first) {
        updateWall(index, {x1: snappedX, y1: snappedY})
      } else {
        updateWall(index, {x1: snappedX, y1: snappedY})
        updateWall(index - 1, {x2: snappedX, y2: snappedY})
      }
    }

  }

  const handleMouseUp = (e) => {
    // Reset all interactions
    setIsMoving(false)
    setItemPosition({id: null, startX: 0, startY: 0})
  }

  useEffect(() => {

    const onMouseMove = (e) => handleMouseMove(e)
    const onMouseUp = (e) => handleMouseUp(e)
    
    if(isMoving) {
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
      
    } else {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

  },[isMoving])

  return(
    <g transform={`translate(${x} ${y})`} onMouseDown={handleMouseDown} className="cursor-pointer" >
      <circle cx={0} cy={0} r={10} className="fill-yellow-400"  />
      <circle cx={0} cy={0} r={3} className="fill-gray-800"/>
    </g>
  )

}

export default WallControlPoint;