import React from 'react';

const StudyDesk = () => {
  return (
    <g>
      {/* Desk Top */}
      <rect x="0" y="0" width="120" height="60" rx="2" fill="#D4C7B0" stroke="#333" strokeWidth="2" />
      
      {/* Legs */}
      <rect x="5" y="5" width="5" height="50" fill="#333" />
      <rect x="110" y="5" width="5" height="50" fill="#333" />
    </g>
  );
};

export default StudyDesk;