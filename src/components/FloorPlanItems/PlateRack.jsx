import React from 'react'

const PlateRack = () => {
  return (
    <g>
      {/* Wall-mounted Plate Rack (Top View) */}
      <rect x={0} y={0} width={80} height={40} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
      {/* Back Panel line */}
      <line x1={0} y1={5} x2={80} y2={5} stroke='#111827' strokeWidth={1} />
      {/* Plates seen from top (thin slices) */}
      {/* We use ellipses to show the top edge of plates */}
      {[10, 20, 30, 40, 50, 60, 70].map((x, i) => (
        <ellipse key={i} cx={x} cy={20} rx={1} ry={12} stroke='#111827' strokeWidth={1.5} fill='#ffffff' />
      ))}
      {/* Front support bar */}
      <rect x={0} y={35} width={80} height={2} fill='#111827' />
    </g>
  )
}

export default PlateRack
