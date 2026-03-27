import React from 'react'

const OutdoorSofa = () => {
    return (
        <g>
            {/* Main Sofa Body */}
            <rect x={0} y={0} width={120} height={60} rx={6} fill='#e5e7eb' stroke='#374151' strokeWidth={2} />

            {/* Seat Cushions */}
            <rect x={5} y={15} width={52.5} height={40} rx={4} fill='white' stroke='#9ca3af' strokeWidth={1} />
            <rect x={62.5} y={15} width={52.5} height={40} rx={4} fill='white' stroke='#9ca3af' strokeWidth={1} />

            {/* Backrest Cushions */}
            <rect x={5} y={5} width={52.5} height={10} rx={2} fill='#f3f4f6' stroke='#d1d5db' strokeWidth={1} />
            <rect x={62.5} y={5} width={52.5} height={10} rx={2} fill='#f3f4f6' stroke='#d1d5db' strokeWidth={1} />

            {/* Arms */}
            <rect x={0} y={10} width={5} height={45} rx={2} fill='#6b7280' />
            <rect x={115} y={10} width={5} height={45} rx={2} fill='#6b7280' />

            {/* Texture hint (Woven wicker look on the sides) */}
            <line x1={2} y1={15} x2={2} y2={40} stroke='#9ca3af' strokeWidth={0.5} strokeDasharray="2 2" />
            <line x1={118} y1={15} x2={118} y2={40} stroke='#9ca3af' strokeWidth={0.5} strokeDasharray="2 2" />
        </g>
    )
}

export default OutdoorSofa
