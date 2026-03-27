import React from 'react'

const WashingMachine = () => {
    return (
        <g>
            {/* Main Square Body */}
            <rect x={0} y={0} width={60} height={60} rx={4} stroke='#111827' strokeWidth={2} fill='white' />

            {/* Control Panel Area */}
            <rect x={0} y={0} width={60} height={12} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
            <circle cx={10} cy={6} r={2} fill='#4b5563' /> {/* Selection Dial */}
            <rect x={18} y={4} width={10} height={4} rx={1} fill='#d1d5db' /> {/* Display */}
            <circle cx={50} cy={6} r={1.5} fill='#ef4444' /> {/* Power light */}

            {/* Circular Lid/Door (Top-down view) */}
            <circle cx={30} cy={35} r={20} stroke='#111827' strokeWidth={2} fill='white' />
            <circle cx={30} cy={35} r={16} stroke='#9ca3af' strokeWidth={1} fill='none' />

            {/* Soap dispenser indicator */}
            <rect x={5} y={15} width={12} height={10} rx={1} stroke='#d1d5db' strokeWidth={1} fill='none' />
        </g>
    )
}

export default WashingMachine
