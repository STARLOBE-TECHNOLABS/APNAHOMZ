import React from 'react'

const BuffetCabinet = () => {
  return (
    <g>
      <rect x={0} y={0} width={160} height={45} rx={3} stroke='#111827' strokeWidth={2} fill='white' />
      <line x1={80} y1={2} x2={80} y2={43} stroke='#111827' strokeWidth={2} />
      <line x1={40} y1={2} x2={40} y2={43} stroke='#111827' strokeWidth={1.5} />
      <line x1={120} y1={2} x2={120} y2={43} stroke='#111827' strokeWidth={1.5} />
      <circle cx={75} cy={22.5} r={1.5} fill='#111827' />
      <circle cx={85} cy={22.5} r={1.5} fill='#111827' />
      <rect x={12} y={45} width={18} height={5} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={130} y={45} width={18} height={5} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
    </g>
  )
}

export default BuffetCabinet
