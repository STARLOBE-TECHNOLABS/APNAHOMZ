import React from 'react'

const ReclinerChair = () => {
  return (
    <g>
      {/* Main seat */}
      <rect x={10} y={15} width={60} height={55} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Backrest (tilted look) */}
      <rect x={10} y={0} width={60} height={20} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Left armrest */}
      <rect x={0} y={5} width={15} height={70} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Right armrest */}
      <rect x={65} y={5} width={15} height={70} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Footrest indication */}
      <rect x={15} y={70} width={50} height={10} rx={2} stroke='#111827' strokeWidth={1} fill='white' />
    </g>
  )
}

export default ReclinerChair
