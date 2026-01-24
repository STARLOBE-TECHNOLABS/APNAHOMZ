import React from 'react'
import { NavLink } from 'react-router-dom'
import { CgSupport } from 'react-icons/cg'
import { HiViewList, HiOutlineStar, HiOutlineTrash, HiOutlineDocumentText, HiLogout } from "react-icons/hi";
import { useAuth } from '../../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className='flex h-full min-h-0 flex-col'>
            <div className='p-6'>
                <NavLink to={'/'}>
                  <div className='flex items-center'>
                     <div className='font-semibold flex items-start gap-1'>
                        <img src="https://apnahomz.com/wp-content/uploads/2025/06/webs.png" alt="ApnaHomz" style={{ width: "100px", height: "auto" }} />
                      <span className='rounded-lg text-xs '></span>
                    </div>
                  </div>
                </NavLink>
            </div>
            <div className='flex-1 p-6 flex flex-col gap-1 text-sm font-semibold'> 
              <div className='my-2 text-slate-400 text-xs uppercase'>
                Plans
              </div>
              <NavLink className="[&.active]:bg-slate-100 hover:bg-slate-50 px-2 py-1 rounded-md flex items-center gap-2" to={'all'} >
                <HiViewList /> All</NavLink>
              <NavLink className="[&.active]:bg-slate-100 hover:bg-slate-50 px-2 py-1 rounded-md flex items-center gap-2" to={"favorite"} >
                <HiOutlineStar/> Favorite</NavLink>
              <NavLink className="[&.active]:bg-slate-100 hover:bg-slate-50 px-2 py-1 rounded-md flex items-center gap-2" to={"trash"}>
                <HiOutlineTrash />Trash</NavLink>
              <hr className='my-3' />
             {/* <NavLink className="[&.active]:bg-slate-100 hover:bg-slate-50 px-2 py-1 rounded-md flex items-center gap-2" to={'documentation'}>
                <HiOutlineDocumentText /> Documentation
              </NavLink>*/}
              
            </div>
            <div className='p-6'>
              {user && (
                <div className='mb-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm'>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase'>
                      {user.username.charAt(0)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm font-medium text-gray-900 truncate'>{user.username}</div>
                      <div className='text-xs text-gray-500 truncate'>{user.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={logout}
                    className='w-full flex items-center justify-center gap-2 text-xs text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors'
                  >
                    <HiLogout size={14} /> Sign out
                  </button>
                </div>
              )}
              
              <div className='text-gray-500 text-xs bg-slate-100 p-3 rounded-md'>
                {/*<div className='text-gray-900 mb-1 font-semibold flex items-center gap-1'> 
                  <CgSupport size={14}/>
                  Support
                </div>*/}
                {/*<div>
                  Feel free to email us at <span className='text-indigo-500 '>support@floorlite</span> if you need any help.
                </div>*/}
              </div>
            </div>
        </nav>
  )
}

export default Navigation