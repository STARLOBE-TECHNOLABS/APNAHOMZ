const GridLines = ({width, height, gridSize, strokeWidth, gridArea}) => {

  const areaWidth = width + gridArea * 2
  const areaHeight = height + gridArea * 2

  const verticleLines = []
  const horizontalLines = []

  // Generate vertical grid lines
  for(let i = 0; i <= areaWidth / gridSize; i++) {
    verticleLines.push(
      <line key={`x=${i}`} x1={i * gridSize} y1={0} x2={i * gridSize} y2={areaHeight} className='stroke-gray-200' strokeWidth={strokeWidth} />
    )
  }

   // Generate horizontal grid lines
  for(let j = 0; j <= areaHeight / gridSize; j++) {
    horizontalLines.push(
      <line key={`y=${j}`} x1={0} y1={j * gridSize} x2={areaWidth} y2={j * gridSize} className='stroke-gray-200' strokeWidth={strokeWidth} />
    )
  }

  return(
    <>
      {verticleLines}
      {horizontalLines}
    </>
  )
}

const Grid = ({width, height, gridSize, gridArea}) => {
  return(
    <g id='gridLines' transform={`translate(-${gridArea}, -${gridArea})`}>
        <GridLines width={width} height={height} strokeWidth={0.3} gridSize={gridSize} gridArea={gridArea} />
        <GridLines width={width} height={height} strokeWidth={0.8} gridSize={gridSize * 10} gridArea={gridArea} />
    </g>
  )
}

export default Grid;