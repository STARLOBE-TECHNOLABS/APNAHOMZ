import React from 'react'

const UmbrellaStand = () => {
    return (
        <g>
            <circle cx={15} cy={15} r={14} stroke='#111827' strokeWidth={2} fill='white' />
            <circle cx={15} cy={15} r={10} stroke='#e5e7eb' strokeWidth={1} fill='none' />
            {/* Symbolic umbrella handles poking out */}
            <path d="M 12 12 Q 10 10 8 12" fill="none" stroke="#374151" strokeWidth={2} />
            <path d="M 18 18 Q 20 16 22 18" fill="none" stroke="#374151" strokeWidth={2} />
        </g>
    )
}

export default UmbrellaStand
