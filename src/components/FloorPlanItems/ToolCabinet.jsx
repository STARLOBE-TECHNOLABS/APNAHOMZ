import React from 'react'

const ToolCabinet = () => {
    return (
        <g>
            {/* Cabinet Housing */}
            <rect x={0} y={0} width={60} height={45} rx={2} fill='#991b1b' stroke='#111827' strokeWidth={2} />

            {/* Drawers Front (Top-down view of handles) */}
            <rect x={5} y={5} width={50} height={10} rx={1} fill='#b91c1c' stroke='#7f1d1d' strokeWidth={1} />
            <rect x={20} y={12} width={20} height={2} rx={1} fill='#e5e7eb' /> {/* Handle 1 */}

            <rect x={5} y={20} width={50} height={10} rx={1} fill='#b91c1c' stroke='#7f1d1d' strokeWidth={1} />
            <rect x={20} y={27} width={20} height={2} rx={1} fill='#e5e7eb' /> {/* Handle 2 */}

            <rect x={5} y={35} width={50} height={5} rx={1} fill='#b91c1c' stroke='#7f1d1d' strokeWidth={1} />

            {/* Lock/Brand Plate */}
            <circle cx={50} cy={10} r={1.5} fill='#d1d5db' />

            {/* Wheels hint (Corners) */}
            <rect x={0} y={42} width={8} height={3} fill='#374151' />
            <rect x={52} y={42} width={8} height={3} fill='#374151' />
        </g>
    )
}

export default ToolCabinet
