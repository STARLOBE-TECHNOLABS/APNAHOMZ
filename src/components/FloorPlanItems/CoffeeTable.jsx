import React from 'react'

const CoffeeTable = () => {
  return (
    <g>
      {/* Table top */}
      <rect x={0} y={0} width={120} height={60} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Decorative inner line or pattern */}
      <rect x={10} y={10} width={100} height={40} rx={2} stroke='#9ca3af' strokeWidth={1} fill='none' />
    </g>
  )
}

export default CoffeeTable
