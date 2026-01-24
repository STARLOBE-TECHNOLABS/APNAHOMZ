const SVGPreview = ({width, scale, height, children}) => {
  return (
    <svg width={width} height={height} >
      <g transform={`scale(${scale})`}>
        {children}
      </g>
    </svg>
  )
}

export default SVGPreview