import React from 'react'

const BunkBed = () => {
  return (
    <g>
      <rect x={0} y={0} width={100} height={200} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={8} y={10} width={84} height={80} rx={3} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={8} y={110} width={84} height={80} rx={3} stroke='#111827' strokeWidth={2} fill='white' />
      <line x1={92} y1={10} x2={92} y2={190} stroke='#111827' strokeWidth={2} />
      {[30, 55, 80, 105, 130, 155, 180].map((y) => (
        <line key={y} x1={84} y1={y} x2={100} y2={y} stroke='#111827' strokeWidth={2} />
      ))}
    </g>
  )
}

export default BunkBed
