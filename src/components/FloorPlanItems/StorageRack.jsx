import React from 'react'

const StorageRack = () => {
    return (
        <g>
            {/* Main Outer Frame */}
            <rect x={0} y={0} width={120} height={40} fill='none' stroke='#4b5563' strokeWidth={2} />

            {/* Vertical Support Posts (Corners) */}
            <rect x={0} y={0} width={4} height={4} fill='#374151' />
            <rect x={116} y={0} width={4} height={4} fill='#374151' />
            <rect x={0} y={36} width={4} height={4} fill='#374151' />
            <rect x={116} y={36} width={4} height={4} fill='#374151' />

            {/* Shelving Boards (Visualized as sections) */}
            <rect x={4} y={2} width={112} height={36} fill='#f3f4f6' stroke='#d1d5db' strokeWidth={1} />

            {/* Separators/Braces */}
            <line x1={30} y1={2} x2={30} y2={38} stroke='#cbd5e1' strokeWidth={1} />
            <line x1={60} y1={2} x2={60} y2={38} stroke='#cbd5e1' strokeWidth={1} />
            <line x1={90} y1={2} x2={90} y2={38} stroke='#cbd5e1' strokeWidth={1} />

            {/* Wire Rack hint */}
            <line x1={4} y1={10} x2={116} y2={10} stroke='#e5e7eb' strokeWidth={0.5} strokeDasharray="2 2" />
            <line x1={4} y1={20} x2={116} y2={20} stroke='#e5e7eb' strokeWidth={0.5} strokeDasharray="2 2" />
            <line x1={4} y1={30} x2={116} y2={30} stroke='#e5e7eb' strokeWidth={0.5} strokeDasharray="2 2" />
        </g>
    )
}

export default StorageRack
