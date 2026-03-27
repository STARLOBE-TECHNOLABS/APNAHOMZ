import React from 'react'

const ShoeCabinet = () => {
    return (
        <g>
            <rect x={0} y={0} width={70} height={25} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
            <line x1={35} y1={0} x2={35} y2={25} stroke='#111827' strokeWidth={2} />
            {/* Knobs */}
            <circle cx={30} cy={12.5} r={1.5} fill='#374151' />
            <circle cx={40} cy={12.5} r={1.5} fill='#374151' />
        </g>
    )
}

export default ShoeCabinet
