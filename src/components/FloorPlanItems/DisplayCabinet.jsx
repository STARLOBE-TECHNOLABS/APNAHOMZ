import React from 'react'

const DisplayCabinet = () => {
  return (
    <g>
      <rect x={0} y={0} width={90} height={36} rx={3} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={6} y={6} width={78} height={24} rx={2} stroke='#111827' strokeWidth={1.5} fill='white' />
      <line x1={45} y1={6} x2={45} y2={30} stroke='#111827' strokeWidth={1.5} />
      <line x1={6} y1={18} x2={84} y2={18} stroke='#111827' strokeWidth={1} />
      <rect x={10} y={36} width={14} height={4} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={66} y={36} width={14} height={4} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
    </g>
  )
}

export default DisplayCabinet
