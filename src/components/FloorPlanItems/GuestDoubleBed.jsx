import React from 'react';

const GuestDoubleBed = () => {
  return (
    <g>
      {/* Bed Frame */}
      <rect x="0" y="0" width="160" height="200" fill="#EAEAEA" stroke="#333" strokeWidth="2" />
      
      {/* Headboard */}
      <rect x="0" y="-10" width="160" height="15" fill="#D4C7B0" stroke="#333" strokeWidth="2" />
      
      {/* Pillows */}
      <rect x="10" y="10" width="60" height="40" rx="5" fill="#FFFFFF" stroke="#CCC" strokeWidth="1" />
      <rect x="90" y="10" width="60" height="40" rx="5" fill="#FFFFFF" stroke="#CCC" strokeWidth="1" />
      
      {/* Duvet */}
      <rect x="5" y="60" width="150" height="135" fill="#F8F8F8" stroke="#DDD" strokeWidth="1" />
      <path d="M 5 130 C 45 110, 115 110, 155 130" stroke="#DDD" strokeWidth="1" fill="none" />
    </g>
  );
};

export default GuestDoubleBed;