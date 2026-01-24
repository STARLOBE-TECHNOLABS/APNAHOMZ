import React, { useState, useEffect, useRef } from "react"
import { useAppStore } from "@/store/app"
import config from "@/config/config"

import floorPlanItems from "@/components/FloorPlanItems"
import useDebounce from "@/hooks/useDebounce"
import {FaRotate, FaUpRightAndDownLeftFromCenter } from "react-icons/fa6"

const ItemWrapper = ({id, type, itemProps, updateItem, removeItem}) => {

  const debauncedUpdate = useDebounce(updateItem, 200)
  
  const activeElement = useAppStore(state => state.activeElement)
  const wallDrawing = useAppStore(state => state.wallDrawing)
  const svgRef = useAppStore(state => state.svgRef)
  const scale = useAppStore(state => state.scale)
  const snapToGrid = useAppStore(state => state.snapToGrid)
  const setEditorProp = useAppStore(state => state.setEditorProp)

  const defaultSnapRotation = config.snapRotation
  const snapGridSize = config.snapGridSize

  const snapSize = snapToGrid ? snapGridSize : 1

  const [item, setItem] = useState(itemProps)
  const [itemPosition, setItemPosition] = useState({startX: 0, startY: 0})
  const [isActive, setIsActive] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [isRotate, setIsRotate] = useState(false)
  const [isResize, setIsResize] = useState(false)
  const [initilAngle, setInitialAngle] = useState(0)

  const selectionRef = useRef()
  const groupRef = useRef()

  const handleMouseDownMove = (e) => {
    // Cancel if wall drawing 
    if(wallDrawing) return
    
    const {left, top } = svgRef.getBoundingClientRect()
    setIsMoving(true)
    setItemPosition({
      startX: e.clientX - left - (item.x * scale), 
      startY: e.clientY - top - (item.y * scale)
    })
  }

  const handleMouseDownRotate = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // Active Rotation
    setIsRotate(true)

    // Get position of selection 
    const { x, y, width, height} = selectionRef.current.getBoundingClientRect()

    // Calculate center
    const centerX = width / 2 + x
    const centerY = height / 2 + y

    // Calculate delta change relative to center
    const dx = e.clientX - centerX
    const dy = e.clientY - centerY

    // Calculate initial angle when user click
    const angle = Math.atan2(dy, dx)
    
    setInitialAngle(angle)
  }

  const handleMouseDownResize = (e) => {
    e.stopPropagation()
    e.preventDefault()

    const {left, top } = svgRef.getBoundingClientRect()
    setIsResize(true)
    setItemPosition({
      startX: e.clientX - left, 
      startY: e.clientY - top 
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
      setItem(prev => ({...prev, x: snappedX, y:snappedY}))
      debauncedUpdate(id, {x: snappedX, y:snappedY, rotation: item.rotation})
    }

    if(isRotate) {
      const snapRotation = snapToGrid ? defaultSnapRotation : 1

      // Calculate center
      const { x, y, width, height} = selectionRef.current.getBoundingClientRect()
      const centerX = width / 2 + x
      const centerY = height / 2 + y

      // Calculate the delta change while rotate
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      
      // Calculate the angle in radians
      const angle = Math.atan2(dy, dx)
      const newAngle = angle - initilAngle

      // Convert radians to angle
      const radToAngle = (newAngle * 180 / Math.PI) + item.rotation

      // Snapp to the grid - snapRotation
      const snapedRotationToGrid = Math.round(radToAngle / snapRotation) * snapRotation;

      // Update in store
      setItem(prev => ({...prev, rotation: snapedRotationToGrid}))
      debauncedUpdate(id, {rotation: snapedRotationToGrid, x: item.x, y:item.y})
    }

    if(isResize) {
      const {left, top} = svgRef.getBoundingClientRect()

      // Calculate the angle in radians
      const angleInRadians = (item.rotation * Math.PI) / 180;

      // Calculate the delta change while resizing
      const dx = (e.clientX - left - itemPosition.startX) / scale;
      const dy = (e.clientY - top - itemPosition.startY) / scale;

      // Calculate delta change in local coordinate system - taking into acount the angle
      const localDx = dx * Math.cos(-angleInRadians) - dy * Math.sin(-angleInRadians);
      const localDy = dx * Math.sin(-angleInRadians) + dy * Math.cos(-angleInRadians);
      
      // Set new width and height
      const changedWidth = item.width + localDx
      const changedHeight = item.height + localDy
      
      // Snapp to the grid
      const width = Math.round(changedWidth / snapSize) * snapSize;
      const height = Math.round(changedHeight / snapSize) * snapSize;

      // Set minimal width and height
      const minimalWidth = 80
      const minimalHeight = 20
      const newWidth = Math.max(width, minimalWidth);
      const newHeight = Math.max(height, minimalHeight)

      // Calculate the change in width and height
      const deltaX = (newWidth - item.width) / 2;
      const deltaY = (newHeight - item.height) / 2;
  
      // Calculate the center of the previous size
      const centerX = item.x + item.width / 2;
      const centerY = item.y + item.height / 2;
  
      // Adjust the top-left corner to keep the center in the same position
      const newX = centerX - newWidth / 2;
      const newY = centerY - newHeight / 2;
  
      // Apply the rotation matrix to adjust for the new size
      const adjustedX = newX + deltaX * Math.cos(angleInRadians) - deltaY * Math.sin(angleInRadians);
      const adjustedY = newY + deltaX * Math.sin(angleInRadians) + deltaY * Math.cos(angleInRadians);

      //  Update
      setItem(prev => ({...prev, width: newWidth, height: newHeight, x: adjustedX, y:adjustedY}))
      debauncedUpdate(id, {width: newWidth, height: newHeight, x: adjustedX, y:adjustedY})
    }
  }

  const handleDoubleClick = () => {
    // Active edit area only on text element
    if(item.type === "text") {
      setEditorProp('textEditing', true)
      setEditorProp('activeElement', id)
    }
  }

  const handleMouseUp = () => {
    // Reset all interactions
    setIsMoving(false)
    setIsRotate(false)
    setIsResize(false)
    setItemPosition({id: null, startX: 0, startY: 0})

    // Fix the click outside while rotate
    setTimeout(() => {
      setIsActive(true)
    });
  }

  const handleClickActiveElement = () => {
    setEditorProp('activeElement', id)
    setEditorProp('furniterMenu', false)
    if(itemProps.type !== "text"){
      setEditorProp('textEditing', false)
    }
  }

  const handleDelKeyPress = (e) => {
    if(activeElement === id && e.key === 'Delete') {
      removeItem(activeElement)
    }
  }

  useEffect(() => {
    if (activeElement === id) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }

  }, [activeElement])

  useEffect(() => {
    setItem(itemProps)
  }, [itemProps])

  useEffect(() => {

    // Attach event listener to document to handle interactions outside of current element
    const onMouseMove = (e) => handleMouseMove(e)
    const onMouseUp = () => handleMouseUp()
    
    if(isActive) {
      document.addEventListener("keydown", handleDelKeyPress)
    }

    if(isMoving || isRotate || isResize) {
      setEditorProp('activeElement', id)
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
      
    } else {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

    return () => {
      document.removeEventListener("keydown", handleDelKeyPress)
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
  }, [isMoving, isRotate, isResize, isActive])

  return(
    <g id={id} ref={groupRef} transform={`translate(${item.x + 5} ${item.y + 5}) rotate(${item.rotation}, ${item.width / 2}, ${item.height / 2})`} onClick={handleClickActiveElement}> 
      
      {/* Flor plan item */}
      {React.createElement(floorPlanItems[type].component, {item, debauncedUpdate})}

      {/* Selection border */}
      <rect ref={selectionRef} onMouseDown={handleMouseDownMove} onDoubleClick={handleDoubleClick} fill="transparent" strokeWidth={1.5} 
      className={`cursor-pointer ` + (isActive ? "stroke-yellow-400" : "")}
      width={item.width + 10} height={item.height + 10} x={-5} y={-5} rx={5}/>

      {isActive &&
        <>
          {/* Rotate control */}
          <g transform={`translate(-5, -5) rotate(${-item.rotation})`} onMouseDown={(e) => handleMouseDownRotate(e)} className="cursor-pointer">
            <circle cx={0} cy={0} r={10} className='fill-yellow-400' />
            <g transform={`translate(-5.5 -5.5)`}>
              <FaRotate size={11}  />
            </g>
          </g>
          {/* Resize control - only on text item */}
          { item.type === "text" &&
            <g transform={`translate(${item.width} ${item.height})`} onMouseDown={(e) => handleMouseDownResize(e)} className='cursor-pointer'>
              <circle cx={5} cy={5} r={10} className='fill-yellow-400' />
              <g transform={`translate(0 0) rotate(90 5 5)`}>
                <FaUpRightAndDownLeftFromCenter  size={10}  />
              </g>
            </g>
          }
        </>
      }
    </g>
    
  )

}

export default ItemWrapper;