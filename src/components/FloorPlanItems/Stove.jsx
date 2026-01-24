import React from 'react'

const Sink = () => {

  return (
      <g>
        <rect x={0} y={0} width={70} height={60} rx={2} stroke='#111827' strokeWidth={2} fill='white'></rect>
        <rect x={0} y={56} width={70} height={4} rx={1} stroke='#111827' strokeWidth={2} fill='white'></rect>

        <circle cx={20} cy={20} r={9} stroke='#111827' strokeWidth={2} fill='white'></circle>
        <circle cx={20} cy={20} r={6} stroke='#111827' strokeWidth={1} fill='white'></circle>

        <circle cx={50} cy={20} r={9} stroke='#111827' strokeWidth={2} fill='white'></circle>
        <circle cx={50} cy={20} r={5} stroke='#111827' strokeWidth={2} fill='white'></circle>

        <circle cx={20} cy={42} r={9} stroke='#111827' strokeWidth={2} fill='white'></circle>

        <circle cx={50} cy={42} r={9} stroke='#111827' strokeWidth={2} fill='white'></circle>
      </g>
  )
}

export default Sink