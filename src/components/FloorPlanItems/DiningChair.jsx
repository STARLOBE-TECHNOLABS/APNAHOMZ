import React from 'react'

const DiningChair = () => {
  return (
    <g>
      <rect x={6} y={18} width={33} height={20} rx={3} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={10} y={6} width={25} height={12} rx={3} stroke='#111827' strokeWidth={2} fill='white' />
      <line x1={10} y1={38} x2={10} y2={44} stroke='#111827' strokeWidth={2} />
      <line x1={35} y1={38} x2={35} y2={44} stroke='#111827' strokeWidth={2} />
      <line x1={16} y1={38} x2={16} y2={44} stroke='#111827' strokeWidth={2} />
      <line x1={29} y1={38} x2={29} y2={44} stroke='#111827' strokeWidth={2} />
    </g>
  )
}

export default DiningChair
