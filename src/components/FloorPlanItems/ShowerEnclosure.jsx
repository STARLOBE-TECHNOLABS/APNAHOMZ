import React from 'react'

const ShowerEnclosure = () => {
    return (
        <g>
            {/* Glass enclosure (slightly thicker stroke, light color) */}
            <rect x={0} y={0} width={90} height={90} rx={4} stroke='#9ca3af' strokeWidth={3} fill='none' />

            {/* Corner shower head */}
            <circle cx={10} cy={10} r={5} stroke='#111827' strokeWidth={2} fill='white' />
            <line x1={0} y1={0} x2={7} y2={7} stroke='#111827' strokeWidth={2} />

            {/* Central drain */}
            <circle cx={45} cy={45} r={3} stroke='#4b5563' strokeWidth={1} fill='#d1d5db' />
            <line x1={43} y1={43} x2={47} y2={47} stroke='#4b5563' strokeWidth={1} />
            <line x1={43} y1={47} x2={47} y2={43} stroke='#4b5563' strokeWidth={1} />

            {/* Water spray representation (subtle dots) */}
            <circle cx={25} cy={25} r={0.5} fill='#9ca3af' />
            <circle cx={35} cy={20} r={0.5} fill='#9ca3af' />
            <circle cx={20} cy={35} r={0.5} fill='#9ca3af' />
            <circle cx={30} cy={30} r={0.5} fill='#9ca3af' />
        </g>
    )
}

export default ShowerEnclosure
