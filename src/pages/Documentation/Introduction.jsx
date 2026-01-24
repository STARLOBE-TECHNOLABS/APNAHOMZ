import React from 'react'
import { NavLink } from 'react-router-dom'

const Introduction = () => {
  return (
        <>
        <article>
          <header>
            <p className="text-base ">
              Getting started
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Introduction 
            </h1>
          </header>
          <p className="mt-2 text-xl">
            Welcome to the documentation for the FloorLite, a web application for creating and editing interactive floor plans.
            This documentation aims to provide a guide to understanding the basic usage of the app and setting up the development environment.
          </p>
          <hr className='my-4' />
          <div className="mt-6">
            <h2 className='font-semibold text-xl my-2 text-gray-900'>
            Project Overview  
            </h2>
            <p>
            The Floor Lite is a web-based application build with React and Node.js that allows users to create and customize basic floor plans.
            </p>
          </div>
          <div className="mt-6">
            <h2 className='font-semibold text-xl my-2 text-gray-900'>
            Technology Stack &#128578;
            </h2>
            <ul className='list-disc ml-5 leading-7'>
              <li><strong className=''>Frontend</strong>: React is used to build interactive user interface.</li>
              <li><strong className=''>Backend</strong>: Node.js serves as the backend, handling server-side logic and communication with the database.</li>
              <li><strong className=''>State Management</strong>: Custom hooks for communication with API and Zustand for app state are using for state management.</li>
              <li><strong className=''>Styling</strong>: TailwindCSS are employed to manage styles in application.</li></ul>
          </div>
          <div className="mt-6">
            <h2 className='font-semibold text-xl my-2 text-gray-900'>
              Target Audience
            </h2>
            <p>
            This documentation is intended for developers with a basic understanding of React, Node.js, and related web development technologies.
            </p>
          </div>
        </article>
        <dl className="flex pt-6 mt-6 border-t border-slate-200">
          <div className="ml-auto text-right">
            <dt className="text-sm font-normal tracking-tight text-slate-600">
              Next
            </dt>
            <dd className="mt-1">
              <NavLink to={'/plans/documentation/Package'} className="text-base font-semibold text-slate-900 hover:underline">
                Package
              </NavLink>
            </dd>
          </div>
        </dl>
    </>
  )
}

export default Introduction