import React from 'react'
import { NavLink } from 'react-router-dom'

const AddingFurnishing = () => {
  return (
        <>
        <article>
          <header>
            <p className="text-base ">
              Project structure
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Adding furnishing
            </h1>
          </header>

          <hr className='my-4' />
          <div className="mt-6">
            <p>
            To add doors and windows, simply tap the door icon or window icon on the left center panel. The door or window will appear on the canvas.
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-1/3 border' src='../../documentation/door.png'/>
            </div>
          </div>
          <p>
          To add furnishings, tap the furniture icon to open a menu of available options. Selecting an item from the menu will place it on the canvas.
          </p>
          <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-3/4 border' src='../../documentation/furnishingmenu.png'/>
            </div>
            <p>
            Once you have placed a piece of furniture on the canvas, tap on it, yellow border will appear indicating that it is selected.
          </p>
          <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/selection.png'/>
            </div>
          <p>
          To move furniture around the canvas, simply click on it and drag your mouse. Release the click to place the furniture. 
          </p>
          <p>
          To rotate the furniture, press the yellow circle in the top-left corner of the selection. By moving your mouse, you can adjust the rotation of the furniture.
          </p>
          <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/rotation.png'/>
            </div>
          <p>
          When you select a piece of furniture, a red trash button will appear at the center of the right side of the screen. This button allows you to remove the furniture. Additionally, you can also press the delete button on your keyboard to remove items from the canvas.
          </p>
          <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-2/3 border' src='../../documentation/furnishingdelete.png'/>
          </div>
          <p>
          With these simple actions, you can create basic floor plans.
          </p>
          <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-full border' src='../../documentation/basicfloorplan.png'/>
            </div>
        </article>
        <dl className="flex pt-6 mt-6 border-t border-slate-200">
          <div className="mr-auto text-left">
              <dt className="text-sm font-normal tracking-tight text-slate-600">
                Previous
              </dt>
              <dd className="mt-1">
                <NavLink to={'/plans/documentation/drawingwalls'} className="text-base font-semibold text-slate-900 hover:underline">
                  Drawing Walls
                </NavLink>
              </dd>
          </div>
          <div className="ml-auto text-right">
            <dt className="text-sm font-normal tracking-tight text-slate-600">
              Next
            </dt>
            <dd className="mt-1">
              <NavLink to={'/plans/documentation/addingText'} className="text-base font-semibold text-slate-900 hover:underline">
                Adding Text
              </NavLink>
            </dd>
          </div>
        </dl>
        </>
  )
}

export default AddingFurnishing