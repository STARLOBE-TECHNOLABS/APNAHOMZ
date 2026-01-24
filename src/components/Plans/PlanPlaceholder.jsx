const PlanPlaceholder = () => {

  return(
    <>
    <div className='animate-pulse transition ease-in-out duration-700 opacity-0'>
      <div className='bg-slate-200 h-40 rounded-2xl'></div>
      <div className='py-2 px-2'>
          <div className='flex-1'>
            <div className='bg-slate-200 rounded-md h-4'></div>
            <div className='bg-slate-200 rounded-md h-3 w-16 mt-1'></div>
        </div>
      </div>
    </div>
    <div className='animate-pulse transition ease-in-out duration-700 opacity-0'>
      <div className='bg-slate-200 h-40 rounded-2xl'></div>
      <div className='py-2 px-2'>
          <div className='flex-1'>
            <div className='bg-slate-200 rounded-md h-4'></div>
            <div className='bg-slate-200 rounded-md h-3 w-16 mt-1'></div>
        </div>
      </div>
    </div>
    </>
  )
}

export default PlanPlaceholder