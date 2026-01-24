import React from 'react'
import { useAppStore } from '@/store/app'
import { PiPlusBold, PiMinusBold } from 'react-icons/pi'
import config from '@/config/config'

const ScaleControls = ({width, height, walls}) => {

  const minScale = config.minScale
  const maxScale = config.maxScale

  const centerX = width / 2;
  const centerY = height / 2;

  const setEditorProp = useAppStore((state) => state.setEditorProp)
  const scale = useAppStore((state) => state.scale)
  const translate = useAppStore((state) => state.translate)
  const fitView = useAppStore((state) => state.fitView)

  const resetZoom = () => {
    fitView(walls)
  }

  const increaseZoom = () => {
    const newScale = Math.max(minScale, Math.min(maxScale, scale + 0.1));
    setEditorProp('scale', newScale)

    const newTranslate = {
      x: (centerX - translate.x) * (1 - newScale / scale) + translate.x,
      y: (centerY - translate.y) * (1 - newScale / scale) + translate.y
    };
    setEditorProp('translate', newTranslate)
  }

  const decreaseZoom = () => {
    const newScale = Math.max(minScale, Math.min(maxScale, scale - 0.1));
    setEditorProp('scale', newScale)
  
    const newTranslate = {
      x: (centerX - translate.x) * (1 - newScale / scale) + translate.x,
      y: (centerY - translate.y) * (1 - newScale / scale) + translate.y
    };
    setEditorProp('translate', newTranslate)
  }

  return (
    <div className='absolute bottom-10 left-1/2 -translate-x-1/2'>
      <div className='bg-white p-1 shadow-md rounded-md '>
        <div className='flex'>
          <button onClick={decreaseZoom} className='flex justify-center items-center size-8  hover:bg-slate-100 rounded focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300'>
              <PiMinusBold />
          </button>
          <button onClick={resetZoom} className='flex justify-center items-center  hover:bg-slate-100 rounded focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300'>
              <div className='text-xs px-2' >
                {(scale * 100).toFixed()}%
              </div>
          </button>
          <button onClick={increaseZoom} className='flex justify-center items-center size-8 hover:bg-slate-100 rounded focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300'>
              <PiPlusBold />
          </button>
          
        </div>
      </div>
    </div>
  )
}

export default ScaleControls