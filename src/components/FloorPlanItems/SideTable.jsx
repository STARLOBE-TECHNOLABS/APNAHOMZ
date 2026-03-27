import React from 'react'

const SideTable = () => {
  return (
    <g>
      {/* Square top */}
      <rect x={0} y={0} width={45} height={45} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Inner decorative detail */}
      <rect x={5} y={5} width={35} height={35} rx={1} stroke='#9ca3af' strokeWidth={1} fill='none' />
    </g>
  )
}

export default SideTable
