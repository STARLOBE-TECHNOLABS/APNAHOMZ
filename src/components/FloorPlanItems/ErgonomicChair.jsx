import React from 'react'

const ErgonomicChair = () => {
    return (
        <g>
            {/* Seat base */}
            <rect x={10} y={15} width={50} height={45} rx={10} stroke='#111827' strokeWidth={2} fill='white' />
            {/* Backrest */}
            <path d="M 10 15 Q 35 0 60 15" fill="none" stroke="#111827" strokeWidth={2} />
            <rect x={15} y={5} width={40} height={10} rx={3} stroke='#374151' strokeWidth={1} fill='#f3f4f6' />
            {/* Armrests */}
            <rect x={0} y={25} width={10} height={25} rx={2} stroke='#111827' strokeWidth={1} fill='white' />
            <rect x={60} y={25} width={10} height={25} rx={2} stroke='#111827' strokeWidth={1} fill='white' />
            {/* Center wheel base (symbolic top view) */}
            <circle cx={35} cy={37} r={4} fill="#111827" />
        </g>
    )
}

export default ErgonomicChair
