import React from 'react'

const IroningBoardCabinet = () => {
    return (
        <g>
            {/* Cabinet Outer Frame */}
            <rect x={0} y={0} width={20} height={100} rx={2} fill='#ffffff' stroke='#111827' strokeWidth={2} />

            {/* Handle */}
            <rect x={16} y={40} width={2} height={20} rx={1} fill='#4b5563' />

            {/* Ironing Board (Folded representation inside or on door) */}
            <path d="M4 10 L16 10 L16 90 L4 90 Z" fill='#f3f4f6' stroke='#d1d5db' strokeWidth={1} />

            {/* Tapered end of the board (visual hint) */}
            <path d="M4 15 L10 5 L16 15" fill='none' stroke='#9ca3af' strokeWidth={1} />

            {/* Internal Shelf line */}
            <line x1={0} y1={30} x2={20} y2={30} stroke='#e5e7eb' strokeWidth={1} />
        </g>
    )
}

export default IroningBoardCabinet
