import React from 'react'
import ItemWrapper from './ItemWrapper'

const Items = ({items, updateItem, removeItem}) => {

  return (
    <g id='floorPlanElements'>
        {items.map(e => 
          <g key={e.id}>
            <ItemWrapper id={e.id} type={e.type} itemProps={e} removeItem={removeItem} updateItem={updateItem} />
          </g>
        )}
    </g>
  )
}

export default Items