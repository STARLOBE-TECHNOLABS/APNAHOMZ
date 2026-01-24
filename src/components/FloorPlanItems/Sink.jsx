import React from 'react'

const Sink = () => {

  return (
      <g>
        <rect x={0} y={0} width={70} height={40} rx={2} stroke='#111827' strokeWidth={2} fill='white'></rect>
        <rect x={0} y={0} width={70} height={8} rx={2} stroke='#111827' strokeWidth={2} fill='white'></rect>
        <rect x={10} y={15} width={50} height={20} rx={6} stroke='#111827' strokeWidth={2} fill='white'></rect>
        <ellipse cx={35} cy={24} rx={4} ry={4} stroke='#111827' strokeWidth={2} fill='white'></ellipse>
        <rect x={30} y={0} width={10} height={16} rx={2} stroke='#111827' strokeWidth={2} fill='white'></rect>
      </g>
  )
}

export default Sink