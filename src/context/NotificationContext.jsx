import React, { createContext, useContext, useState} from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({children}) => {

  const [notification, setNotification] = useState({content: null, type: '', keyboard: null})

  const notify = ({content, type = "", autoHide = true, keyboard = null }) => {
    setNotification({content, type, autoHide, keyboard})
    if(autoHide) {
      setTimeout(() => setNotification({content: null, type: ''}), 5000)
    }
  }

  const notificationClass = () => {
    switch(notification.type) {
      case "warning": 
        return "bg-yellow-50 text-yellow-800 border border-yellow-200"
      case "error": 
        return "bg-red-50 text-red-800 border border-red-200"
      case "success":
        return "bg-green-50 text-green-800 border border-green-200"
      default :
        return "bg-white text-slate-700 border border-gray-200"
    }
  }

  return(
    <NotificationContext.Provider value={notify}>
      {notification.content && (
        <div className='fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down'>
        <div className={`flex items-center gap-3 py-3 px-6 shadow-lg rounded-lg ${notificationClass()}`}>
            
            {/* Icon based on type */}
            {notification.type === 'success' && (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            )}
            {notification.type === 'error' && (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )}
            {notification.type === 'warning' && (
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            )}

            <div className='flex gap-2 items-center'>
              <span className='text-sm font-medium'> {notification.content} </span>
              {notification.keyboard && 
              <div className='text-xs bg-white/50 border border-current rounded-md px-1.5 py-0.5 font-bold opacity-80'>
                {notification.keyboard}
              </div>
              } 
            </div>
        </div>
      </div>
      )}
      {children}
    </NotificationContext.Provider>
  )

}