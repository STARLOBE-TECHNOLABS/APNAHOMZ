import React from 'react'

const Sofa = () => {

  return (
     <g>
        {/* Main base */}
        <rect x={0} y={10} width={180} height={55} rx={4} stroke='#111827' strokeWidth={2} fill='white'></rect>
        {/* Backrest */}
        <rect x={0} y={0} width={180} height={15} rx={4} stroke='#111827' strokeWidth={2} fill='white'></rect>
        {/* Left armrest */}
        <rect x={0} y={0} width={20} height={65} rx={4} stroke='#111827' strokeWidth={2} fill='white'></rect>
        {/* Right armrest */}
        <rect x={160} y={0} width={20} height={65} rx={4} stroke='#111827' strokeWidth={2} fill='white'></rect>
        {/* Seat cushions divider */}
        <line x1={90} y1={15} x2={90} y2={65} stroke='#111827' strokeWidth={2} />
      </g>
  )
}

export default Sofa