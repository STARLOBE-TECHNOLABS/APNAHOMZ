import React from 'react'

const DryerStand = () => {
    return (
        <g>
            {/* Main Framework Outline */}
            <rect x={0} y={0} width={64} height={64} fill='none' stroke='#4b5563' strokeWidth={2} />

            {/* Back Vertical Braces */}
            <line x1={4} y1={0} x2={4} y2={64} stroke='#9ca3af' strokeWidth={1.5} />
            <line x1={60} y1={0} x2={60} y2={64} stroke='#9ca3af' strokeWidth={1.5} />

            {/* Side Horizontal Supports */}
            <line x1={0} y1={10} x2={4} y2={10} stroke='#4b5563' strokeWidth={2} />
            <line x1={60} y1={10} x2={64} y2={10} stroke='#4b5563' strokeWidth={2} />

            {/* Surface/Shelf for the dryer */}
            <rect x={4} y={4} width={56} height={56} rx={1} fill='#f9fafb' stroke='#d1d5db' strokeWidth={1} />

            {/* Reinforcement X-brace (simplified for top-down) */}
            <line x1={5} y1={5} x2={59} y2={59} stroke='#e5e7eb' strokeWidth={0.5} />
            <line x1={59} y1={5} x2={5} y2={59} stroke='#e5e7eb' strokeWidth={0.5} />
        </g>
    )
}

export default DryerStand
