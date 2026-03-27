import React from 'react'

const BreakfastCounter = () => {
  return (
    <g>
      {/* Long narrow counter surface */}
      <rect x={0} y={0} width={220} height={45} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Decorative center divider */}
      <line x1={110} y1={0} x2={110} y2={45} stroke='#e5e7eb' strokeWidth={1} />
      {/* Overhang indication for stools */}
      <rect x={0} y={35} width={220} height={10} fill='#f9fafb' stroke='#e5e7eb' strokeWidth={1} />
    </g>
  )
}

export default BreakfastCounter
