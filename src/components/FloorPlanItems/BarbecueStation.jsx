import React from 'react'

const BarbecueStation = () => {
    return (
        <g>
            {/* Side Shelves */}
            <rect x={0} y={10} width={15} height={30} fill='#d1d5db' stroke='#374151' strokeWidth={1} />
            <rect x={65} y={10} width={15} height={30} fill='#d1d5db' stroke='#374151' strokeWidth={1} />

            {/* Main BBQ Body */}
            <rect x={15} y={0} width={50} height={50} rx={6} fill='#1f2937' stroke='#111827' strokeWidth={2} />

            {/* Grill Lid Handle */}
            <rect x={25} y={42} width={30} height={4} rx={2} fill='#9ca3af' />

            {/* Temperature Gauge */}
            <circle cx={40} cy={20} r={5} fill='white' stroke='#374151' strokeWidth={1} />
            <line x1={40} y1={20} x2={43} y2={17} stroke='#ef4444' strokeWidth={1} />

            {/* Control Knobs */}
            <circle cx={25} cy={40} r={2} fill='#d1d5db' />
            <circle cx={40} cy={40} r={2} fill='#d1d5db' />
            <circle cx={55} cy={40} r={2} fill='#d1d5db' />

            {/* Grate hint */}
            <line x1={20} y1={10} x2={60} y2={10} stroke='#4b5563' strokeWidth={0.5} />
            <line x1={20} y1={15} x2={60} y2={15} stroke='#4b5563' strokeWidth={0.5} />
            <line x1={20} y1={20} x2={60} y2={20} stroke='#4b5563' strokeWidth={0.5} />
        </g>
    )
}

export default BarbecueStation
