import React from 'react'

const WallCabinet = () => {
  return (
    <g>
      {/* Shallower cabinet top view */}
      <rect x={0} y={0} width={60} height={35} rx={2} stroke='#111827' strokeWidth={2} fill='#ffffff' />

      {/* Door detail from top */}
      <path d="M 0 35 L 30 35 L 30 0 L 0 0 Z" fill='#f9fafb' stroke='#111827' strokeWidth={1} />
      <path d="M 30 35 L 60 35 L 60 0 L 30 0 Z" fill='#f9fafb' stroke='#111827' strokeWidth={1} />

      {/* Front handle */}
      <rect x={10} y={32} width={10} height={2} rx={1} fill='#6b7280' />
      <rect x={40} y={32} width={10} height={2} rx={1} fill='#6b7280' />
    </g>
  )
}

export default WallCabinet
