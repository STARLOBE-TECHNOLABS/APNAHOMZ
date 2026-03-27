import React from 'react';

const GuestBedsideTable = () => {
  return (
    <g>
      {/* Table Top */}
      <rect x="0" y="0" width="50" height="40" rx="2" fill="#D4C7B0" stroke="#333" strokeWidth="2" />
      
      {/* Drawer Front */}
      <rect x="5" y="5" width="40" height="30" fill="#EAEAEA" stroke="#333" strokeWidth="1" />
      
      {/* Handle */}
      <rect x="22" y="18" width="6" height="4" fill="#333" />
    </g>
  );
};

export default GuestBedsideTable;