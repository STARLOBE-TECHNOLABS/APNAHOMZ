import React from 'react'

const MedicineCabinet = () => {
    return (
        <g>
            {/* Frame */}
            <rect x={0} y={0} width={35} height={10} rx={1} stroke='#111827' strokeWidth={2} fill='white' />

            {/* Red cross indicator for clarity/realism */}
            <rect x={15} y={4} width={5} height={2} fill='#ef4444' />
            <rect x={16.5} y={2.5} width={2} height={5} fill='#ef4444' />

            {/* Bezel */}
            <rect x={2} y={2} width={31} height={6} stroke='#e5e7eb' strokeWidth={0.5} fill='none' />
        </g>
    )
}

export default MedicineCabinet
