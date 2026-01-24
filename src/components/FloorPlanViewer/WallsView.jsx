import React from 'react'

const WallsView = ({walls}) => {
  return (
    <>
    {walls.map(w => 
            <g key={w.id}>
              {w.walls.map((wall, j) => (
                <g key={j}>
                <line
                  x1={wall.x1}
                  y1={wall.y1}
                  x2={wall.x2}
                  y2={wall.y2}
                  className="stroke-slate-800"
                  strokeWidth={6}
                  strokeLinecap='round'
                ></line>
                </g>
                ))}
            </g>
          )}
    </>
  )
}

export default WallsView