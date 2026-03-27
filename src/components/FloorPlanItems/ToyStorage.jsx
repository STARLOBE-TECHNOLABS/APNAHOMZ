import React from 'react'

const ToyStorage = () => {
    return (
        <g>
            {/* Main frame */}
            <rect x={0} y={0} width={100} height={40} rx={2} stroke='#111827' strokeWidth={2} fill='white' />

            {/* Bin dividers */}
            <line x1={25} y1={0} x2={25} y2={40} stroke='#111827' strokeWidth={2} />
            <line x1={50} y1={0} x2={50} y2={40} stroke='#111827' strokeWidth={2} />
            <line x1={75} y1={0} x2={75} y2={40} stroke='#111827' strokeWidth={2} />

            {/* Toy representations (abstract shapes for realism) */}
            {/* Bin 1: Blocks */}
            <rect x={5} y={10} width={6} height={6} fill='#9ca3af' />
            <rect x={12} y={15} width={6} height={6} fill='#d1d5db' />
            <rect x={6} y={22} width={6} height={6} fill='#4b5563' />

            {/* Bin 2: Ball */}
            <circle cx={37.5} cy={20} r={10} stroke='#9ca3af' strokeWidth={1} fill='none' />
            <path d="M 30 15 Q 37.5 20 45 15" stroke="#9ca3af" strokeWidth={1} fill="none" />

            {/* Bin 3: Books/Panels */}
            <rect x={55} y={5} width={4} height={30} fill='#9ca3af' />
            <rect x={61} y={5} width={4} height={30} fill='#d1d5db' />
            <rect x={67} y={5} width={4} height={30} fill='#4b5563' />

            {/* Bin 4: Plushie/Rounded shape */}
            <ellipse cx={87.5} cy={20} rx={8} ry={12} stroke='#9ca3af' strokeWidth={1} fill='none' />
            <circle cx={85} cy={15} r={1.5} fill='#111827' />
            <circle cx={90} cy={15} r={1.5} fill='#111827' />
        </g>
    )
}

export default ToyStorage
