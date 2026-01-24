import React from 'react'

const Bad = () => {

  return (
    <g>
      <rect x={0} y={0} width={110} height={150} rx={6} stroke='#111827' strokeWidth={2} fill='white' />
      <line x1={0} y1={30} x2={110} y2={30} stroke='#111827' strokeWidth={2}/>
      <rect x={10} y={10} width={40} height={20} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
      <rect x={60} y={10} width={40} height={20} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
    </g>
  )
}

export default Bad