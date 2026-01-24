import React, { useRef } from 'react'
import { nanoid } from "nanoid"
import { PiDoorBold} from 'react-icons/pi'
import { TbWindow } from 'react-icons/tb'
import { BiBed, BiCuboid, BiText } from "react-icons/bi";
import { useAppStore } from '@/store/app';
import { useNotification } from '@/context/NotificationContext';
import floorPlanItems, { furniterMenuItems } from '../FloorPlanItems';
import { Tooltip } from 'react-tooltip'

const Panel = ({addItem}) => {

  const tooltipRef = useRef()

  const notify = useNotification()
  const setEditorProp = useAppStore(state => state.setEditorProp)
  const wallDrawing = useAppStore(state => state.wallDrawing)
  const furniterMenu = useAppStore(state => state.furniterMenu)
  const svgRef = useAppStore(state => state.svgRef)
  const translate = useAppStore(state => state.translate)

  const addFloorPlanElement = (type, event) => {
    
    event.stopPropagation()
    setEditorProp('furniterMenu', false)
    
    // Generate unique id
    const id = nanoid(8)

    // Calculate position where to add element - center of a screen
    // In future the position will follow mouse so there won't be a fixed position
    const { width, height } = svgRef.getBoundingClientRect();
    const positionX = width / 2 - translate.x - 50
    const positionY =  height /2 - translate.y - 50

    let furniter = {
      id: id,
      type: type,
      x: positionX,
      y: positionY,
      rotation: 0,
      width: floorPlanItems[type].size.width,
      height: floorPlanItems[type].size.height,
      data: {}
    }

    addItem(furniter)
    setEditorProp("activeElement", id)
    setEditorProp('textEditing', false)
    tooltipRef.current.close()
  }

  const startDrawingWalls = () => {
    notify({content: "Cancel drawing", keyboard:"ESC"})
    setEditorProp("wallDrawing", true)
    setEditorProp("activeElement", null)
    setEditorProp('furniterMenu', false)
    setEditorProp('textEditing', false)
  }

  const setFurniterMenu = () => {
    setEditorProp('furniterMenu', !furniterMenu)
    setEditorProp("activeElement", null)
    setEditorProp('textEditing', false)
  }

  return (
    <div>
      <Tooltip ref={tooltipRef} id="tooltip" delayShow={100} noArrow={true} style={{padding: "3px 8px", fontSize: 12, fontWeight: 500, backgroundColor: "#111827"}}/>
      <div className='absolute left-6 top-1/2 -translate-y-1/2'>
        <div className='bg-white p-1 shadow-md rounded-md '>
              <div data-tooltip-id="tooltip" data-tooltip-content="Wall" data-tooltip-place="right" className={`flex justify-center items-center size-8 rounded cursor-pointer ` + (wallDrawing ? 'bg-yellow-200' : 'bg-white hover:bg-slate-100')} onClick={startDrawingWalls}>
                <BiCuboid />
              </div>
              <div data-tooltip-id="tooltip" data-tooltip-content="Door" data-tooltip-place="right" className='flex justify-center items-center size-8 hover:bg-slate-100 active:bg-yellow-200 rounded cursor-pointer' onClick={(e) => addFloorPlanElement('door', e)}>
                <PiDoorBold />
              </div>
              <div data-tooltip-id="tooltip" data-tooltip-content="Window" data-tooltip-place="right" className='flex justify-center items-center size-8  hover:bg-slate-100 active:bg-yellow-200 cursor-pointer  rounded' onClick={(e) => addFloorPlanElement('window', e)}>
                <TbWindow />
              </div>
              <div data-tooltip-id="tooltip" data-tooltip-content="Furnishing" data-tooltip-place="right" className={`relative flex justify-center items-center size-8 rounded cursor-pointer  ` + (furniterMenu ? 'bg-yellow-200' : 'bg-white hover:bg-slate-100')} onClick={setFurniterMenu}>
                <BiBed />
                {furniterMenu && (
                  <div className='absolute left-10 top-0 bg-white shadow-md rounded-md p-1 w-[550px]'>
                    <div className='grid grid-cols-8 gap-1'>
                      {furniterMenuItems.map((key, i) => {
                        const el = floorPlanItems[key]
                        return( 
                        <div key={i} className='bg-slate-100 hover:bg-yellow-200' onClick={(event) => addFloorPlanElement(key, event)}>
                          <div className='flex items-center justify-center h-16'>
                            <div className='scale-[25%]'>
                              <svg width={el.size.width} height={el.size.height}>
                                {React.createElement(el.component, {width: el.size.width, height: el.size.height})}
                              </svg>
                            </div>
                          </div>
                          <div className='capitalize text-xs text-gray-600 font-medium text-center mb-2'>
                            {el.label}
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                )}
              </div>
              <div data-tooltip-id="tooltip" data-tooltip-content="Text" data-tooltip-place="right" className='flex justify-center items-center size-8  hover:bg-slate-100 active:bg-yellow-200 cursor-pointer  rounded' onClick={(e) => addFloorPlanElement('text', e)}>
                <BiText />
              </div>
        </div>
      </div>
    </div>
  )
}

export default Panel