import React from 'react'

const ChestOfDrawers = () => {
  return (
    <g>
      <rect x={0} y={0} width={90} height={50} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
      <line x1={0} y1={12.5} x2={90} y2={12.5} stroke='#111827' strokeWidth={1} />
      <line x1={0} y1={25} x2={90} y2={25} stroke='#111827' strokeWidth={1} />
      <line x1={0} y1={37.5} x2={90} y2={37.5} stroke='#111827' strokeWidth={1} />
      <circle cx={15} cy={6.25} r={2} fill='#111827' />
      <circle cx={75} cy={6.25} r={2} fill='#111827' />
      <circle cx={15} cy={18.75} r={2} fill='#111827' />
      <circle cx={75} cy={18.75} r={2} fill='#111827' />
      <circle cx={15} cy={31.25} r={2} fill='#111827' />
      <circle cx={75} cy={31.25} r={2} fill='#111827' />
      <circle cx={15} cy={43.75} r={2} fill='#111827' />
      <circle cx={75} cy={43.75} r={2} fill='#111827' />
    </g>
  )
}

export default ChestOfDrawers
