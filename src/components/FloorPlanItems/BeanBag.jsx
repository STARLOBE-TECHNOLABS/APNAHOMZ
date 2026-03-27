import React from 'react'

const BeanBag = () => {
    return (
        <g>
            {/* Organic "squish" shape */}
            <path
                d="M 25 5 
           Q 45 0 55 15 
           Q 65 35 45 55 
           Q 25 65 5 45 
           Q -5 25 25 5"
                stroke='#111827'
                strokeWidth={2}
                fill='white'
            />

            {/* Inner texture/folds */}
            <path d="M 20 15 Q 30 25 40 20" stroke="#9ca3af" strokeWidth={1} fill="none" />
            <path d="M 15 30 Q 25 40 35 35" stroke="#9ca3af" strokeWidth={1} fill="none" />
            <path d="M 25 45 Q 35 50 45 45" stroke="#d1d5db" strokeWidth={1} fill="none" />

            {/* Top "pull" or handle */}
            <path d="M 25 5 Q 30 -2 35 5" stroke="#111827" strokeWidth={2} fill="none" />
        </g>
    )
}

export default BeanBag
