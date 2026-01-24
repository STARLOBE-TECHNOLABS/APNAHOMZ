import React, { useEffect, useRef, useState } from 'react'
import { useAppStore } from "@/store/app";

const TextEditing = ({items, updateItem}) => {

  const [text, setText] = useState("")
  const textareaRef = useRef()

  const activeElement  = useAppStore((state) => state.activeElement)
  const textEditing  = useAppStore((state) => state.textEditing)
  const setEditorProp  = useAppStore((state) => state.setEditorProp)

  const handleTextChange = (e) => {
    const updatedText = e.target.value
    setText(updatedText)
  }

  const handleSave = () => {
    const updatetText = text || "Text"
    updateItem(activeElement, {data: { text: updatetText}})
    setEditorProp("textEditing", false)
  }

  useEffect(() =>{

    if(textEditing) {
      const item = items.find(e => e.id == activeElement)
      if(item && item.type === "text") {
        const string = item.data.text ?? "Text"
        setText(string)

        // Focus at the end of text in textarea
        textareaRef.current.setSelectionRange(string.length, string.length)
        textareaRef.current.focus()
      }
    }

  }, [textEditing, activeElement])

  return (
    <>
    {textEditing && 
      <div className='absolute bottom-24 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-md p-1 flex flex-col gap-1 '>
        <div className='flex'>
          <textarea ref={textareaRef} onKeyDown={(e) => {e.stopPropagation()}} value={text} onChange={handleTextChange} 
          className='resize-none outline-none bg-gray-50 p-2 text-sm w-72 h-20 rounded-l-md'/>
        </div>
        <button className='bg-yellow-300 text-xs px-2 py-1 rounded hover:bg-yellow-300' onClick={handleSave}>Update</button>
      </div>
    }
    </>
  )
}

export default TextEditing