import React from 'react'

const KitchenIsland = () => {
  return (
    <g>
      {/* Large central island unit countertop */}
      <rect x={0} y={0} width={180} height={90} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Decorative inner line for work surface */}
      <rect x={10} y={10} width={160} height={70} rx={2} stroke='#e5e7eb' strokeWidth={1} fill='none' />
      {/* Indication of storage/drawers on front edge */}
      <line x1={60} y1={0} x2={60} y2={10} stroke='#111827' strokeWidth={1} />
      <line x1={120} y1={0} x2={120} y2={10} stroke='#111827' strokeWidth={1} />
    </g>
  )
}

export default KitchenIsland
