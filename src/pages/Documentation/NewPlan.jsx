import React from 'react'
import { NavLink } from 'react-router-dom'

const NewPlan = () => {
  return (
        <>
        <article>
          <header>
            <p className="text-base ">
              Project structure
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            New plan
            </h1>
          </header>

          <hr className='my-4' />
          <div className="mt-6">
            <p>
            To create a new plan, tap the "Create" button located on the right side of the screen in the All Plans section.
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-full border' src='../../documentation/create.png'/>
            </div>
            <p>
              This action will take you to the Plan editor with a newly created plan.<br/>
              The main plan editor is composed of several sections. Let's go through each one.
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-full border' src='../../documentation/editor.png'/>
            </div>
            <p>
            In the top left corner, you'll find an icon that takes you back to all your plans, along with the title of your plan. You can edit the title by clicking on it and typing your changes. The new title will be saved automatically.
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-2/3 border' src='../../documentation/title.png'/>
            </div>
            <p>
            On the center left side, you'll find the main menu for editing your floor plan. 
            From top to bottom, the icons represent: <strong>drawing walls, adding doors, adding windows, adding furnishings and text.</strong>
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/editpanel.png'/>
            </div>
            <p>
              At the center bottom, you'll find controls for adjusting the view. You can zoom in, zoom out, or fit to view by clicking on the percentage value.
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/zoom.png'/>
            </div>
            <p>
            In the bottom right corner, you'll find controls for showing or hiding grid lines, as well as snapping elements to the grid. You can also change unit length here. A yellow background on the icons indicates that the function is enabled.
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/grid.png'/>
            </div>
            <p>
            In the top right section, you'll find a button to share your plan. Clicking this button opens a small window with a link to preview your plan.
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/share.png'/>
            </div>
            <p>
            To learn how to start drawing walls and adding new furnishings, please proceed to the next section.
            </p>
          </div>
        </article>
        <dl className="flex pt-6 mt-6 border-t border-slate-200">
          <div className="mr-auto text-left">
              <dt className="text-sm font-normal tracking-tight text-slate-600">
                Previous
              </dt>
              <dd className="mt-1">
                <NavLink to={'/plans/documentation/plans'} className="text-base font-semibold text-slate-900 hover:underline">
                  Plans
                </NavLink>
              </dd>
          </div>
          <div className="ml-auto text-right">
            <dt className="text-sm font-normal tracking-tight text-slate-600">
              Next
            </dt>
            <dd className="mt-1">
              <NavLink to={'/plans/documentation/drawingWalls'} className="text-base font-semibold text-slate-900 hover:underline">
                Drawing walls
              </NavLink>
            </dd>
          </div>
        </dl>
        </>
  )
}

export default NewPlan