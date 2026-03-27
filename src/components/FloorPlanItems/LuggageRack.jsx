import React from 'react';

const LuggageRack = () => {
  return (
    <g>
      {/* Rack Frame */}
      <rect x="0" y="0" width="80" height="50" rx="2" fill="#D4C7B0" stroke="#333" strokeWidth="2" />
      
      {/* Straps */}
      <line x1="10" y1="0" x2="10" y2="50" stroke="#333" strokeWidth="2" />
      <line x1="40" y1="0" x2="40" y2="50" stroke="#333" strokeWidth="2" />
      <line x1="70" y1="0" x2="70" y2="50" stroke="#333" strokeWidth="2" />
    </g>
  );
};

export default LuggageRack;