import React, { useEffect, useRef, useState } from 'react'

const Text = ({item}) => {

  const [textData, setTextData] = useState('')

  useEffect(() => {
    // Check for data attribute 
    // Items from previous version deos not have data
    if (item?.data) {
      setTextData(item.data.text ?? "Text");
    } else {
      setTextData("Text");
    }

  }, [item])

  return (
    <g>
      <foreignObject width={item.width} height={item.height}>
        <div className='leading-5 whitespace-pre-line ' >
          {textData}
        </div>
      </foreignObject>
    </g>
  )
}

export default Text