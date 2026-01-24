import React from 'react'

const Table = () => {

  return (
      <g>
          <rect x={30} y={0} width={70} height={90} rx={6} stroke='#111827' strokeWidth={2} fill='white' />
          <g>
            <rect x={0} y={10} width={25} height={26} rx={6} stroke='#111827' strokeWidth={2} fill='white' />
            <rect x={0} y={9} width={4} height={28} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
          </g>
          <g transform='translate(0 45)'>
            <rect x={0} y={10} width={25} height={26} rx={6} stroke='#111827' strokeWidth={2} fill='white' />
            <rect x={0} y={9} width={4} height={28} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
          </g>
          <g>
            <rect x={105} y={10} width={25} height={26} rx={6} stroke='#111827' strokeWidth={2} fill='white' />
            <rect x={126} y={9} width={4} height={28} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
          </g>
          <g transform='translate(0 45)'>
            <rect x={105} y={10} width={25} height={26} rx={6} stroke='#111827' strokeWidth={2} fill='white' />
            <rect x={126} y={9} width={4} height={28} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
          </g>
      </g>
  )
}

export default Table