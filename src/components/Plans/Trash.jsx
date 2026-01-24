import React from 'react'
import { useOutletContext } from 'react-router-dom';
import PlanList from './PlanList';
import PlanPlaceholder from './PlanPlaceholder';

const Trash = () => {

  const {plans, removePlan, updatePlanDetails, loading, error } = useOutletContext()

  const handleTrash =  async (planId) => {
    await removePlan(planId)
  }

  const handleRestore =  async (planId) => {
    const updatedPlanData = {trash: false};
    await updatePlanDetails(planId, updatedPlanData)
  }

  if (error) return <div className='bg-red-100 p-2 text-sm rounded'>There was an error: <span className='text-red-500'>{error.message}</span></div>;

  const filteredPlans = plans.filter((plan) => plan.trash)

  return (
    <div>
      <div className='mt-2 flex items-center'>
        <div className='flex-1'>
          <div className='text-2xl font-semibold'>
            Trash
          </div>
          <div className='text-sm text-slate-400 mt-1'>
            All of your floor plans. Create, edit, share, delete or add to favorite. 
          </div>
        </div>
      </div>
      <div className='mt-6 grid gap-6 md:grid-cols-3 lg:grid-cols-4'>
        {loading ? <PlanPlaceholder /> : <PlanList plans={filteredPlans} handleTrash={handleTrash} handleRestore={handleRestore} />}
      </div>
    </div>
  )
}

export default Trash