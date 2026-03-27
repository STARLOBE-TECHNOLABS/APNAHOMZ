import React from 'react'

const BarCabinet = () => {
  return (
    <g>
      <rect x={0} y={0} width={100} height={40} rx={3} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={6} y={6} width={88} height={16} rx={2} stroke='#111827' strokeWidth={1.5} fill='white' />
      <line x1={50} y1={6} x2={50} y2={22} stroke='#111827' strokeWidth={1.5} />
      <rect x={6} y={24} width={88} height={10} rx={2} stroke='#111827' strokeWidth={1.5} fill='white' />
      <circle cx={46} cy={14} r={1.5} fill='#111827' />
      <circle cx={54} cy={14} r={1.5} fill='#111827' />
      <rect x={8} y={40} width={14} height={5} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={78} y={40} width={14} height={5} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
    </g>
  )
}

export default BarCabinet
