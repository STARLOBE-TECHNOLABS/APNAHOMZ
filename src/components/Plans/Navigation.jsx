import { NavLink } from 'react-router-dom'
import { HiViewList, HiOutlineStar, HiOutlineTrash, HiLogout } from "react-icons/hi";
import { useAuth } from '../../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className='flex h-full min-h-0 flex-col text-white'>
            <div className='p-6'>
                <NavLink to={'/'}>
                  <div className='flex items-center'>
                     <div className='font-semibold flex items-start gap-1'>
                        <img src="/landing/logo.png" alt="ApnaHomz" className="w-[260px] h-auto object-contain" />
                      <span className='rounded-lg text-xs '></span>
                    </div>
                  </div>
                </NavLink>
            </div>
            <div className='flex-1 p-6 flex flex-col gap-1 text-sm font-semibold'> 
              <div className='my-2 text-white/50 text-xs uppercase'>
                Plans
              </div>
              <NavLink className="[&.active]:bg-[#B38F4B]/30 [&.active]:text-[#B38F4B] hover:bg-white/10 text-white/90 px-2 py-1 rounded-md flex items-center gap-2 border-l-2 border-transparent [&.active]:border-[#B38F4B]" to={'all'} >
                <HiViewList /> All</NavLink>
              <NavLink className="[&.active]:bg-[#B38F4B]/30 [&.active]:text-[#B38F4B] hover:bg-white/10 text-white/90 px-2 py-1 rounded-md flex items-center gap-2 border-l-2 border-transparent [&.active]:border-[#B38F4B]" to={"favorite"} >
                <HiOutlineStar/> Favorite</NavLink>
              <NavLink className="[&.active]:bg-[#B38F4B]/30 [&.active]:text-[#B38F4B] hover:bg-white/10 text-white/90 px-2 py-1 rounded-md flex items-center gap-2 border-l-2 border-transparent [&.active]:border-[#B38F4B]" to={"trash"}>
                <HiOutlineTrash />Trash</NavLink>
              <hr className='my-3 border-white/10' />
             {/* <NavLink className="[&.active]:bg-slate-100 hover:bg-slate-50 px-2 py-1 rounded-md flex items-center gap-2" to={'documentation'}>
                <HiOutlineDocumentText /> Documentation
              </NavLink>*/}
              
            </div>
            <div className='p-6'>
              {user && (
                <div className='mb-4 p-3 bg-[#1a3332] rounded-lg border border-white/10'>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='w-8 h-8 rounded-full bg-[#B38F4B]/40 flex items-center justify-center text-[#B38F4B] font-bold uppercase'>
                      {user.username.charAt(0)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm font-medium text-white truncate'>{user.username}</div>
                      <div className='text-xs text-white/60 truncate'>{user.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={logout}
                    className='w-full flex items-center justify-center gap-2 text-xs text-white/80 hover:bg-white/10 p-1.5 rounded transition-colors'
                  >
                    <HiLogout size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
        </nav>
  )
}

export default Navigation