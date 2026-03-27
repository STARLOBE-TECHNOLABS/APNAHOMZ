import React from 'react'

const Sink = () => {
  return (
    <g>
      {/* Main counter structure */}
      <rect x={0} y={0} width={70} height={40} rx={2} stroke='#111827' strokeWidth={2} fill='#ffffff' />

      {/* Metallic Sink basin outer rim */}
      <rect x={5} y={5} width={60} height={30} rx={4} stroke='#9ca3af' strokeWidth={2} fill='#e5e7eb' />

      {/* Sink basin inner drop */}
      <rect x={8} y={8} width={54} height={24} rx={3} stroke='#d1d5db' strokeWidth={1} fill='#f3f4f6' />

      {/* Drain */}
      <circle cx={35} cy={20} r={2.5} stroke='#4b5563' strokeWidth={1} fill='#111827' />

      {/* Faucet Base */}
      <circle cx={35} cy={5} r={3} fill='#6b7280' />
      {/* Faucet Neck */}
      <path d="M 35 5 L 35 15" stroke='#6b7280' strokeWidth={2} strokeLinecap="round" />
      {/* Faucet Knobs / Handles */}
      <line x1={28} y1={5} x2={32} y2={5} stroke='#4b5563' strokeWidth={2} strokeLinecap="round" />
      <line x1={38} y1={5} x2={42} y2={5} stroke='#4b5563' strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

export default Sink