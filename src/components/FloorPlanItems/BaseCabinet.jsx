import React from 'react'

const BaseCabinet = () => {
  return (
    <g>
      {/* Base Cabinet Body (Top View) */}
      <rect x={0} y={0} width={60} height={60} rx={2} stroke='#111827' strokeWidth={2} fill='#ffffff' />

      {/* Actual countertop edge (overhang) */}
      <rect x={-1} y={56} width={62} height={4} rx={1} fill='#ffffff' stroke='#111827' strokeWidth={1.5} />

      {/* Countertop surface texture / detail */}
      <line x1={0} y1={56} x2={60} y2={56} stroke='#d1d5db' strokeWidth={1} />

      {/* Drawer lines / doors seen from top (subtle) */}
      <line x1={2} y1={2} x2={58} y2={2} stroke='#d1d5db' strokeWidth={1} />
      <line x1={30} y1={4} x2={30} y2={54} stroke='#e5e7eb' strokeWidth={1} />

      {/* Handles (slim metallic) */}
      <rect x={10} y={51} width={10} height={2} rx={1} fill='#6b7280' />
      <rect x={40} y={51} width={10} height={2} rx={1} fill='#6b7280' />
    </g>
  )
}

export default BaseCabinet
