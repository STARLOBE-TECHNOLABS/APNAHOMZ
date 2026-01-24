import React from 'react'
import { useAppStore } from '@/store/app'
import { HiOutlineTrash } from 'react-icons/hi';

const findElement = (id, plan) => {
  // In future pass activeElement type on selection to reduce this search
  const element = plan.items.find(e => e.id === id);
  if (element) return { object: element, type: 'item' };
  
  const wall = plan.walls.find(e => e.id === id);
  if (wall) return { object: wall, type: 'wall' };
  
  return { object: null, type: null };
};

const PropertyPanel = ({plan, removeItem, removeWalls, updateWallProp, updateItem}) => {
  // Get active element
  const activeElement = useAppStore(state => state.activeElement)
  const setEditorProp = useAppStore((state) => state.setEditorProp)

  // Do not show property panel if there is no active element 
  if(activeElement === null) return

  // Get element object and its properties
  const element = findElement(activeElement, plan)

  const deleteByType = {
    wall: (id) => removeWalls(id),
    item: (id) => removeItem(id),
  };

  const handleDelete = () => {
    const { type, object } = element;
    deleteByType[type](object.id)

    // Reset activeelement
    setEditorProp('activeElement', null)
    setEditorProp('textEditing', false)
  }

  const handleColorChange = (e) => {
      if (element.type === 'wall') {
          updateWallProp(element.object.id, 'color', e.target.value);
      }
  }

  return (
    <div className='absolute right-6 top-1/2 -translate-y-1/2'>
      <div className='bg-white p-3 shadow-md rounded-md flex flex-col gap-3'>
        {element.type === 'wall' && (
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Wall Color</label>
                <input 
                    type="color" 
                    value={element.object.color || '#ffffff'} 
                    onChange={handleColorChange}
                    className="w-full h-8 cursor-pointer border rounded"
                />
            </div>
        )}
        {element.type === 'item' && element.object.type === 'door' && (
            <button 
                className='bg-blue-500 p-2 rounded-md hover:bg-blue-600 text-white text-xs font-semibold'
                onClick={() => updateItem(element.object.id, { flip: !element.object.flip })}
            >
                Flip Direction
            </button>
        )}
        <button className='bg-red-400 p-1.5 rounded-md hover:bg-red-500 text-white flex justify-center items-center' onClick={handleDelete} title="Delete">
          <HiOutlineTrash  size={16}/>
        </button>
        
      </div>
    </div>
  )
}

export default PropertyPanel