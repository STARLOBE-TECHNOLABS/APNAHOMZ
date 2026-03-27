import React from 'react'

const Bookshelf = () => {
  return (
    <g>
      {/* Outer frame */}
      <rect x={0} y={0} width={120} height={35} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Shelf dividers / books */}
      <line x1={30} y1={0} x2={30} y2={35} stroke='#111827' strokeWidth={2} />
      <line x1={60} y1={0} x2={60} y2={35} stroke='#111827' strokeWidth={2} />
      <line x1={90} y1={0} x2={90} y2={35} stroke='#111827' strokeWidth={2} />
      {/* Random book widths */}
      <rect x={5} y={5} width={10} height={25} fill='#9ca3af' />
      <rect x={18} y={5} width={8} height={25} fill='#d1d5db' />
      <rect x={35} y={5} width={12} height={25} fill='#9ca3af' />
      <rect x={65} y={5} width={15} height={25} fill='#d1d5db' />
      <rect x={95} y={5} width={10} height={25} fill='#9ca3af' />
    </g>
  )
}

export default Bookshelf
