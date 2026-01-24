import React from 'react'

const Window = () => {

  return (
    <g transform='translate(0 2.5)'>
        <rect x={0} y={0} width={90} height={5} rx={1} stroke='#111827' strokeWidth={1} fill='white' />
        <line x1={0} y1={2.5} x2={90} y2={2.5} stroke='#111827' strokeWidth={0.8}/>
    </g>
  )
}

export default Window