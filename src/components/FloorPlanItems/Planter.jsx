import React from 'react'

const Planter = () => {
    return (
        <g>
            {/* Pot Outer Rim */}
            <circle cx={25} cy={25} r={22} fill='#a3a3a3' stroke='#525252' strokeWidth={2} />

            {/* Soil Area */}
            <circle cx={25} cy={25} r={18} fill='#713f12' />

            {/* Plant Leaf 1 */}
            <path d="M25 25 Q35 10 45 20" fill='#166534' stroke='#14532d' strokeWidth={1} />
            {/* Plant Leaf 2 */}
            <path d="M25 25 Q15 10 5 20" fill='#15803d' stroke='#14532d' strokeWidth={1} />
            {/* Plant Leaf 3 */}
            <path d="M25 25 Q35 40 45 30" fill='#16a34a' stroke='#14532d' strokeWidth={1} />
            {/* Plant Leaf 4 */}
            <path d="M25 25 Q15 40 5 30" fill='#22c55e' stroke='#14532d' strokeWidth={1} />

            {/* Center Stem/New Growth */}
            <circle cx={25} cy={25} r={4} fill='#4ade80' />
        </g>
    )
}

export default Planter
