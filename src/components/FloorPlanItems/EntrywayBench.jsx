import React from 'react'

const EntrywayBench = () => {
    return (
        <g>
            <rect x={0} y={0} width={100} height={40} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
            <rect x={5} y={5} width={90} height={30} rx={2} stroke='#e5e7eb' strokeWidth={1} fill='none' />
            {/* Texture / Cushion indent */}
            <line x1={30} y1={5} x2={30} y2={35} stroke='#f3f4f6' strokeWidth={1} />
            <line x1={70} y1={5} x2={70} y2={35} stroke='#f3f4f6' strokeWidth={1} />
        </g>
    )
}

export default EntrywayBench
