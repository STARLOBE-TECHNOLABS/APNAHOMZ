import React from 'react'

const RoundTable = () => {

  return (
      <g>
          <circle cx={65} cy={65} r={34} stroke='#111827' strokeWidth={2} fill='white'/>
          <g>
            <rect x={2} y={52.5} width={25} height={26} rx={6} stroke='#111827' strokeWidth={2} fill='white' />
            <rect x={2} y={51.5} width={4} height={28} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
          </g>
          <g>
            <rect x={52.5} y={1} width={25} height={26} rx={6} stroke='#111827' strokeWidth={2} fill='white' />
            <rect x={51} y={1} width={28} height={4} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
          </g>
          <g>
            <rect x={103} y={52.5} width={25} height={26} rx={6} stroke='#111827' strokeWidth={2} fill='white' />
            <rect x={124} y={51.5} width={4} height={28} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
          </g>
          <g>
            <rect x={52.5} y={103} width={25} height={26} rx={6} stroke='#111827' strokeWidth={2} fill='white' />
            <rect x={51} y={125} width={28} height={4} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
          </g>
      </g>
  )
}

export default RoundTable