import React, {useRef, useEffect, useState} from 'react'
import useDebounce from '@/hooks/useDebounce'
import SVGPreview from './SVGPreview'
import ListWalls from './ListWalls'
import ListItems from './ListItems'

const PlanThumbnail = ({plan}) => {

  const containerRef = useRef()
  const [containerWidth, setContainerWidth] = useState(0)

  const updateWidth = () => {
    const wdith = containerRef.current.offsetWidth
    setContainerWidth(wdith)
  }

  const debounceResize = useDebounce(updateWidth, 300)

  const handleResize = () => {
    debounceResize()
  }


  useEffect(() => {

    if(containerRef.current) updateWidth()
    window.addEventListener('resize', handleResize)
    return() => {
      window.removeEventListener('resize', handleResize)
    }

  },[])

  return (
    <div className='bg-white h-40 rounded-t-lg' ref={containerRef}>
      <SVGPreview width={containerWidth} height={160} scale={0.2}>
        <ListWalls walls={plan.walls} />
        <ListItems items={plan.items} />
      </SVGPreview>
    </div>
  )
}

export default PlanThumbnail