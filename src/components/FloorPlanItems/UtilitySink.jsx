import React from 'react'

const UtilitySink = () => {
    return (
        <g>
            {/* Sink Countertop */}
            <rect x={0} y={0} width={60} height={50} rx={2} fill='white' stroke='#111827' strokeWidth={2} />

            {/* Sink Basin - Deep utility style */}
            <rect x={8} y={8} width={44} height={34} rx={4} fill='#f9fafb' stroke='#9ca3af' strokeWidth={1.5} />

            {/* Drain */}
            <circle cx={30} cy={25} r={3} fill='#d1d5db' stroke='#9ca3af' strokeWidth={0.5} />
            <circle cx={30} cy={25} r={1} fill='#6b7280' />

            {/* Faucet/Tap */}
            <rect x={26} y={0} width={8} height={10} fill='#9ca3af' />
            <line x1={30} y1={2} x2={30} y2={12} stroke='#4b5563' strokeWidth={2} />
            <circle cx={30} cy={12} r={2} fill='#4b5563' />

            {/* Knobs */}
            <circle cx={22} cy={4} r={2} fill='#ef4444' /> {/* Hot */}
            <circle cx={38} cy={4} r={2} fill='#3b82f6' /> {/* Cold */}
        </g>
    )
}

export default UtilitySink
