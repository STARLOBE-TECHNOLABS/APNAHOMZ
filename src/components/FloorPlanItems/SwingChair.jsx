import React from 'react'

const SwingChair = () => {
    return (
        <g>
            {/* Base Stand (Circular) */}
            <circle cx={40} cy={40} r={35} fill='none' stroke='#4b5563' strokeWidth={2} />

            {/* Main Pole/Structure */}
            <path d="M40 5 L40 15" stroke='#374151' strokeWidth={4} strokeLinecap='round' />

            {/* Hanging Basket Chair (Egg shape from top-down) */}
            <ellipse cx={40} cy={45} rx={25} ry={20} fill='#ffffff' stroke='#111827' strokeWidth={2} />

            {/* Interior Cushion */}
            <ellipse cx={40} cy={48} rx={20} ry={15} fill='#f3f4f6' stroke='#d1d5db' strokeWidth={1} />

            {/* Hanging chain/rope visual */}
            <circle cx={40} cy={20} r={2} fill='#6b7280' />
            <line x1={40} y1={20} x2={40} y2={25} stroke='#6b7280' strokeWidth={1} />

            {/* Wicker Pattern detail */}
            <path d="M25 45 Q40 35 55 45" fill='none' stroke='#9ca3af' strokeWidth={0.5} />
            <path d="M22 50 Q40 40 58 50" fill='none' stroke='#9ca3af' strokeWidth={0.5} />
        </g>
    )
}

export default SwingChair
