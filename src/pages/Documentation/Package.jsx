import React from 'react'
import { NavLink } from 'react-router-dom'

const Package = () => {
  return (
        <>
        <article >
          <header>
            <p className="text-base ">
              Getting started
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Package 
            </h1>
          </header>
          <hr className='my-4' />
          <div className="mt-6">
            <p>
            When you purchase FloorLite from CodeCanyon, the download includes a ZIP package containing all the necessary files to get started. Below is a summary of what you can find in the package:
            </p>
            <h2 className='font-semibold text-xl my-3 text-gray-900'>
            What’s Included in the ZIP Package
            </h2>
            <ul className='list-disc ml-5 leading-7 flex flex-col gap-4'>
            <li><p className="text-gray-900"><strong>Documentation (<code>Documentation/</code>)</strong>:</p>
            Documentation includes step-by-step installation instructions and a guide to understanding the basic usage of the app.</li>
              <li>
                <p className='text-gray-900'><strong>Demo application (<code>FlorLiteDemo/</code>)</strong>:</p>
                Separated project with complete source code for demo application. In this project you have eveyrhing you see on demo app. 
                Landing page, documentation and editor is in a one project. Demo version use localStorage as a database. 
              </li>
              <li>
                <p className='text-gray-900'><strong>Floor Lite (<code>FlorLite/</code>)</strong>:</p>
                The complete source code of the FloorLite app with node.js as a backend and sqlite as a database.
              </li>
            </ul>
          </div>
          <div className="mt-6">
            <h2 className='font-semibold text-xl my-2 text-gray-900'>
            How to Use the ZIP Package
            </h2>
            <ul className='list-decimal ml-5 leading-7'>
              <li>Extract the ZIP file to a directory on your computer.</li>
              <li>Navigate to the desired folder to access the source code and start the installation process.</li>
              <li>Refer to the documentation for detailed setup and usage instructions.</li>
            </ul>
          </div>
         
        </article>
        <dl className="flex pt-6 mt-6 border-t border-slate-200">
          <div className="mr-auto text-left">
              <dt className="text-sm font-normal tracking-tight text-slate-600">
                Previous
              </dt>
              <dd className="mt-1">
                <NavLink to={'/plans/documentation/introduction'} className="text-base font-semibold text-slate-900 hover:underline">
                  Introduction 
                </NavLink>
              </dd>
          </div>
          <div className="ml-auto text-right">
            <dt className="text-sm font-normal tracking-tight text-slate-600">
              Next
            </dt>
            <dd className="mt-1">
              <NavLink to={'/plans/documentation/installation'} className="text-base font-semibold text-slate-900 hover:underline">
              Installation guide 
              </NavLink>
            </dd>
          </div>
        </dl>
        </>
  )
}

export default Package