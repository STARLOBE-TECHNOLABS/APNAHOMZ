import React from 'react'

const Lamp = () => {
  return (
    <g>
      {/* Base of the lamp */}
      <circle cx={15} cy={15} r={8} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Shade of the lamp */}
      <circle cx={15} cy={15} r={14} stroke='#111827' strokeWidth={1} strokeDasharray={2} fill='none' />
      {/* Light center */}
      <circle cx={15} cy={15} r={2} fill='#facc15' />
    </g>
  )
}

export default Lamp
