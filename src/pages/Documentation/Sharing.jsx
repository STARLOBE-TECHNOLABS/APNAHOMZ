import React from 'react'
import { NavLink } from 'react-router-dom'

const Sharing = () => {
  return (
        <>
        <article>
          <header>
            <p className="text-base ">
              Project structure
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Sharing
            </h1>
          </header>

          <hr className='my-4' />
          <div className="mt-6">
          <p>
          To present your floor plan effectively, you should display it without the full editor. Tap the share button in the top-right corner to open a small window for sharing options.
          </p>
          <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-1/2 border' src='../../documentation/sharebutton.png'/>
            </div>
            <p>
            You can copy this link and share it with others. Please note that in the demo version of the app, the link will only work for you, as all plans are stored in localStorage. When you use the app with a backend, the link will be accessible to any user who has it.
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-2/3 border' src='../../documentation/share.png'/>
            </div>
            <p>
            The preview mode does not include tools for editing the floor plan.
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-full border' src='../../documentation/preview.png'/>
            </div>

          </div>
        </article>
        <dl className="flex pt-6 mt-6 border-t border-slate-200">
          <div className="mr-auto text-left">
              <dt className="text-sm font-normal tracking-tight text-slate-600">
                Previous
              </dt>
              <dd className="mt-1">
                <NavLink to={'/plans/documentation/addingFurnishing'} className="text-base font-semibold text-slate-900 hover:underline">
                  Adding Furnishing
                </NavLink>
              </dd>
          </div>
          <div className="ml-auto text-right">
            <dt className="text-sm font-normal tracking-tight text-slate-600">
              Next
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

export default Sharing