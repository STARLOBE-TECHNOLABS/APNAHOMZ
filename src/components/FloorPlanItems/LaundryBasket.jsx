import React from 'react'

const LaundryBasket = () => {
    return (
        <g>
            {/* Circular woven basket */}
            <circle cx={25} cy={25} r={24} stroke='#111827' strokeWidth={2} fill='white' />

            {/* Woven pattern representation */}
            <circle cx={25} cy={25} r={18} stroke='#d1d5db' strokeWidth={1} fill='none' strokeDasharray="4 2" />
            <circle cx={25} cy={25} r={12} stroke='#9ca3af' strokeWidth={1} fill='none' strokeDasharray="2 4" />

            {/* Handle representation */}
            <path d="M 5 25 Q 0 25 5 20 M 45 25 Q 50 25 45 20" stroke="#111827" strokeWidth={2} fill="none" />

            {/* Content representation (abstract clothes) */}
            <path d="M 20 20 Q 25 15 30 20 Q 35 25 30 30 Q 25 35 20 30 Q 15 25 20 20" stroke="#e5e7eb" strokeWidth={1} fill="none" />
        </g>
    )
}

export default LaundryBasket
