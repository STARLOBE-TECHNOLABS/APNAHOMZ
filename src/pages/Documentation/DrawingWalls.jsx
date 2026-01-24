import React from 'react'
import { NavLink } from 'react-router-dom'

const DrawingWalls = () => {
  return (
        <>
        <article>
          <header>
            <p className="text-base ">
              Project structure
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Drawing walls
            </h1>
          </header>

          <hr className='my-4' />
          <div className="mt-6">
          <p>
          To draw a wall, tap the brick icon in the left center menu. This will enter drawing mode, where a yellow circle will appear at the top of your cursor.
          </p>
          <div className='p-4 my-2'>
            <img className='rounded-md shadow-xl w-1/3 border' src='../../documentation/startdrawing.png'/>
          </div>
          <p>
            To draw a new wall, click on the canvas. Each click will create a new segment of the wall extending from the previous click.
          </p>
          <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/drawingwall.png'/>
          </div>
          <p>
          To stop drawing, press the <strong>ESC</strong> key on your keyboard. Additionally, clicking on the starting point of the first segment will automatically close the wall, creating a complete enclosure.
          </p>
          <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-full border' src='../../documentation/drawingwallend.png'/>
          </div>
          <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-full border' src='../../documentation/wall.png'/>
          </div>
          <p>
          When you tap on a wall, all wall segments will change from a solid line to a dashed line, indicating that the segments are selected. 
          Additionally, a yellow circle will appear at each segment point; this circle serves as a control point that you can move to adjust the segment's position. 
          This allows you to edit the walls. 
          </p>

          <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-full border' src='../../documentation/wallselected.png'/>
          </div>
          <p>
          To delete a wall, you can either press the delete button on your keyboard or tap the red trash icon located at the center right of the screen.
          </p>
          <p>
          After drawing your walls, you can begin adding doors, windows, and furnishings. To do that, please proceed to the next section.
          </p>
          </div>
        </article>
        <dl className="flex pt-6 mt-6 border-t border-slate-200">
          <div className="mr-auto text-left">
              <dt className="text-sm font-normal tracking-tight text-slate-600">
                Previous
              </dt>
              <dd className="mt-1">
                <NavLink to={'/plans/documentation/newplan'} className="text-base font-semibold text-slate-900 hover:underline">
                  Creating new plan
                </NavLink>
              </dd>
          </div>
          <div className="ml-auto text-right">
            <dt className="text-sm font-normal tracking-tight text-slate-600">
              Next
            </dt>
            <dd className="mt-1">
              <NavLink to={'/plans/documentation/addingFurnishing'} className="text-base font-semibold text-slate-900 hover:underline">
                Adding Furnishing
              </NavLink>
            </dd>
          </div>
        </dl>
        </>
  )
}

export default DrawingWalls