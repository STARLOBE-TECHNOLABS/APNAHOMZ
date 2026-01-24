import React from 'react'
import { NavLink } from 'react-router-dom'

const Organization = () => {
  return (
        <>
        <article >
          <header>
            <p className="text-base ">
              Project structure
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Folder organization
            </h1>
          </header>
          
         
          <hr className='my-4' />
          <div className="mt-6">
            <p>
            Understanding the folder structure and files is essential for customizing or making changes to the FloorLite app code. Below is a breakdown of the key directories and files to help you navigate and manage the application effectively. </p>
             <h3 className='font-semibold my-2 text-slate-900 flex gap-1'>
              Frontend - Vite.js (React)
            </h3>
             <pre className='my-4 whitespace-pre'>
              <div className="p-4 bg-gray-800 text-white rounded-lg text-sm">
              <code>
{"\n"}frontend/
{"\n"}├── public/               # Public assets folder
{"\n"}├── src/
{"\n"}│   ├── assets/           # Global css styles
{"\n"}│   ├── components/       # Components split by features
{"\n"}│   ├── config/           # Configuration file
{"\n"}│   ├── context/          # Custom React contexts
{"\n"}│   ├── hooks/            # Custom React hooks
{"\n"}│   ├── pages/            # Page-level components (Plans, FloorPlanEditor...)
{"\n"}│   ├── services/         # API service file for handling requests to backend
{"\n"}│   ├── store/            # App state
{"\n"}│   ├── utils/            # Utility functions and helpers
{"\n"}│   └── main.jsx          # Route definitions and configuration
{"\n"}├── .env                  # Environment variables
{"\n"}├── index.html           
{"\n"}├── package.json          # npm package configuration and scripts
{"\n"}├── postcss.config.js     # Postcss configuration
{"\n"}├── tailwind.config.js    # TailwindCSS configuration
{"\n"}└── vite.config.js        # Vite.js configuration

                  </code>
              </div>
            </pre>
            <h3 className='font-semibold my-2 text-slate-900 flex gap-1'>
              Backend - Node.js
            </h3>
             <pre className='my-4 whitespace-pre'>
              <div className="p-4 bg-gray-800 text-white rounded-lg text-sm">
              <code>
{"\n"}backend/
{"\n"}├── database/              # Database file - database.sqlite
{"\n"}├── src/
{"\n"}│   ├── config/            # Configuration file for database
{"\n"}│   ├── controllers/       # Request handlers and business logic
{"\n"}│   ├── middleware/        # Middleware functions for error handle
{"\n"}│   ├── models/            # Database models and schemas
{"\n"}│   ├── routes/            # API route definitions and route handlers
{"\n"}│   ├── scripts/           # Utility script for initialise database
{"\n"}│   ├── app.js             # Main application setup and configuration
{"\n"}│   └── server.js          # Entry point of the server, starts the Express server
{"\n"}├── .env                   # Environment variable
{"\n"}└── package.json           # npm package configuration and scripts


                  </code>
              </div>
            </pre>
            <p>
            For guide that will walk you through the basic functionalities please check the next section of this documentation.
            </p>
          </div>
         
         
        </article>
        <dl className="flex pt-6 mt-6 border-t border-slate-200">
          <div className="mr-auto text-left">
              <dt className="text-sm font-normal tracking-tight text-slate-600">
                Previous
              </dt>
              <dd className="mt-1">
                <NavLink to={'/plans/documentation/installation'} className="text-base font-semibold text-slate-900 hover:underline">
                  Installation guide
                </NavLink>
              </dd>
          </div>
          <div className="ml-auto text-right">
            <dt className="text-sm font-normal tracking-tight text-slate-600">
              Next
            </dt>
            <dd className="mt-1">
              <NavLink to={'/plans/documentation/plans'} className="text-base font-semibold text-slate-900 hover:underline">
                Plans
              </NavLink>
            </dd>
          </div>
        </dl>
        </>
  )
}

export default Organization