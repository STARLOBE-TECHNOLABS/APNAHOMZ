import React from 'react'

const Refrigerator = () => {
  return (
    <g>
      {/* Refrigerator main body with shadow edge */}
      <rect x={0} y={0} width={90} height={90} rx={4} stroke='#111827' strokeWidth={2} fill='#ffffff' />

      {/* Left Door (Freezer Side or Double Door) */}
      <rect x={2} y={2} width={42} height={86} rx={2} fill='#f3f4f6' stroke='#d1d5db' strokeWidth={1} />
      {/* Left Handle */}
      <rect x={38} y={35} width={3} height={20} rx={1.5} fill='#4b5563' />

      {/* Right Door (Fridge Side) */}
      <rect x={46} y={2} width={42} height={86} rx={2} fill='#f3f4f6' stroke='#d1d5db' strokeWidth={1} />
      {/* Right Handle */}
      <rect x={49} y={35} width={3} height={20} rx={1.5} fill='#4b5563' />

      {/* Digital Display (Ice Maker / Dispenser) */}
      <rect x={12} y={20} width={16} height={25} rx={2} fill='#111827' />
      <rect x={14} y={22} width={12} height={8} rx={1} fill='#374151' />

      {/* Door gap */}
      <line x1={45} y1={0} x2={45} y2={90} stroke='#111827' strokeWidth={1.5} />
    </g>
  )
}

export default Refrigerator
