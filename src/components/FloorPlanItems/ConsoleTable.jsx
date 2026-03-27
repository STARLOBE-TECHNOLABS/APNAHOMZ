import React from 'react'

const ConsoleTable = () => {
    return (
        <g>
            <rect x={0} y={0} width={120} height={35} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
            <line x1={0} y1={5} x2={120} y2={5} stroke='#f3f4f6' strokeWidth={1} />
            {/* Symbolic drawer fronts */}
            <rect x={10} y={12} width={45} height={15} rx={1} stroke='#e5e7eb' strokeWidth={1} fill='none' />
            <rect x={65} y={12} width={45} height={15} rx={1} stroke='#e5e7eb' strokeWidth={1} fill='none' />
        </g>
    )
}

export default ConsoleTable
