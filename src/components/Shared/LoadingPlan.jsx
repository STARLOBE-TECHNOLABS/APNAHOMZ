import React from 'react'

const LoadingPlan = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-slate-50'>
      <div className='text-sm font-medium flex items-center gap-2'>
          <div className='h-3 w-3 bg-yellow-400 rounded-full animate-ping'></div>
          <div className='text-slate-400'>Loading Floor Plan...</div>
      </div>
    </div>
  )
}

export default LoadingPlan