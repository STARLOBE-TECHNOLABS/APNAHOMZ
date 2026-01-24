import React, {useEffect, useState} from 'react'
import { useAppStore } from '@/store/app'
import { TbMagnet, TbMagnetOff } from 'react-icons/tb'
import { MdGridOn, MdGridOff } from "react-icons/md";
import { convertToUnit } from '../../utils/helpers';

const GridControls = ({mode}) => {

  const setEditorProp = useAppStore((state) => state.setEditorProp)
  const snapToGrid = useAppStore((state) => state.snapToGrid)
  const showGrid = useAppStore((state) => state.showGrid)
  const scale = useAppStore((state) => state.scale)
  const lengthUnit = useAppStore((state) => state.lengthUnit)
  const unitSuffix = useAppStore((state) => state.unitSuffix)
  const changeLengthUnit = useAppStore((state) => state.changeLengthUnit)

  const [gridLength, setGridLength] = useState(100)
  const [lengthUnitMenu, setLengthUnitMenu] = useState(false)

  const handleChangeLengthUnit = (newUnit) => {

    // Return if unsupported unit
    changeLengthUnit(newUnit)
    conversUnit(newUnit)
  }

  const conversUnit = (newUnit) => {
    const baseValue = 100 / scale
    const newGridLength = convertToUnit(baseValue, newUnit).toFixed(1);
    setGridLength(newGridLength)
  }

  useEffect(() => {
    conversUnit(lengthUnit)
  }, [scale])

  return (
    <div className='absolute bottom-10 right-8'>
      <div className='bg-white p-1 shadow-md rounded-md '>
        <div className='flex gap-1'>
          {mode !== "preview"  && 
          <>
            <div  className={'flex justify-center items-center h-8  rounded px-2 cursor-pointer hover:bg-yellow-300 ' + (snapToGrid ? 'bg-yellow-200' : 'bg-gray-200')} onClick={() => setEditorProp('snapToGrid', !snapToGrid)}>
              {snapToGrid ? <TbMagnet/> : <TbMagnetOff />}
            </div>
            <div  className={'flex justify-center items-center h-8  rounded px-2 cursor-pointer hover:bg-yellow-300 ' + (showGrid ? 'bg-yellow-200' : 'bg-gray-200')} onClick={() => setEditorProp('showGrid', !showGrid) }>
              {showGrid ? <MdGridOn/> : <MdGridOff />}
            </div>
          </>
          }
          <div  className='flex justify-center items-center h-8 bg-slate-100 rounded px-2'>
            <svg className='h-[30px] w-[112px]' transform='translate(-4, 0)'>
              <g className='stroke-slate-600'>
                <line x1={9.5} y1={20} x2={110.5} y2={20}/>
                <line x1={10} y1={20} x2={10} y2={10}/>
                <line x1={110} y1={20} x2={110} y2={10}/>
              </g>
              <g className='stroke-slate-400'>
                <line x1={30} y1={20} x2={30} y2={14}/>
                <line x1={50} y1={20} x2={50} y2={14}/>
                <line x1={70} y1={20} x2={70} y2={14}/>
                <line x1={90} y1={20} x2={90} y2={14}/>
              </g>
            </svg>
            
          </div>
          <div onClick={() => setLengthUnitMenu(!lengthUnitMenu)} className='stroke-slate-600 relative text-xs font-medium min-w-16 cursor-pointer flex justify-center items-center h-8 bg-slate-100 rounded px-2 hover:bg-yellow-200'>
              {gridLength}{unitSuffix}
              {
                lengthUnitMenu && 
                <div className='absolute -top-2 right-0 -translate-y-full bg-white  shadow-md p-1 flex flex-col gap-px items-start rounded-md'>
                  <button onClick={() => handleChangeLengthUnit('cm')} className={'hover:bg-slate-100 h-8 flex items-center justify-between gap-2 rounded px-2 w-full ' + (lengthUnit === 'cm' && 'bg-yellow-200')}>Centimeters </button>
                  <button onClick={() => handleChangeLengthUnit('inch')}  className={'hover:bg-slate-100 h-8 flex items-center justify-between gap-2  rounded px-2 w-full '  + (lengthUnit === 'inch' && 'bg-yellow-200')}>Inches </button>
                  <button onClick={() => handleChangeLengthUnit('feet')}  className={'hover:bg-slate-100 h-8 flex items-center justify-between gap-2 rounded px-2 w-full '  + (lengthUnit === 'feet' && 'bg-yellow-200')}>Feet </button>
                </div>
              }
          </div>
        </div>
      </div>
    </div>
  )
}

export default GridControls