import React from 'react'

const SpiceRack = () => {
  return (
    <g>
      {/* Vertical Spice Rack top-down view (Narrow and Deep) */}
      <rect x={0} y={0} width={20} height={60} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Internal jars (seen from top) */}
      <circle cx={10} cy={15} r={5} stroke='#9ca3af' strokeWidth={1} fill='#cd853f' />
      <circle cx={10} cy={30} r={5} stroke='#9ca3af' strokeWidth={1} fill='#556b2f' />
      <circle cx={10} cy={45} r={5} stroke='#9ca3af' strokeWidth={1} fill='#cd853f' />
      {/* Front handle */}
      <rect x={5} y={57} width={10} height={2} fill='#111827' />
    </g>
  )
}

export default SpiceRack
