import React, { useRef, useState, useEffect } from 'react'
import config from '@/config/config'
import { clamp } from '@/utils/helpers'
import { useAppStore } from '@/store/app'

const SVGViewport = ({width, height, mode, children}) => {

  const svgRef = useRef()
  const containerRef = useRef()

  const setEditorProp = useAppStore((state) => state.setEditorProp)
  
  const scale = useAppStore((state) => state.scale)
  const translate = useAppStore((state) => state.translate)

  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  const minScale = config.minScale
  const maxScale = config.maxScale
  const gridArea = config.gridArea

  const handleMouseDown = (event) => {
    // Only proceed wheel button not click
    if (event.button !== 1) return;

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    
    setIsPanning(true);
    setStartPoint({
      x: event.clientX - translate.x,
      y: event.clientY - translate.y
    });
  };

  const handleMouseMove = (event) => {
    if (!isPanning) return;

    const newTranslate = {
      x: event.clientX - startPoint.x,
      y: event.clientY - startPoint.y,
    };

    
    updateTranslate(newTranslate)
  };

  const updateTranslate = (translate) => {
    // Restrict translate so it can't go out of grid area
    setEditorProp('translate', {
      x: clamp(translate.x, width * (1 - scale) - gridArea * scale, gridArea * scale),
      y: clamp(translate.y, height * (1 - scale) - gridArea * scale, gridArea * scale)
    })
  }

  const updateScale = (newScale) => {
    setEditorProp('scale', newScale)
  }

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const svgElement = svgRef.current;
    const scaleFactor = 1.1

    let newScale = event.deltaY > 0 ? scale / scaleFactor : scale * scaleFactor
    newScale = Math.max(minScale, Math.min(maxScale, newScale));

    const { left, top } = svgElement.getBoundingClientRect();
    const mouseX = event.clientX - left;
    const mouseY = event.clientY - top;

    const newTranslate = {
      x: (mouseX - translate.x) * (1 - newScale / scale) + translate.x,
      y: (mouseY - translate.y) * (1 - newScale / scale) + translate.y
    };

    updateTranslate(newTranslate)
    updateScale(newScale)
   
  };

  const handleClickOutside = (e) => {
    if(e.target === svgRef.current) {
      setEditorProp("activeElement", null)
      setEditorProp("textEditing", false)
      setEditorProp("furniterMenu", false)
    }
  }

  useEffect(() => {
    // Set svgRef for other components - mainly Wall Drawing where it needs custom event handler on svg
    setEditorProp('svgRef', svgRef.current)
  },[])

  useEffect(() => {
    const svgElement = svgRef.current;

    // Disable in preview mode
    if (!svgElement) return;

    if(mode !== "preview") {
      svgElement.addEventListener("click", handleClickOutside)
    }
    svgElement.addEventListener('wheel', handleWheel);
    svgElement.addEventListener('mousedown', handleMouseDown);
    svgElement.addEventListener('mousemove', handleMouseMove);
    svgElement.addEventListener('mouseup', handleMouseUp);
    svgElement.addEventListener('mouseleave', handleMouseUp);

    return () => {
      svgElement.removeEventListener("click", handleClickOutside)
      svgElement.removeEventListener('wheel', handleWheel);
      svgElement.removeEventListener('mousedown', handleMouseDown);
      svgElement.removeEventListener('mousemove', handleMouseMove);
      svgElement.removeEventListener('mouseup', handleMouseUp);
      svgElement.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [scale, translate, isPanning, startPoint]);

  return (
    <div ref={containerRef} className=''>
      <svg id="svg_render" width={width} height={height} ref={svgRef} style={{cursor: isPanning ? 'grabbing' : '' }}>
        <g transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}>
          {children}
        </g>
      </svg>
    </div>
  )
}

export default SVGViewport