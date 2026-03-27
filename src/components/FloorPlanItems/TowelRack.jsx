import React from 'react'

const TowelRack = () => {
    return (
        <g>
            {/* Wall rail */}
            <rect x={0} y={5} width={60} height={3} rx={1.5} fill='#111827' />

            {/* Brackets */}
            <rect x={5} y={0} width={4} height={10} rx={1} fill='#4b5563' />
            <rect x={51} y={0} width={4} height={10} rx={1} fill='#4b5563' />

            {/* Hung towel representation */}
            <rect x={15} y={6} width={30} height={25} rx={2} stroke='#9ca3af' strokeWidth={1} fill='white' />

            {/* Fabric folds */}
            <line x1={20} y1={10} x2={20} y2={25} stroke='#d1d5db' strokeWidth={1} />
            <line x1={30} y1={10} x2={30} y2={25} stroke='#d1d5db' strokeWidth={1} />
            <line x1={40} y1={10} x2={40} y2={25} stroke='#d1d5db' strokeWidth={1} />
        </g>
    )
}

export default TowelRack
