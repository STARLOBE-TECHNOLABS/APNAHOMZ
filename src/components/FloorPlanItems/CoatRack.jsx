import React from 'react'

const CoatRack = () => {
    return (
        <g>
            <circle cx={20} cy={20} r={18} stroke='#111827' strokeWidth={2} fill='white' />
            <circle cx={20} cy={20} r={4} fill='#374151' />
            {/* Hooks symbol */}
            <line x1={20} y1={5} x2={20} y2={35} stroke='#111827' strokeWidth={1} />
            <line x1={5} y1={20} x2={35} y2={20} stroke='#111827' strokeWidth={1} />
            <line x1={9} y1={9} x2={31} y2={31} stroke='#111827' strokeWidth={1} />
            <line x1={9} y1={31} x2={31} y2={9} stroke='#111827' strokeWidth={1} />
        </g>
    )
}

export default CoatRack
