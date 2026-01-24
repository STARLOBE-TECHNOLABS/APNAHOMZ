import React from 'react'
import { Outlet } from 'react-router-dom'

import usePlans from '../hooks/usePlans';

import Navigation from '../components/Plans/Navigation';
import Footer from '../components/Plans/Footer';

const Plans = () => {

  const {plans, updatePlanDetails, createNewPlan, removePlan, loading, error } = usePlans()

  return (
    <div className='flex min-h-svh w-full bg-slate-50'>
      <div className='fixed inset-y-0 left-0 w-60 bg-white border-r'>
        <Navigation />
      </div>
      <main className='flex-1 pl-60'>
        <div className='p-12 mx-auto lg:max-w-7xl flex flex-col justify-between h-full'>
          <Outlet context={{plans, updatePlanDetails, createNewPlan, removePlan, loading, error}}/>
          <Footer />
        </div>
      </main>
    </div>
  )
}

export default Plans