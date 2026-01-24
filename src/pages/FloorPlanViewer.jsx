import React, { useState, useEffect } from 'react'
import usePlan from '../hooks/usePlan'
import { useParams } from 'react-router-dom'
import SVGViewport from '@/components/Shared/SVGViewport'
import ScaleControls from '@/components/Shared/ScaleControls'
import GridControls from '@/components/Shared/GridControls'
import useDebounce from '@/hooks/useDebounce';

import ItemsView from '../components/FloorPlanViewer/ItemsView'
import WallsView from '../components/FloorPlanViewer/WallsView'
import LoadingPlan from '../components/Shared/LoadingPlan';
import { useAppStore } from '../store/app'

const FloorPlanViewer = () => {

  const { planId } = useParams()
  const { plan, loading, error } = usePlan(planId)


  // Get fit function for initial render
  const fitView = useAppStore(state => state.fitView)
  const[initialRun, setInitialRun] = useState(true)

  // Set initial size for svg - full window width and height
  const [svgDimension, setSvgDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const debounceResize = useDebounce(setSvgDimension, 300)

  // Update width and height after window resize with debounce to optimize performance
  const handleResize = () => {
    debounceResize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  },[])

  useEffect(() => {
    if(plan) {
      fitView(plan.walls)
      setInitialRun(false)
    }
  }, [plan])

  if (loading) return <LoadingPlan />;
  if (error) return <div className='bg-red-100 p-2 text-sm rounded'>There was an error: <span className='text-red-500'>{error.message}</span></div>;

  return (
    <div className='select-none'>
      <SVGViewport width={svgDimension.width} height={svgDimension.height} mode={"preview"} showGridDefault={false}>
        {!initialRun && (
          <>
            <WallsView walls={plan.walls} />
            <ItemsView items={plan.items} />
          </>
        )}
      </SVGViewport>
      <ScaleControls width={svgDimension.width} height={svgDimension.height}/>
      <GridControls mode="preview"/>
    </div>
  )
}

export default FloorPlanViewer