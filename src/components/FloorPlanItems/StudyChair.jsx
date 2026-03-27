import React from 'react';

const StudyChair = () => {
  return (
    <g>
      {/* Seat */}
      <rect x="0" y="0" width="45" height="45" rx="5" fill="#EAEAEA" stroke="#333" strokeWidth="2" />
      
      {/* Backrest */}
      <rect x="0" y="-5" width="45" height="10" fill="#D4C7B0" stroke="#333" strokeWidth="2" />
    </g>
  );
};

export default StudyChair;