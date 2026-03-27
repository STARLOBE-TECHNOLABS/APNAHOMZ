import React from 'react';

const GuestSingleBed = () => {
  return (
    <g>
      {/* Bed Frame */}
      <rect x="0" y="0" width="100" height="200" fill="#EAEAEA" stroke="#333" strokeWidth="2" />
      
      {/* Headboard */}
      <rect x="0" y="-10" width="100" height="15" fill="#D4C7B0" stroke="#333" strokeWidth="2" />
      
      {/* Pillow */}
      <rect x="10" y="10" width="80" height="40" rx="5" fill="#FFFFFF" stroke="#CCC" strokeWidth="1" />
      
      {/* Duvet */}
      <rect x="5" y="60" width="90" height="135" fill="#F8F8F8" stroke="#DDD" strokeWidth="1" />
      <path d="M 5 130 C 25 110, 75 110, 95 130" stroke="#DDD" strokeWidth="1" fill="none" />
    </g>
  );
};

export default GuestSingleBed;