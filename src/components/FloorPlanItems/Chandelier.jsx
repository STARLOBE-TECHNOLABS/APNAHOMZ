import React from 'react'

const Chandelier = () => {
  return (
    <g>
      <circle cx={30} cy={30} r={18} stroke='#111827' strokeWidth={2} fill='white' />
      <circle cx={30} cy={30} r={3} fill='#111827' />
      <line x1={30} y1={12} x2={30} y2={6} stroke='#111827' strokeWidth={2} />
      <line x1={12} y1={30} x2={6} y2={30} stroke='#111827' strokeWidth={2} />
      <line x1={48} y1={30} x2={54} y2={30} stroke='#111827' strokeWidth={2} />
      <line x1={30} y1={48} x2={30} y2={54} stroke='#111827' strokeWidth={2} />
      <line x1={18} y1={18} x2={12} y2={12} stroke='#111827' strokeWidth={2} />
      <line x1={42} y1={18} x2={48} y2={12} stroke='#111827' strokeWidth={2} />
      <line x1={18} y1={42} x2={12} y2={48} stroke='#111827' strokeWidth={2} />
      <line x1={42} y1={42} x2={48} y2={48} stroke='#111827' strokeWidth={2} />
    </g>
  )
}

export default Chandelier
