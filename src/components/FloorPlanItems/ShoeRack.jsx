import React from 'react'

const ShoeRack = () => {
    return (
        <g>
            <rect x={0} y={0} width={80} height={30} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
            {/* Slat pattern */}
            <line x1={10} y1={0} x2={10} y2={30} stroke='#e5e7eb' strokeWidth={1} />
            <line x1={20} y1={0} x2={20} y2={30} stroke='#e5e7eb' strokeWidth={1} />
            <line x1={30} y1={0} x2={30} y2={30} stroke='#e5e7eb' strokeWidth={1} />
            <line x1={40} y1={0} x2={40} y2={30} stroke='#e5e7eb' strokeWidth={1} />
            <line x1={50} y1={0} x2={50} y2={30} stroke='#e5e7eb' strokeWidth={1} />
            <line x1={60} y1={0} x2={60} y2={30} stroke='#e5e7eb' strokeWidth={1} />
            <line x1={70} y1={0} x2={70} y2={30} stroke='#e5e7eb' strokeWidth={1} />
        </g>
    )
}

export default ShoeRack
