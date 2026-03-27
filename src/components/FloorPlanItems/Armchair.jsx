import React from 'react'

const Armchair = () => {
  return (
    <g>
      {/* Main seat */}
      <rect x={10} y={10} width={60} height={50} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Backrest */}
      <rect x={10} y={0} width={60} height={15} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Left armrest */}
      <rect x={0} y={0} width={15} height={65} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Right armrest */}
      <rect x={65} y={0} width={15} height={65} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
    </g>
  )
}

export default Armchair
