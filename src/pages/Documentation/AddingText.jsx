import React from 'react'
import { NavLink } from 'react-router-dom'

const AddingText = () => {
  return (
        <>
        <article>
          <header>
            <p className="text-base ">
              Project structure
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Adding text
            </h1>
          </header>

          <hr className='my-4' />
          <div className="mt-6">
            <p>
            To add text element, simply tap the text icon on the left center panel. The text element will appear on the canvas.
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/textadding.png'/>
            </div>
          </div>
          <p>
          A text element can be moved and rotated just like any other element on the canvas. Just tap on it, and a yellow border will appear, indicating that it's active and ready to be moved or rotated.
          </p>
          <br/>
          <p>
          An additional text element can be resized, which is useful for managing large text and controlling its display area. To resize the text, click on the resize icon located in the bottom-right corner.
          </p>
          <div className='p-4 my-2'>
            <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/resizetext.png'/>
          </div>
          <p>
          After placing the text on the desired place, you can edit it by double-clicking on the text element.
          The text editing window will appear just above the zoom controls.
          </p>
          <div className='p-4 my-2'>
            <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/edittext.png'/>
          </div>
          <p>
          Here, you can enter your text, and once you're finished, tap the "Update" button.
          </p>
          <div className='p-4 my-2'>
            <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/entertext.png'/>
          </div>
          <div className='p-4 my-2'>
            <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/updatetext.png'/>
          </div>
          <p>
          You can add as many text elements as needed, which can be useful for labeling rooms in your plans or adding simple annotations.
          </p>


            
        </article>
        <dl className="flex pt-6 mt-6 border-t border-slate-200">
          <div className="mr-auto text-left">
              <dt className="text-sm font-normal tracking-tight text-slate-600">
                Previous
              </dt>
              <dd className="mt-1">
                <NavLink to={'/plans/documentation/addingFurnishing'} className="text-base font-semibold text-slate-900 hover:underline">
                  Adding furnishing
                </NavLink>
              </dd>
          </div>
          <div className="ml-auto text-right">
            <dt className="text-sm font-normal tracking-tight text-slate-600">
              Next
            </dt>
            <dd className="mt-1">
              <NavLink to={'/plans/documentation/sharing'} className="text-base font-semibold text-slate-900 hover:underline">
                Sharing
              </NavLink>
            </dd>
          </div>
        </dl>
        </>
  )
}

export default AddingText