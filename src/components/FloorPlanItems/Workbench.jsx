import React from 'react'

const Workbench = () => {
    return (
        <g>
            {/* Heavy Duty Table Top */}
            <rect x={0} y={0} width={120} height={60} fill='#d4d4d8' stroke='#111827' strokeWidth={2.5} />

            {/* Surface Texture (Plywood/Steel look) */}
            <rect x={4} y={4} width={112} height={52} fill='#e5e7eb' stroke='#a1a1aa' strokeWidth={1} />

            {/* Vise (Clamp on the side) */}
            <rect x={-5} y={10} width={10} height={15} rx={1} fill='#4b5563' stroke='#1f2937' strokeWidth={1} />
            <line x1={-8} y1={17} x2={2} y2={17} stroke='#1f2937' strokeWidth={2} />

            {/* Tool tray area */}
            <rect x={80} y={5} width={35} height={10} fill='#d1d5db' stroke='#9ca3af' strokeWidth={1} />

            {/* Legs (Outline/Blocks in corners) */}
            <rect x={0} y={0} width={8} height={8} fill='#374151' />
            <rect x={112} y={0} width={8} height={8} fill='#374151' />
            <rect x={0} y={52} width={8} height={8} fill='#374151' />
            <rect x={112} y={52} width={8} height={8} fill='#374151' />

            {/* Small pegboard hint on back */}
            <line x1={0} y1={2} x2={120} y2={2} stroke='#71717a' strokeWidth={3} />
        </g>
    )
}

export default Workbench
