import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HiMenu } from "react-icons/hi";
import useDebounce from '@/hooks/useDebounce';
import { useNotification } from '@/context/NotificationContext';
import  { BiDownload }  from 'react-icons/bi';

const TopBar = ({plan, updatePlan}) => {

  const [planName, setPlanName] = useState('');
  
  const debounceUpdate = useDebounce(updatePlan, 300)
  const notify = useNotification()

  const updateName = (e) => {
    const newName = e.target.value 
    setPlanName(newName)
    debounceUpdate({name: newName})
  }

  const download2D = () => {
    const svgElement = document.getElementById('svg_render');
    if (!svgElement) {
        notify({content: "Error: Could not find floor plan."});
        return;
    }

    // Clone the SVG to manipulate it for export
    const clone = svgElement.cloneNode(true);
    
    // Fix: Replace foreignObject with text elements to prevent SecurityError (Tainted Canvas)
    const foreignObjects = clone.querySelectorAll('foreignObject');
    foreignObjects.forEach(fo => {
        const div = fo.querySelector('div');
        const textContent = div ? div.innerText : fo.textContent;
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.textContent = textContent;
        text.setAttribute("x", "5"); // Small padding
        text.setAttribute("y", "20"); // Approximate baseline
        text.setAttribute("fill", "#111827"); // Matches default text color
        text.setAttribute("font-family", "sans-serif");
        text.setAttribute("font-size", "14px");
        
        fo.parentNode.replaceChild(text, fo);
    });
    
    // Serialize
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    
    // Create Blob
    const blob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    
    // Create Image to render to Canvas
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        // Use the SVG's dimensions
        const width = svgElement.getAttribute('width') || svgElement.clientWidth;
        const height = svgElement.getAttribute('height') || svgElement.clientHeight;
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        try {
            ctx.drawImage(img, 0, 0);
            
            // Trigger download
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `${planName || 'floorplan'}_2d.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            notify({content: "2D Plan downloaded."});
        } catch (error) {
            console.error("Export Error:", error);
            notify({content: "Error: Canvas tainted. Remove external images/text."});
        }
        
        URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  useEffect(() => {
    if(plan) setPlanName(plan.name)
  }, [plan])

  return (
    <>
      <div className='absolute left-6 top-6'>
        <div className='flex gap-1'>
          <div className='bg-white p-1 shadow-md rounded-md '>
            <NavLink to='/plans/all'>
              <div className='flex justify-center items-center size-8 hover:bg-slate-100 rounded focus-visible:outline-none focus-visible:ring focus-visible:ring-[#B38F4B]/40'>
                <HiMenu/>
              </div>
            </NavLink>
          </div>
          <div className='bg-white p-1 shadow-md rounded-md'>
              <input 
              className='flex items-center px-3 bg-slate-100 h-8 text-sm rounded outline-none w-60' 
              value={planName} 
              onChange={updateName}
              onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
              />
          </div>
        </div>
      </div>

      <div className='absolute right-6 top-6'>
        <div className='bg-white p-1 shadow-md rounded-md flex gap-1'>
              <div onClick={download2D} className='flex justify-center items-center gap-1 px-2 h-8 cursor-pointer text-xs text-white bg-[#142725] hover:bg-[#1a3332] rounded font-medium'>
                <BiDownload/> Download 2D
              </div>
        </div>
      </div>
    </>
  )
}

export default TopBar