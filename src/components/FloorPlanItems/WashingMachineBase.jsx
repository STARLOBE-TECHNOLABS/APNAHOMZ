import React from 'react'

const WashingMachineBase = () => {
    return (
        <g>
            {/* Base Platform */}
            <rect x={0} y={0} width={64} height={64} rx={2} fill='#f3f4f6' stroke='#d1d5db' strokeWidth={1} />

            {/* Outline of the machine sitting on top */}
            <rect x={2} y={2} width={60} height={60} rx={4} stroke='#9ca3af' strokeWidth={1.5} fill='none' strokeDasharray="4 2" />

            {/* Leveling feet/corners */}
            <circle cx={6} cy={6} r={2} fill='#6b7280' />
            <circle cx={58} cy={6} r={2} fill='#6b7280' />
            <circle cx={6} cy={58} r={2} fill='#6b7280' />
            <circle cx={58} cy={58} r={2} fill='#6b7280' />

            {/* Structural ribbing on the platform */}
            <line x1={10} y1={2} x2={10} y2={62} stroke='#e5e7eb' strokeWidth={1} />
            <line x1={54} y1={2} x2={54} y2={62} stroke='#e5e7eb' strokeWidth={1} />
        </g>
    )
}

export default WashingMachineBase
