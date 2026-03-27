import React from 'react'

const BarStool = () => {
  return (
    <g>
      {/* Base/legs and shadow indication */}
      <circle cx={20} cy={20} r={16} stroke='#e5e7eb' strokeWidth={1} fill='#f3f4f6' />
      {/* Footrest ring */}
      <circle cx={20} cy={20} r={12} stroke='#9ca3af' strokeWidth={1} fill='none' />
      {/* Seat main structure */}
      <circle cx={20} cy={20} r={18} stroke='#111827' strokeWidth={2} fill='#ffffff' />
      {/* Inner cushion detail (leather/fabric look) */}
      <circle cx={20} cy={20} r={14} fill='#f8fafc' />
      <circle cx={20} cy={20} r={10} stroke='#e5e7eb' strokeWidth={1} fill='none' />
      {/* Button tufting in center */}
      <circle cx={20} cy={20} r={2} fill='#d1d5db' />
      {/* Backrest (curve contour) */}
      <path d="M 4 12 A 16 16 0 0 1 36 12" fill='none' stroke='#111827' strokeWidth={3} strokeLinecap="round" />
    </g>
  )
}

export default BarStool
