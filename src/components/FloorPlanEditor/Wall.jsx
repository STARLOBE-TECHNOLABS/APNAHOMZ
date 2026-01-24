import { useEffect, useRef, useState } from "react"
import useDebounce from "@/hooks/useDebounce"
import WallControlPoint from "./WallControlPoint";

const Wall = ({ walls, id, color, activeElement, removeWalls, updateWalls, setActiveElement }) => {

  const debauncedUpdate = useDebounce(updateWalls, 300)
  const [localWalls, setLocalWalls] = useState(walls)

  const handleDelKeyPress = (e) => {
    if(activeElement !== null && e.key === 'Delete') {
      removeWalls(activeElement)
      setActiveElement(null)
    }
  }

  const handleUpdateWall = (index, data) => {

    setLocalWalls(prev => {
      const updatedWalls = prev.map((wallSegments, i) => {
        if(i == index) {
          return {...wallSegments, ...data}
        } 
        return wallSegments
      })
      debauncedUpdate(id, updatedWalls)
      return updatedWalls;
    })
  }

  useEffect(() => {
    document.addEventListener("keydown", handleDelKeyPress)
    return () => {
      document.removeEventListener("keydown", handleDelKeyPress)
    }
  }, [activeElement])

  return (
    <g>
      {localWalls.map((wall, j) => {
        const isActive = id === activeElement
        const isFirst = j === 0;
        const isLast = localWalls.length - 1 === j;
        return (
        <g key={j}>
          <line
            x1={wall.x1}
            y1={wall.y1}
            x2={wall.x2}
            y2={wall.y2}
            stroke={color || "#1e293b"}
            strokeLinecap='round'
            strokeWidth={isActive ? 4 : 6}
            strokeDasharray={isActive ? 6 : 0}
            >
          </line>
          {/* Add additional transparent lines to increase click area */}
          <line
            x1={wall.x1}
            y1={wall.y1}
            x2={wall.x2}
            y2={wall.y2}
            strokeWidth={30}
            stroke="transparent"
            >
          </line>
          {isActive && (
            <g>
              <WallControlPoint x={wall.x1} y={wall.y1} index={j} first={isFirst} updateWall={handleUpdateWall} />
              {isLast &&  <WallControlPoint x={wall.x2} y={wall.y2}  index={j} last updateWall={handleUpdateWall} /> } 
            </g>
          ) }
        </g>
      )})}
    </g>
  );
};

export default Wall;