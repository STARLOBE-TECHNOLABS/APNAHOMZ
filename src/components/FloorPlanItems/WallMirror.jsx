import React from 'react';

const WallMirror = () => {
  return (
    <g>
      {/* Mirror Frame */}
      <rect x="0" y="0" width="80" height="5" rx="1" fill="#D4C7B0" stroke="#333" strokeWidth="1" />
      
      {/* Mirror Surface */}
      <rect x="2" y="1" width="76" height="3" fill="#E0F7FA" />
    </g>
  );
};

export default WallMirror;