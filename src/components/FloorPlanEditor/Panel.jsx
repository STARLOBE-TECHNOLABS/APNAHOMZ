import React, { useRef, useState } from 'react'
import { nanoid } from "nanoid"
import { PiDoorBold } from 'react-icons/pi'
import { TbWindow } from 'react-icons/tb'
import { BiCuboid, BiText, BiChevronLeft, BiSearch } from "react-icons/bi";
import { useAppStore } from '@/store/app';
import { useNotification } from '@/context/NotificationContext';
import floorPlanItems, { furnitureCategories } from '../FloorPlanItems';
import { Tooltip } from 'react-tooltip'

const Panel = ({ addItem }) => {

  const tooltipRef = useRef()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const notify = useNotification()
  const setEditorProp = useAppStore(state => state.setEditorProp)
  const wallDrawing = useAppStore(state => state.wallDrawing)
  const furniterMenu = useAppStore(state => state.furniterMenu)
  const svgRef = useAppStore(state => state.svgRef)
  const translate = useAppStore(state => state.translate)

  const addFloorPlanElement = (type, event) => {

    event.stopPropagation()
    setEditorProp('furniterMenu', false)
    setSelectedCategory(null)
    setSearchTerm('')

    // Generate unique id
    const id = nanoid(8)

    // Safety checks
    if (!svgRef) {
      console.error('Editor SVG ref not found');
      return;
    }

    const item = floorPlanItems[type];
    if (!item) {
      console.error(`Item type "${type}" not found in definitions`);
      return;
    }

    // Calculate position where to add element - center of a screen
    // In future the position will follow mouse so there won't be a fixed position
    const { width, height } = svgRef.getBoundingClientRect();
    const positionX = width / 2 - translate.x - 50
    const positionY = height / 2 - translate.y - 50

    // Calculate metadata for the furniture item
    const itemWidth = item.size?.width || 50;
    const itemHeight = item.size?.height || 50;
    const area = Math.round((itemWidth * itemHeight) / 100); // in square meters
    const perimeter = Math.round(2 * (itemWidth + itemHeight));

    let furniter = {
      id: id,
      type: type,
      x: positionX,
      y: positionY,
      rotation: 0,
      width: itemWidth,
      height: itemHeight,
      area: area,
      perimeter: perimeter,
      data: {
        createdAt: new Date().toISOString(),
        category: item.category || 'other',
        measurements: {
          width: itemWidth,
          height: itemHeight,
          area: area,
          perimeter: perimeter,
          units: 'cm'
        }
      }
    }

    addItem(furniter)
    setEditorProp("activeElement", id)
    setEditorProp('textEditing', false)
    tooltipRef.current.close()
  }

  const startDrawingWalls = () => {
    notify({ content: "Cancel drawing", keyboard: "ESC" })
    setEditorProp("wallDrawing", true)
    setEditorProp("activeElement", null)
    setEditorProp('furniterMenu', false)
    setEditorProp('textEditing', false)
    setSelectedCategory(null)
    setSearchTerm('')
  }

  const toggleCategory = (cat, e) => {
    e.stopPropagation()
    if (selectedCategory?.id === cat.id) {
      setSelectedCategory(null)
      setEditorProp('furniterMenu', false)
    } else {
      setSelectedCategory(cat)
      setEditorProp('furniterMenu', true)
      setEditorProp("activeElement", null)
      setEditorProp('textEditing', false)
      setEditorProp('wallDrawing', false)
    }
    setSearchTerm('')
  }

  const globalFilteredItems = searchTerm && !selectedCategory
    ? Object.keys(floorPlanItems).filter(key => {
      const el = floorPlanItems[key]
      return el?.label?.toLowerCase().includes(searchTerm.toLowerCase())
    })
    : []

  const filteredItems = selectedCategory ? selectedCategory.items.filter(key => {
    const el = floorPlanItems[key]
    return el?.label?.toLowerCase().includes(searchTerm.toLowerCase())
  }) : globalFilteredItems

  return (
    <div className='absolute left-6 top-1/2 -translate-y-1/2 flex items-center h-fit max-h-[90vh]'>
      <Tooltip ref={tooltipRef} id="tooltip" delayShow={100} noArrow={true} style={{ padding: "3px 8px", fontSize: 12, fontWeight: 500, backgroundColor: "#111827", zIndex: 100 }} />

      {/* Sidebar Pill */}
      <div className='bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl border border-slate-100 flex flex-col gap-2 w-24 items-center py-4'>
        {/* Global Search Icon/Input Trigger */}
        <div
          className={`flex justify-center items-center size-10 rounded-xl cursor-pointer transition-all duration-200 mb-2 ` + (searchTerm ? 'bg-[#B38F4B] text-white shadow-lg' : 'bg-slate-50 hover:bg-[#B38F4B]/10 text-slate-400')}
          onClick={() => {
            if (!searchTerm && !selectedCategory) {
              setSearchTerm(' ') // Just to trigger the panel
            } else if (searchTerm === ' ') {
              setSearchTerm('')
            }
          }}
        >
          <BiSearch size={22} />
        </div>

        {/* Core Tools - 2x2 Grid */}
        <div className='grid grid-cols-2 gap-2 mb-1'>
          <div
            data-tooltip-id="tooltip" data-tooltip-content="Draw Wall" data-tooltip-place="right"
            className={`flex justify-center items-center size-9 rounded-xl cursor-pointer transition-all duration-200 ` + (wallDrawing ? 'bg-[#B38F4B] text-white shadow-lg' : 'bg-white hover:bg-[#B38F4B]/10 text-slate-500')}
            onClick={startDrawingWalls}
          >
            <BiCuboid size={20} />
          </div>

          <div
            data-tooltip-id="tooltip" data-tooltip-content="Add Door" data-tooltip-place="right"
            className='flex justify-center items-center size-9 hover:bg-[#B38F4B]/10 text-slate-500 rounded-xl cursor-pointer transition-all duration-200'
            onClick={(e) => addFloorPlanElement('door', e)}
          >
            <PiDoorBold size={20} />
          </div>

          <div
            data-tooltip-id="tooltip" data-tooltip-content="Add Window" data-tooltip-place="right"
            className='flex justify-center items-center size-9 hover:bg-[#B38F4B]/10 text-slate-500 rounded-xl cursor-pointer transition-all duration-200'
            onClick={(e) => addFloorPlanElement('window', e)}
          >
            <TbWindow size={20} />
          </div>

          <div
            data-tooltip-id="tooltip" data-tooltip-content="Add Text" data-tooltip-place="right"
            className='flex justify-center items-center size-9 hover:bg-[#B38F4B]/10 text-slate-500 rounded-xl cursor-pointer transition-all duration-200'
            onClick={(e) => addFloorPlanElement('text', e)}
          >
            <BiText size={20} />
          </div>
        </div>

        {/* Separator */}
        <div className='w-16 h-[1px] bg-slate-100 my-1' />

        {/* Categories - 2x2 Grid */}
        <div className='grid grid-cols-2 gap-2'>
          {furnitureCategories.map((cat) => (
            <div
              key={cat.id}
              data-tooltip-id="tooltip" data-tooltip-content={cat.label} data-tooltip-place="right"
              className={`flex justify-center items-center size-9 rounded-xl cursor-pointer transition-all duration-200 ` + (selectedCategory?.id === cat.id ? 'bg-[#B38F4B] text-white shadow-lg' : 'bg-white hover:bg-[#B38F4B]/10 text-slate-500')}
              onClick={(e) => toggleCategory(cat, e)}
            >
              {cat.icon ? <cat.icon size={20} /> : <BiCuboid size={20} />}
            </div>
          ))}
        </div>
      </div>

      {/* Items Sub-panel */}
      {(selectedCategory || searchTerm) && (
        <div className='ml-6 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] border border-slate-100 w-[420px] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-left-4 duration-300 z-50 flex flex-col max-h-[85vh]'>
          <div className='p-6 pb-4 flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-bold text-slate-800 text-lg tracking-tight px-1'>
                {selectedCategory ? selectedCategory.label : 'Global Search'}
              </h3>
              <div
                className='p-2 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors text-slate-400'
                onClick={(e) => { e.stopPropagation(); setSelectedCategory(null); setSearchTerm(''); }}
              >
                <BiChevronLeft size={24} />
              </div>
            </div>

            {/* Search Input */}
            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'>
                <BiSearch size={18} />
              </div>
              <input
                type="text"
                placeholder={selectedCategory ? `Search in ${selectedCategory.label}...` : "Search all furniture..."}
                className='w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-600 focus:ring-2 focus:ring-[#B38F4B]/30 placeholder:text-slate-400 outline-none transition-all'
                autoFocus
                value={searchTerm === ' ' ? '' : searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className='p-6 pt-0 grid grid-cols-3 gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200'>
            {filteredItems.map((key) => {
              const el = floorPlanItems[key]
              if (!el) return null
              return (
                <div
                  key={key}
                  className='group flex flex-col items-center gap-3 bg-slate-50/50 hover:bg-[#B38F4B]/10 rounded-3xl p-4 cursor-pointer transition-all duration-300 border border-transparent hover:border-[#B38F4B]/30'
                  onClick={(event) => addFloorPlanElement(key, event)}
                >
                  <div className='flex items-center justify-center h-20 w-full bg-white rounded-2xl shadow-sm border border-slate-100/50 group-hover:shadow-md transition-all duration-300'>
                    <div className='scale-[45%] group-hover:scale-[50%] transition-transform duration-300'>
                      <svg width={el.size?.width || 50} height={el.size?.height || 50} className='drop-shadow-sm'>
                        {React.createElement(el.component, {
                          item: { width: el.size?.width || 50, height: el.size?.height || 50 },
                          width: el.size?.width || 50,
                          height: el.size?.height || 50
                        })}
                      </svg>
                    </div>
                  </div>
                  <span className='text-[11px] text-slate-600 font-bold text-center leading-tight truncate w-full group-hover:text-[#B38F4B]'>
                    {el.label}
                  </span>
                </div>
              )
            })}
            {filteredItems.length === 0 && (
              <div className='col-span-3 py-12 text-center'>
                <p className='text-slate-400 text-sm font-medium'>No items found matching "{searchTerm}"</p>
                <button
                  className='mt-2 text-[#B38F4B] text-xs font-bold hover:underline'
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Panel