import React from 'react'

const Headboard = () => {
  return (
    <g>
      <rect x={0} y={0} width={200} height={25} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
      <line x1={0} y1={12.5} x2={200} y2={12.5} stroke='#e5e7eb' strokeWidth={1} />
    </g>
  )
}

export default Headboard
