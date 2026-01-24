import React from 'react'

const Sink = () => {

  return (
     <g>
        <rect x={0} y={0} width={180} height={55} rx={2} stroke='#111827' strokeWidth={2} fill='white'></rect>
        <line x1={90} y1={0} x2={90} y2={55} stroke='#111827' strokeWidth={2} fill='white'/>
        <rect x={0} y={0} width={15} height={70} rx={6} stroke='#111827' strokeWidth={2} fill='white'></rect>
        <rect x={165} y={0} width={15} height={70} rx={6} stroke='#111827' strokeWidth={2} fill='white'></rect>
        <rect x={0} y={0} width={180} height={15} rx={2} stroke='#111827' strokeWidth={2} fill='white'></rect>
      </g>
  )
}

export default Sink