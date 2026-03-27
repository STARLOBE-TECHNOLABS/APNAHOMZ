import React from 'react'

const CrockeryCabinet = () => {
  return (
    <g>
      <rect x={0} y={0} width={120} height={40} rx={3} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={6} y={6} width={108} height={20} rx={2} stroke='#111827' strokeWidth={1.5} fill='white' />
      <line x1={60} y1={6} x2={60} y2={26} stroke='#111827' strokeWidth={1.5} />
      <rect x={6} y={28} width={108} height={10} rx={2} stroke='#111827' strokeWidth={1.5} fill='white' />
      <circle cx={56} cy={16} r={1.5} fill='#111827' />
      <circle cx={64} cy={16} r={1.5} fill='#111827' />
      <rect x={10} y={40} width={18} height={5} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={92} y={40} width={18} height={5} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
    </g>
  )
}

export default CrockeryCabinet
