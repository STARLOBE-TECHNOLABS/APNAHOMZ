import React from 'react'
import floorPlanItems from '@/components/FloorPlanItems'

const ListItems = ({items}) => {
  return (
    <g>
      {items.map(e => 
            <g key={e.id} id={e.id} transform={`translate(${e.x + 5} ${e.y + 5}) rotate(${e.rotation}, ${e.width / 2}, ${e.height / 2})`} >
              {React.createElement(floorPlanItems[e.type].component, {item: e})}  
            </g>
          )}
    </g>
  )
}

export default ListItems