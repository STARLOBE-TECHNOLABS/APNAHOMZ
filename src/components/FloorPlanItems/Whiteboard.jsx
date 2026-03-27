import React from 'react'

const Whiteboard = () => {
    return (
        <g>
            <rect x={0} y={0} width={150} height={8} rx={1} stroke='#111827' strokeWidth={2} fill='white' />
            <rect x={60} y={6} width={30} height={4} rx={1} fill='#374151' /> {/* Pen tray */}
        </g>
    )
}

export default Whiteboard
