import React from 'react'

const Door = ({ item }) => {
  const flip = item?.flip || false;

  return (
      <g transform={flip ? "translate(60, 0) scale(-1, 1)" : ""}>
          {/* Thicker threshold to better mask the wall (height increased from 4 to 8) */}
          <rect x={0} y={49} width={60} height={8} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
          <line x1={60} y1={53} x2={60} y2={0} stroke='#111827' strokeWidth={2}/>
          <path d={`M ${60} 1 Q 6 6 0 ${53}`} fill="none" stroke='#111827' strokeWidth={2} strokeDasharray={3}/>
      </g>
  )
}

export default Door