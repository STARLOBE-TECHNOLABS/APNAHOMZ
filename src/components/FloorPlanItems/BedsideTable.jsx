import React from 'react'

const BedsideTable = () => {
  return (
    <g>
      <rect x={0} y={0} width={45} height={45} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={6} y={6} width={33} height={33} rx={1} stroke='#9ca3af' strokeWidth={1} fill='none' />
      <line x1={6} y1={22.5} x2={39} y2={22.5} stroke='#9ca3af' strokeWidth={1} />
      <circle cx={34} cy={14} r={2} fill='#111827' />
      <circle cx={34} cy={31} r={2} fill='#111827' />
    </g>
  )
}

export default BedsideTable
