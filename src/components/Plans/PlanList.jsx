import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import PlanThumbnail from './PlanThumbnail/PlanThumbnail'
import TimeAgo from 'react-timeago'
import { HiOutlineStar, HiOutlineTrash, HiOutlineRefresh, HiOutlineExclamationCircle } from "react-icons/hi";

const PlanList = ({plans, loading, handleFavorite = null, handleTrash, handleRestore = null}) => {

  // Internal mechanism for smooth show, control with duration-100 class
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if(!loading) {
      setIsVisible(true)
    }
  },[loading])

  return (
    <>
      {
        plans.length === 0 && (
        <div className='bg-slate-200 px-2 py-1 rounded text-slate-500 text-sm flex items-center gap-1'>
          <HiOutlineExclamationCircle />
          No floor plans
        </div>)
      }
      {plans.map((plan,i) => 
          <div className={`shadow hover:bg-slate-100 rounded-lg relative transition ease-in duration-100 ${isVisible ? "opacity-100" : "opacity-0" }`} key={i}>
              <NavLink to={'/editor/' + plan.id}>
                <PlanThumbnail plan={plan}/>
              </NavLink>
                <div className='py-3 px-4 flex items-center'>
                  <div className='flex-1'>
                    <div className='text-sm font-semibold'>
                      {plan.name} 
                    </div>
                    <div className='text-xs text-slate-400'>
                      <TimeAgo date={plan.createdAt}/>
                    </div>
                  </div>
                  <div className='flex gap-1'>
                  {handleRestore && 
                      <button onClick={() => handleRestore(plan.id)}>
                        <HiOutlineRefresh />
                      </button>
                    } 
                    {handleFavorite && 
                      <button onClick={() => handleFavorite(plan.id, plan.favorite)}>
                        {plan.favorite ? <HiOutlineStar className='fill-yellow-200 stroke-yellow-400' /> : <HiOutlineStar />}
                      </button>
                    } 
                    <button onClick={() => handleTrash(plan.id, plan.trash)}>
                      <HiOutlineTrash />
                    </button>
                  </div>
              </div>
          </div>
        )}
    </>
  )
}

export default PlanList