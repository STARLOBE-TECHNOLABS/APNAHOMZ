import React from 'react'

const Curtains = () => {
  return (
    <g>
      {/* Curtain rod */}
      <line x1={0} y1={5} x2={100} y2={5} stroke='#111827' strokeWidth={2} />
      {/* Left curtain fold */}
      <path d="M 0 5 Q 10 20 0 35 L 20 35 Q 30 20 20 5 Z" stroke='#111827' strokeWidth={1} fill='#b04a5a' />
      {/* Right curtain fold */}
      <path d="M 100 5 Q 90 20 100 35 L 80 35 Q 70 20 80 5 Z" stroke='#111827' strokeWidth={1} fill='#b04a5a' />
    </g>
  )
}

export default Curtains
