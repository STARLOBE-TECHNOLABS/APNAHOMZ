import React from 'react'

const PullOutBasket = () => {
  return (
    <g>
      {/* Pull-out Basket (Top View) */}
      <rect x={0} y={0} width={60} height={60} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Internal basket wires (seen from top) */}
      <rect x={5} y={5} width={50} height={50} rx={1} stroke='#9ca3af' strokeWidth={1} fill='none' />
      <line x1={5} y1={20} x2={55} y2={20} stroke='#e5e7eb' strokeWidth={1} />
      <line x1={5} y1={35} x2={55} y2={35} stroke='#e5e7eb' strokeWidth={1} />
      <line x1={5} y1={50} x2={55} y2={50} stroke='#e5e7eb' strokeWidth={1} />
      {/* Front panel (Door edge) */}
      <rect x={0} y={57} width={60} height={3} fill='#111827' />
      {/* Handle */}
      <rect x={20} y={58} width={20} height={2} fill='#9ca3af' />
    </g>
  )
}

export default PullOutBasket
