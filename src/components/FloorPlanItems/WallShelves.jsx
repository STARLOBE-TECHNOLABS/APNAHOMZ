import React from 'react'

const WallShelves = () => {
    return (
        <g>
            <rect x={0} y={0} width={100} height={20} rx={1} stroke='#111827' strokeWidth={1} fill='white' />
            <rect x={5} y={2} width={90} height={16} rx={0.5} stroke='#e5e7eb' strokeWidth={0.5} fill='none' />
            {/* Indicating depth/brackets */}
            <line x1={15} y1={0} x2={15} y2={20} stroke='#f3f4f6' strokeWidth={1} />
            <line x1={85} y1={0} x2={85} y2={20} stroke='#f3f4f6' strokeWidth={1} />
        </g>
    )
}

export default WallShelves
