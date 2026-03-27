import React from 'react'

const Ottoman = () => {
  return (
    <g>
      {/* Circular pouf shape */}
      <circle cx={25} cy={25} r={22} stroke='#111827' strokeWidth={2} fill='#5c4033' />
      {/* Tufted pattern in center */}
      <circle cx={25} cy={25} r={3} fill='#111827' />
      <path d="M 25 10 L 25 15 M 25 35 L 25 40 M 10 25 L 15 25 M 35 25 L 40 25" stroke='#9ca3af' strokeWidth={1} />
    </g>
  )
}

export default Ottoman
