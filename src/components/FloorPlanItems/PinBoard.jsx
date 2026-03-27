import React from 'react'

const PinBoard = () => {
    return (
        <g>
            {/* Frame */}
            <rect x={0} y={0} width={80} height={60} rx={2} stroke='#111827' strokeWidth={2} fill='white' />

            {/* Cork texture (subtle dots) */}
            <circle cx={10} cy={10} r={0.5} fill='#9ca3af' />
            <circle cx={25} cy={15} r={0.5} fill='#9ca3af' />
            <circle cx={40} cy={10} r={0.5} fill='#9ca3af' />
            <circle cx={55} cy={18} r={0.5} fill='#9ca3af' />
            <circle cx={70} cy={12} r={0.5} fill='#9ca3af' />

            <circle cx={15} cy={30} r={0.5} fill='#9ca3af' />
            <circle cx={35} cy={28} r={0.5} fill='#9ca3af' />
            <circle cx={50} cy={35} r={0.5} fill='#9ca3af' />
            <circle cx={65} cy={32} r={0.5} fill='#9ca3af' />

            <circle cx={20} cy={50} r={0.5} fill='#9ca3af' />
            <circle cx={45} cy={48} r={0.5} fill='#9ca3af' />
            <circle cx={60} cy={52} r={0.5} fill='#9ca3af' />

            {/* Pinned papers representative */}
            <rect x={10} y={15} width={15} height={20} fill='none' stroke='#d1d5db' strokeWidth={1} />
            <rect x={40} y={20} width={20} height={15} fill='none' stroke='#d1d5db' strokeWidth={1} />
            <rect x={20} y={35} width={12} height={12} fill='none' stroke='#d1d5db' strokeWidth={1} />

            {/* Push pins */}
            <circle cx={10} cy={15} r={2} fill='#ef4444' />
            <circle cx={60} cy={20} r={2} fill='#3b82f6' />
        </g>
    )
}

export default PinBoard
