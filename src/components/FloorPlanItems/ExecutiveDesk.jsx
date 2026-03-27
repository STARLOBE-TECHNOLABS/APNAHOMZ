import React from 'react'

const ExecutiveDesk = () => {
    return (
        <g>
            <rect x={0} y={0} width={180} height={85} rx={6} stroke='#111827' strokeWidth={3} fill='white' />
            {/* Central writing pad */}
            <rect x={40} y={10} width={100} height={60} rx={2} fill='#f9fafb' stroke='#e5e7eb' strokeWidth={1} />
            {/* Side drawer units */}
            <line x1={40} y1={0} x2={40} y2={85} stroke='#111827' strokeWidth={2} />
            <line x1={140} y1={0} x2={140} y2={85} stroke='#111827' strokeWidth={2} />
            {/* Laptop or details */}
            <rect x={65} y={20} width={50} height={35} rx={2} stroke='#9ca3af' strokeWidth={1} fill='#f3f4f6' />
        </g>
    )
}

export default ExecutiveDesk
