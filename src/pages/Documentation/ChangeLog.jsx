import React from 'react'
import { NavLink } from 'react-router-dom'

const ChangeLog = () => {
  return (
        <>
        <article>
          <header>
            <p className="text-base ">
              Project structure
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            ChangeLog
            </h1>
          </header>
          <hr className='my-4' />
          <div className="mt-6">
            <h2 className='font-semibold text-lg mb-3'>
              Version 1.2.0 - (October 3, 2024)
            </h2>
            <p>
            This release focuses on adding new features to editor.
            </p>
            <ul className='list-disc ml-4 my-3 leading-8'>
              <li>
              <strong>Fit to view:</strong> When the plan initially loads, the view will automatically adjust to fit within the walls. The same "fit view" functionality can also be activated by clicking on the percentage value in the zoom controls.
              </li>
              <li>
              <strong>Measure Wall Segment:</strong> By drawing a wall, a new measurement line is created to display the length of the wall.
              </li>
               <li>
              <strong>Text Element:</strong> A new text element is available for labeling rooms or adding simple annotations.
               </li>
               <li>
              <strong>Unit Length:</strong> You can now change the unit of measurement. The available options are centimeters, inches, and feet.
               </li>
               <li>
              <strong>Library Expansion:</strong> Two new flower items have been added to the library.
               </li>
            </ul>
          </div>
          <hr className='my-4' />
          <div className="mt-6">
            <h2 className='font-semibold text-lg mb-3'>
              Version 1.1.0 - (August 28, 2024)
            </h2>
            <p>
            This release focuses on editing and removing wall segments.
            </p>
            <ul className='list-disc ml-4 my-3 leading-8'>
              <li>
              <strong>Editing walls</strong> Add control points to wall segments when they are active. Control points allow you to adjust the position of each segment.
              </li>
              <li>
              <strong>Remove Wall Segments and Furnishing:</strong> A new button has been added for delete action.
              </li>
               <li>
              <strong>Rotate icon:</strong> Add a rotate icon to the rotate button to enhance the user interface.
               </li>
            </ul>
          </div>
          <hr className='my-4' />
          <div className="mt-6">
            <h2 className='font-semibold text-lg mb-3'>
              Version 1.0.0 - Initial Release (August 23, 2024)
            </h2>
            <p>
            The initial version includes all the core features and functionalities designed to provide a seamless and interactive floor plan creator experience. Below are the details of this initial release:
            </p>
            <ul className='list-disc ml-4 my-3 leading-8'>
              <li>
              <strong>Interactive Floor Plans:</strong> Create and manage interactive floor plans easy-to-use tools.
              </li>
              <li>
              <strong>Zoom in and out:</strong> Easily zoom in for detailed work or zoom out to see the bigger picture.
              </li>
              <li>
              <strong>Show and Hide Grid:</strong> Toggle the grid view on and off according to your needs. Use the grid or hide it for a cleaner view of your design.
              </li>
              <li>
              <strong>Snap to Grid:</strong> Achieve alignment with snap to grid feature.
              </li>
              <li>
              <strong>Link to Preview:</strong> Share your designs effortlessly by generating a unique link. Allow others to preview your floor plans online without needing to download any software.
              </li>
            </ul>
          </div>
        </article>
        <dl className="flex pt-6 mt-6 border-t border-slate-200">
          <div className="mr-auto text-left">
              <dt className="text-sm font-normal tracking-tight text-slate-600">
                Previous
              </dt>
              <dd className="mt-1">
                <NavLink to={'/plans/documentation/support'} className="text-base font-semibold text-slate-900 hover:underline">
                  Support
                </NavLink>
              </dd>
          </div>
        </dl>
        </>
  )
}

export default ChangeLog