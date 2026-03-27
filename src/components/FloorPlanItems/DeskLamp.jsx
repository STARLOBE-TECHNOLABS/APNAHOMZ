import React from 'react'

const DeskLamp = () => {
    return (
        <g>
            <circle cx={15} cy={15} r={12} stroke='#111827' strokeWidth={2} fill='white' />
            <circle cx={15} cy={15} r={4} fill='#fbbf24' />
            <path d="M 15 15 L 35 30" stroke="#374151" strokeWidth={3} strokeLinecap="round" />
            <rect x={32} y={28} width={15} height={12} rx={4} transform="rotate(35 40 34)" stroke='#111827' strokeWidth={2} fill='white' />
        </g>
    )
}

export default DeskLamp
