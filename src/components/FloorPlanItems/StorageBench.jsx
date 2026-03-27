import React from 'react'

const StorageBench = () => {
    return (
        <g>
            {/* Main Bench Body */}
            <rect x={0} y={0} width={100} height={40} rx={2} fill='#f3f4f6' stroke='#111827' strokeWidth={2} />

            {/* Lid/Seat Area */}
            <rect x={2} y={2} width={96} height={36} rx={1} fill='#ffffff' stroke='#d1d5db' strokeWidth={1} />

            {/* Hinges/Handles detail */}
            <rect x={48} y={34} width={4} height={2} rx={1} fill='#9ca3af' />

            {/* Wood Grain/Plank effect */}
            <line x1={2} y1={12} x2={98} y2={12} stroke='#e5e7eb' strokeWidth={1} />
            <line x1={2} y1={24} x2={98} y2={24} stroke='#e5e7eb' strokeWidth={1} />

            {/* Cushion hint (optional) */}
            <rect x={5} y={5} width={90} height={30} rx={4} fill='none' stroke='#f3f4f6' strokeWidth={2} strokeDasharray="5 5" />
        </g>
    )
}

export default StorageBench
