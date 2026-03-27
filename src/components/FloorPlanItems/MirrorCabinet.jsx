import React from 'react'

const MirrorCabinet = () => {
    return (
        <g>
            {/* Cabinet Frame */}
            <rect x={0} y={0} width={60} height={20} rx={1} stroke='#111827' strokeWidth={2} fill='white' />

            {/* Reflection Lines (Diagonal) */}
            <line x1={10} y1={20} x2={25} y2={0} stroke='#9ca3af' strokeWidth={1} />
            <line x1={30} y1={20} x2={45} y2={0} stroke='#d1d5db' strokeWidth={1} />

            {/* Mirror edge bezel */}
            <rect x={2} y={2} width={56} height={16} rx={0.5} stroke='#e5e7eb' strokeWidth={0.5} fill='none' />
        </g>
    )
}

export default MirrorCabinet
