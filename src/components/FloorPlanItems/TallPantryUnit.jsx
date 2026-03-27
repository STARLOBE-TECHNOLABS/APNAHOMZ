import React from 'react'

const TallPantryUnit = () => {
  return (
    <g>
      {/* Tall pantry cabinet top view */}
      <rect x={0} y={0} width={60} height={60} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Full height vertical divider line */}
      <line x1={30} y1={0} x2={30} y2={60} stroke='#111827' strokeWidth={1} />
      {/* Front door handles */}
      <rect x={2} y={55} width={26} height={3} rx={1} fill='#111827' />
      <rect x={32} y={55} width={26} height={3} rx={1} fill='#111827' />
    </g>
  )
}

export default TallPantryUnit
