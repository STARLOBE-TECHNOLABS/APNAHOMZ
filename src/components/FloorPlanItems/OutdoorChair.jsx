import React from 'react'

const OutdoorChair = () => {
    return (
        <g>
            {/* Seat Base */}
            <rect x={0} y={0} width={45} height={45} rx={4} fill='#d1d5db' stroke='#4b5563' strokeWidth={1.5} />

            {/* Woven Texture / Slats effect */}
            <line x1={5} y1={10} x2={40} y2={10} stroke='#9ca3af' strokeWidth={1} />
            <line x1={5} y1={20} x2={40} y2={20} stroke='#9ca3af' strokeWidth={1} />
            <line x1={5} y1={30} x2={40} y2={30} stroke='#9ca3af' strokeWidth={1} />

            {/* Backrest (Top-down view) */}
            <rect x={0} y={0} width={45} height={6} rx={2} fill='#4b5563' />

            {/* Armrests */}
            <rect x={0} y={6} width={4} height={34} rx={1} fill='#6b7280' />
            <rect x={41} y={6} width={4} height={34} rx={1} fill='#6b7280' />

            {/* Leg details (Small circles at corners) */}
            <circle cx={4} cy={41} r={1.5} fill='#374151' />
            <circle cx={41} cy={41} r={1.5} fill='#374151' />
        </g>
    )
}

export default OutdoorChair
