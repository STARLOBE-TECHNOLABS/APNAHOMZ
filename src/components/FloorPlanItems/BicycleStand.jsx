import React from 'react'

const BicycleStand = () => {
    return (
        <g>
            {/* Floor Rails */}
            <rect x={0} y={5} width={80} height={4} rx={2} fill='#4b5563' />
            <rect x={0} y={25} width={80} height={4} rx={2} fill='#4b5563' />

            {/* Vertical Supports (Wheel holders) */}
            <rect x={10} y={0} width={2} height={34} fill='#6b7280' />
            <rect x={14} y={0} width={2} height={34} fill='#6b7280' />

            <rect x={40} y={0} width={2} height={34} fill='#6b7280' />
            <rect x={44} y={0} width={2} height={34} fill='#6b7280' />

            <rect x={70} y={0} width={2} height={34} fill='#6b7280' />
            <rect x={74} y={0} width={2} height={34} fill='#6b7280' />

            {/* Cross bar brace */}
            <line x1={0} y1={17} x2={80} y2={17} stroke='#374151' strokeWidth={2} />
        </g>
    )
}

export default BicycleStand
