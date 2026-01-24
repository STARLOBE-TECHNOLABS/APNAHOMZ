import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { HiOutlinePencil } from "react-icons/hi";
import PlanList from './PlanList';
import PlanPlaceholder from './PlanPlaceholder';

const All = () => {

  const {plans, loading, error, updatePlanDetails, createNewPlan} = useOutletContext()

  const navigate = useNavigate()

  const handleFavorite =  async (planId, isFavorite) => {
    const updatedPlanData = {favorite: !isFavorite};
    await updatePlanDetails(planId, updatedPlanData)
  }

  const handleTrash =  async (planId) => {
    const updatedPlanData = {trash: true};
    await updatePlanDetails(planId, updatedPlanData)
  }

  const createPlan = async () => {
    const newPlan = await createNewPlan()
    navigate(`/editor/${newPlan.id}`)
  }

  if (error) return <div className='bg-red-100 p-2 text-sm rounded'>There was an error: <span className='text-red-500'>{error.message}</span></div>;

  const filteredPlans = plans.filter((plan) => !plan.trash)

  return (
    <div>
      <div className='mt-2 flex items-center'>
        <div className='flex-1'>
          <div className='text-2xl font-semibold'>
            Your plans
          </div>
          <div className='text-sm text-slate-400 mt-1'>
            All of your floor plans. Create, edit, share, delete or add to favorite. 
          </div>
        </div>
        <div>
          <div className='px-2 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium text-xs flex items-center gap-1 cursor-pointer' onClick={createPlan}>
           <HiOutlinePencil /> Create 
          </div>
        </div>
      </div>
      <div className='mt-6 grid gap-6 md:grid-cols-3 lg:grid-cols-4'>
        {loading ? <PlanPlaceholder /> : <PlanList plans={filteredPlans} loading={loading} handleFavorite={handleFavorite} handleTrash={handleTrash} />}
      </div>
    </div>
  )
}

export default All

