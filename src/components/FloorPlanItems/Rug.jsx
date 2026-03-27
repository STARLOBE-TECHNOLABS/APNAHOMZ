import React from 'react'

const Rug = () => {
  return (
    <g>
      {/* Rectangular rug with dashed border for textile feel */}
      <rect x={0} y={0} width={200} height={140} rx={2} stroke='#111827' strokeWidth={1} strokeDasharray={4} fill='#f3f4f6' />
      {/* Decorative inner pattern */}
      <rect x={15} y={15} width={170} height={110} rx={1} stroke='#d1d5db' strokeWidth={1} fill='none' />
      <line x1={0} y1={0} x2={15} y2={15} stroke='#d1d5db' strokeWidth={1} />
      <line x1={200} y1={0} x2={185} y2={15} stroke='#d1d5db' strokeWidth={1} />
      <line x1={0} y1={140} x2={15} y2={125} stroke='#d1d5db' strokeWidth={1} />
      <line x1={200} y1={140} x2={185} y2={125} stroke='#d1d5db' strokeWidth={1} />
    </g>
  )
}

export default Rug
