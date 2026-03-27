import React from 'react'

const WallHook = () => {
    return (
        <g>
            {/* Mounting Plate */}
            <rect x={0} y={0} width={15} height={5} rx={1} fill='#9ca3af' stroke='#4b5563' strokeWidth={0.5} />

            {/* The Hook itself (Top-down view) */}
            <path d="M7.5 5 L7.5 12 Q7.5 15 10 15" fill='none' stroke='#374151' strokeWidth={2} strokeLinecap='round' />

            {/* Screws */}
            <circle cx={3} cy={2.5} r={0.8} fill='#4b5563' />
            <circle cx={12} cy={2.5} r={0.8} fill='#4b5563' />
        </g>
    )
}

export default WallHook
