import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/app";
import { nanoid } from "nanoid";
import config from "@/config/config"
import { convertToUnit } from "../../utils/helpers";

const WallDrawing = ({addWalls}) => {

  const [walls, setWalls] = useState([])
  const [points, setPoints] = useState([])
  const [measureLine, setMeasureLine] = useState({x1: 0, y1: 0, x2: 0,y2:0, distance: 0, visable: false})
  const [mouseOverSvg, setMouseOverSvg] = useState(false)
  const [mouseCoord, setMouseCoord] = useState({x: 0, y:0})
  const [helperLine, setHelperLine] = useState(null)

  // Keep reference to the walls array - needed in handleEscKeyPress
  const wallsRef = useRef(walls);

  const scale  = useAppStore((state) => state.scale)
  const translate  = useAppStore((state) => state.translate)
  const wallDrawing  = useAppStore((state) => state.wallDrawing)
  const setEditorProp  = useAppStore((state) => state.setEditorProp)
  const snapToGrid  = useAppStore((state) => state.snapToGrid)
  const svgRef  = useAppStore((state) => state.svgRef)
  const lengthUnit = useAppStore((state) => state.lengthUnit)
  const unitSuffix = useAppStore((state) => state.unitSuffix)

  const snapGridSize = config.snapGridSize

  // Keep reference to the actions - needed when drawing is active and user change scale or pan (change translate)
  const translateRef = useRef(translate)
  const scaleRef = useRef(scale)
  const pointsRef = useRef(points)

  const snapSize = snapToGrid ? snapGridSize : 1

  const onClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    const x = Math.round(( (e.clientX - translateRef.current.x) / scaleRef.current) / snapSize) * snapSize
    const y = Math.round(( (e.clientY - translateRef.current.y)  / scaleRef.current) /snapSize) * snapSize
    setPoints((prev) => ([...prev, {x, y}]))
  }

  const onMouseMove = (e) => {
    const x = Math.round(( (e.clientX - translateRef.current.x) / scaleRef.current ) / snapSize) * snapSize
    const y = Math.round(((e.clientY - translateRef.current.y) / scaleRef.current ) /snapSize) * snapSize
    setMouseCoord({x, y})

    // Get the last point 
    const origin = pointsRef.current.at(-1)
    // If there is no point that means that we start drawing and we dont need to calculate angle and distance
    if(!origin) return
    
    // Calculate angle of new point to the previous point
    const radius = 20
    const radAngle = Math.atan2(y - origin.y, x - origin.x)
    const measureX = radius * Math.cos(radAngle - Math.PI / 2)
    const measureY = radius * Math.sin(radAngle - Math.PI / 2)
    const distanceInPixels = Math.round(Math.sqrt(Math.pow(x - origin.x, 2) + Math.pow(y - origin.y, 2)))
    const distanceInUnit = convertToUnit(distanceInPixels, lengthUnit).toFixed(1)

    setMeasureLine({
      x1: origin.x + measureX,
      y1: origin.y + measureY,
      x2: x + measureX,
      y2: y + measureY,
      distance: distanceInUnit,
      visable: true
    })
  }

  const onMouseOver = (e) => {
    setMouseOverSvg(true)
  }

  const onMouseOut = (e) => {
    setMouseOverSvg(false)
  }

  const handleEscKeyPress = (e) => {
    if(e.key === 'Escape') {
      cancelDrawing()
    }
  }

  const cancelDrawing = () => {
    setMouseOverSvg(false)
    setEditorProp('wallDrawing', false)
    setHelperLine(null)
    setPoints([])

    const wallId = nanoid(12)
    addWalls({
      id: wallId, 
      walls: wallsRef.current
    })
    setMeasureLine(prev => ({...prev, visable: false}))
  }

  useEffect(() => {
    // When point is added construct walls
    const wallsList = []
    for(let i = 0; i < points.length; i++) {
      if(i > 0) {
        wallsList.push({x1: points[i -1].x, x2: points[i].x, y1: points[i -1].y, y2: points[i].y  })
      }
    }

    // Update walls
    setWalls(wallsList)
    
    // Update helper line start coordinates
    if(points.length > 0) {
      setHelperLine({x1:points.at(-1).x, y1:points.at(-1).y})
    }
    
    if(points.length > 1) {
      // Get the first point 
      const firstPoint = points[0]

      // Cancel drawing if the last point is the first one, the wall is closed
      if(points.at(-1).x === firstPoint.x && points.at(-1).y === firstPoint.y)  { 
        // Update wallRef with the latest wallsList
        wallsRef.current = wallsList;

        // Cancel
        cancelDrawing() }
    }

  }, [points])

  useEffect(() => {
    // Ensure that the latest walls state is captured 
    // This is needed becouse when handleEscKeyPress is added the walls state is empty
    wallsRef.current = walls;
  }, [walls]);

  useEffect(() => {

    // Capture the latest translate and scale action
    // Needed when drawing is active and user change scale or pan (change translate)
    translateRef.current = translate
    scaleRef.current = scale
    pointsRef.current = points

  },[translate, scale, points])


  useEffect(() => {
      if(wallDrawing && svgRef){
        document.addEventListener("keydown", handleEscKeyPress)

        svgRef.addEventListener("mouseover", onMouseOver)
        svgRef.addEventListener("mousemove", onMouseMove)
        svgRef.addEventListener("mouseout", onMouseOut)
        svgRef.addEventListener("click", onClick)
      }

    return () => {
      document.removeEventListener("keydown", handleEscKeyPress) 
      if(svgRef) {
        svgRef.removeEventListener("mouseover", onMouseOver)
        svgRef.removeEventListener("mousemove", onMouseMove)
        svgRef.removeEventListener("mouseout", onMouseOut)
        svgRef.removeEventListener("click", onClick)
      }

    }

  }, [wallDrawing])

  const midX = measureLine.x1 + (measureLine.x2 - measureLine.x1) / 2;
  const midY = measureLine.y1 + (measureLine.y2 - measureLine.y1) / 2;

  return(
    <g>
        {mouseOverSvg && wallDrawing && <circle cx={mouseCoord.x} cy={mouseCoord.y} r={10} className="fill-yellow-300" /> }
        {walls.map((e, i) => {
          return(
            <line key={i} x1={e.x1} x2={e.x2} y1={e.y1} y2={e.y2} stroke="#1e293b"  strokeWidth={6}></line>
          )
        })}
        {points.map((e, i) => {
          return(
            <circle key={i} cx={e.x} cy={e.y} r={6} stroke="#1e293b"></circle>
          )
        })}

        {/* Drawing line */}
        {helperLine && <line x1={helperLine.x1} y1={helperLine.y1} x2={mouseCoord.x}  y2={mouseCoord.y} strokeLinecap="round" strokeDasharray={0} stroke="#1e293b" strokeWidth={4}></line>}

        {/* Measure Line */}
        { measureLine.visable && 
        <g>
          <defs>
            <marker id="arrowheadEnd" markerWidth="7" markerHeight="26" refX="6" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="black" />
            </marker>
            <marker id="arrowheadStart" markerWidth="6" markerHeight="26" refX="0" refY="3" orient="auto">
              <polygon points="6 0, 0 3, 6 6" fill="black" />
            </marker>
          </defs>
          { measureLine.distance > 30 &&
            <line x1={measureLine.x1} y1={measureLine.y1} x2={measureLine.x2} y2={measureLine.y2} 
            strokeWidth={1} 
            className="stroke-gray-800"
            strokeDasharray={4}
            markerStart="url(#arrowheadStart)"
            markerEnd="url(#arrowheadEnd)"
            />
          }
          <rect x={midX} y={midY} width={74} height={22} fill="white" ry={5} transform={`translate(-37 -12)`} className="drop-shadow" />
          <text x={midX} y={midY}
            className="text-sm"
            textAnchor="middle"
            dominantBaseline="middle"
          >{measureLine.distance}{unitSuffix}</text>
        </g>
        }

    </g>
  )

}

export default WallDrawing;