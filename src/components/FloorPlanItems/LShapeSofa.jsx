import React from 'react'

const LShapeSofa = () => {
  return (
    <g>
      {/* Main horizontal section */}
      <rect x={0} y={10} width={180} height={55} rx={4} stroke='#111827' strokeWidth={2} fill='white'></rect>
      {/* Vertical L section */}
      <rect x={125} y={65} width={55} height={100} rx={4} stroke='#111827' strokeWidth={2} fill='white'></rect>
      
      {/* Backrest for horizontal section */}
      <rect x={0} y={0} width={180} height={15} rx={4} stroke='#111827' strokeWidth={2} fill='white'></rect>
      {/* Backrest for vertical section */}
      <rect x={165} y={15} width={15} height={150} rx={4} stroke='#111827' strokeWidth={2} fill='white'></rect>
      
      {/* Armrest left */}
      <rect x={0} y={0} width={15} height={65} rx={4} stroke='#111827' strokeWidth={2} fill='white'></rect>
      {/* Armrest bottom */}
      <rect x={125} y={150} width={55} height={15} rx={4} stroke='#111827' strokeWidth={2} fill='white'></rect>
      
      {/* Seat dividers */}
      <line x1={60} y1={15} x2={60} y2={65} stroke='#111827' strokeWidth={2} />
      <line x1={125} y1={15} x2={125} y2={65} stroke='#111827' strokeWidth={2} />
      <line x1={125} y1={110} x2={165} y2={110} stroke='#111827' strokeWidth={2} />
    </g>
  )
}

export default LShapeSofa
