import React from 'react';

const GuestWardrobe = () => {
  return (
    <g>
      {/* Wardrobe Frame */}
      <rect x="0" y="0" width="150" height="60" fill="#D4C7B0" stroke="#333" strokeWidth="2" />
      
      {/* Sliding Doors */}
      <rect x="2" y="2" width="73" height="56" fill="#EAEAEA" stroke="#333" strokeWidth="1" />
      <rect x="75" y="2" width="73" height="56" fill="#EAEAEA" stroke="#333" strokeWidth="1" />
      
      {/* Handles */}
      <rect x="10" y="25" width="5" height="10" fill="#333" />
      <rect x="135" y="25" width="5" height="10" fill="#333" />
    </g>
  );
};

export default GuestWardrobe;