import React from 'react'

const Dresser = () => {
  return (
    <g>
      <rect x={0} y={0} width={120} height={50} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
      <line x1={0} y1={16.5} x2={120} y2={16.5} stroke='#111827' strokeWidth={1} />
      <line x1={0} y1={33} x2={120} y2={33} stroke='#111827' strokeWidth={1} />
      <circle cx={20} cy={8.25} r={2} fill='#111827' />
      <circle cx={100} cy={8.25} r={2} fill='#111827' />
      <circle cx={20} cy={24.75} r={2} fill='#111827' />
      <circle cx={100} cy={24.75} r={2} fill='#111827' />
      <circle cx={20} cy={41.25} r={2} fill='#111827' />
      <circle cx={100} cy={41.25} r={2} fill='#111827' />
    </g>
  )
}

export default Dresser
