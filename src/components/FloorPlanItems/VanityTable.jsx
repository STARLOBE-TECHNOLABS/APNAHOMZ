import React from 'react'

const VanityTable = () => {
  return (
    <g>
      <rect x={0} y={10} width={120} height={40} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={10} y={15} width={100} height={30} rx={1} stroke='#9ca3af' strokeWidth={1} fill='none' />
      <circle cx={60} cy={5} r={5} stroke='#111827' strokeWidth={2} fill='white' />
      <circle cx={60} cy={40} r={6} stroke='#111827' strokeWidth={2} fill='white' />
    </g>
  )
}

export default VanityTable
