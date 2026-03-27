import React from 'react'

const WardrobeHinged = () => {
  return (
    <g>
      <rect x={0} y={0} width={160} height={60} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
      <line x1={53} y1={0} x2={53} y2={60} stroke='#111827' strokeWidth={2} />
      <line x1={106} y1={0} x2={106} y2={60} stroke='#111827' strokeWidth={2} />
      <circle cx={40} cy={30} r={2} fill='#111827' />
      <circle cx={66} cy={30} r={2} fill='#111827' />
      <circle cx={93} cy={30} r={2} fill='#111827' />
      <circle cx={120} cy={30} r={2} fill='#111827' />
    </g>
  )
}

export default WardrobeHinged
