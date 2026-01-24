import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { ScrollRestoration } from "react-router-dom";

const Main = () => {
  return (
    <main className="relative flex justify-center mx-auto max-w-7xl -m-8">
      <div className="fixed top-[3.5rem] h-screen shadow-xl px-4 left-0 hidden peer-checked:block lg:relative lg:top-0 lg:h-auto lg:px-0 lg:block lg:flex-none lg:shadow-none">
        <nav className="sticky top-[2rem] w-64 pr-8 text-base lg:text-sm xl:w-72 xl:pr-16">
          <ul role="list" className="-ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto py-7 pl-0.5 space-y-8">
            <li>
              <h3 className="font-semibold tracking-tight text-slate-900">
                Getting started
              </h3>

              <ul role="list" className="pl-2 mt-3 space-y-2 text-slate-600">
                <li>
                  <NavLink to={'introduction'} className='[&.active]:bg-slate-200 px-2 py-1 rounded-md hover:text-slate-800 block'>
                    Introduction
                  </NavLink>
                </li>
                <li>
                  <NavLink to={'package'} className='[&.active]:bg-slate-200 px-2 py-1 rounded-md hover:text-slate-800 block'>
                    Package
                  </NavLink>
                </li>
                <li>
                  <NavLink to={'installation'} className='[&.active]:bg-slate-200 px-2 py-1 rounded-md hover:text-slate-800 block'>
                    Installation guide
                  </NavLink>
                </li>
                <li>
                  <NavLink to={'organization'} className='[&.active]:bg-slate-200 px-2 py-1 rounded-md hover:text-slate-800 block'>
                    Folder structure
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <h3 className="font-semibold tracking-tight text-slate-900">
                Usage 
              </h3>

              <ul role="list" className="pl-3 mt-3 space-y-2">
                <li>
                  <NavLink to={'plans'} className='[&.active]:bg-slate-200 px-2 py-1 rounded-md hover:text-slate-800 block'>
                  Plans
                  </NavLink>
                </li>
                <li>
                  <NavLink to={'newplan'} className='[&.active]:bg-slate-200 px-2 py-1 rounded-md hover:text-slate-800 block'>
                  Creating new plan
                  </NavLink>
                </li>
                <li>
                  <NavLink to={'drawingWalls'} className='[&.active]:bg-slate-200 px-2 py-1 rounded-md hover:text-slate-800 block'>
                    Drawing walls
                  </NavLink>
                </li>
                <li>
                  <NavLink to={'addingFurnishing'} className='[&.active]:bg-slate-200 px-2 py-1 rounded-md hover:text-slate-800 block'>
                    Adding furnishing
                  </NavLink>
                </li>
                <li>
                  <NavLink to={'addingText'} className='[&.active]:bg-slate-200 px-2 py-1 rounded-md hover:text-slate-800 block'>
                    Adding text
                  </NavLink>
                </li>
                <li>
                  <NavLink to={'sharing'} className='[&.active]:bg-slate-200 px-2 py-1 rounded-md hover:text-slate-800 block'>
                    Sharing
                  </NavLink>
                </li>
              </ul>
            </li>

            <li>
              <h3 className="font-semibold tracking-tight text-slate-900">
              Appendix
              </h3>

              <ul role="list" className="pl-3 mt-3 space-y-2">
                <li>
                  <NavLink to={'support'} className='[&.active]:bg-slate-200 px-2 py-1 rounded-md hover:text-slate-800 block'>
                    Support
                  </NavLink>
                </li>
                <li>
                  <NavLink to={'changeLog'} className='[&.active]:bg-slate-200 px-2 py-1 rounded-md hover:text-slate-800 block'>
                    ChangeLog
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-auto max-w-2xl min-w-0 px-4 py-10 lg:max-w-none lg:pr-0 lg:pl-8 ">
        <ScrollRestoration />
        <Outlet />
      </div>
    </main>
  )
}

export default Main