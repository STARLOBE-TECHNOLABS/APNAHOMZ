import React from 'react'

const DesktopLaptop = () => {
    return (
        <g>
            {/* Laptop Base */}
            <rect x={0} y={15} width={50} height={35} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
            {/* Screen area (folded out) */}
            <rect x={2} y={2} width={46} height={12} rx={1} stroke='#9ca3af' strokeWidth={1} fill='white' />
            {/* Trackpad */}
            <rect x={18} y={42} width={14} height={6} rx={1} stroke='#e5e7eb' strokeWidth={1} fill='none' />
        </g>
    )
}

export default DesktopLaptop
