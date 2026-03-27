import React from 'react'

const OfficeDesk = () => {
    return (
        <g>
            <rect x={0} y={0} width={140} height={70} rx={4} stroke='#111827' strokeWidth={2} fill='white' />
            {/* Desktop computer monitor */}
            <rect x={40} y={15} width={60} height={5} rx={1} stroke='#9ca3af' strokeWidth={1} fill='#f3f4f6' />
            {/* Keyboard area */}
            <rect x={45} y={30} width={50} height={15} rx={2} stroke='#e5e7eb' strokeWidth={1} fill='none' />
            {/* Drawer handles */}
            <line x1={120} y1={10} x2={130} y2={10} stroke='#111827' strokeWidth={1} />
            <line x1={120} y1={30} x2={130} y2={30} stroke='#111827' strokeWidth={1} />
        </g>
    )
}

export default OfficeDesk
