import React from 'react'

const FilingCabinet = () => {
    return (
        <g>
            <rect x={0} y={0} width={45} height={60} rx={2} stroke='#111827' strokeWidth={2} fill='white' />
            <line x1={0} y1={20} x2={45} y2={20} stroke='#9ca3af' strokeWidth={1} />
            <line x1={0} y1={40} x2={45} y2={40} stroke='#9ca3af' strokeWidth={1} />
            {/* Handles */}
            <rect x={17} y={8} width={10} height={3} rx={1} fill='#374151' />
            <rect x={17} y={28} width={10} height={3} rx={1} fill='#374151' />
            <rect x={17} y={48} width={10} height={3} rx={1} fill='#374151' />
        </g>
    )
}

export default FilingCabinet
