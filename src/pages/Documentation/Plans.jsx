import React from 'react'
import { NavLink } from 'react-router-dom'

const Plans = () => {
  return (
        <>
        <article>
          <header>
            <p className="text-base ">
              Project structure
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Plans
            </h1>
          </header>

          <hr className='my-4' />
          <div className="mt-6">
            <p>
              When you open the FloorLite app, you'll be presented with a view of your plans. These plans are organized into three categories: All, Favorite, and Trash. By default, you'll see all your plans first.
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-full border' src='../../documentation/allplans.png'/>
            </div>
            <p>
              To add a plan to your favorites, simply tap the star icon on the plan. The icon will turn yellow, indicating that the plan is now visible in the favorites section.
            </p>
            <div className='p-4 my-2'>
              <img className='rounded-md shadow-xl w-1/3 border' src='../../documentation/planoptions.png'/>
            </div>
            <p>
            To access your favorite section, simply tap on "Favorite" in the menu on the left side.
            </p>
            <div className='p-4 my-2 flex justify-center'>
              <img className='rounded-md shadow-xl w-full border' src='../../documentation/favorite.png'/>
            </div>
            <p>
            Similarly, to remove a plan, tap the trash icon, and it will move to the Trash section. From there, you can either permanently delete it or tap the icon with two arrows to restore it.
            </p>
            <div className='p-4 my-2 flex justify-center'>
              <img className='rounded-md shadow-xl w-full border' src='../../documentation/trash.png'/>
            </div>
            <p>
            To access the plan editor, tap on your plan's preview image, and you'll be redirected to the editor.
            </p>
          </div>
        </article>
        <dl className="flex pt-6 mt-6 border-t border-slate-200">
          <div className="mr-auto text-left">
              <dt className="text-sm font-normal tracking-tight text-slate-600">
                Previous
              </dt>
              <dd className="mt-1">
                <NavLink to={'/plans/documentation/organization'} className="text-base font-semibold text-slate-900 hover:underline">
                  Organization
                </NavLink>
              </dd>
          </div>
          <div className="ml-auto text-right">
            <dt className="text-sm font-normal tracking-tight text-slate-600">
              Next
            </dt>
            <dd className="mt-1">
              <NavLink to={'/plans/documentation/newplan'} className="text-base font-semibold text-slate-900 hover:underline">
              Creating new plan
              </NavLink>
            </dd>
          </div>
        </dl>
        </>
  )
}

export default Plans