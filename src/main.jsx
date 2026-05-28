import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'
import './assets/styles.css'

import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'
import Login from '@/pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import PlansIndexRedirect from './components/PlansIndexRedirect'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'

// Ladning Page complete
import Landing from './pages/Landing.jsx'

// Plans list
import All from './components/Plans/All.jsx'
import Favorite from './components/Plans/Favorite.jsx'
import Trash from './components/Plans/Trash.jsx'
import PlansDataLayout from './components/Plans/PlansDataLayout.jsx'
import Billing from './pages/Billing.jsx'
import Plans from './pages/Plans.jsx'

// Editor 
import FloorPlanEditor from './pages/FloorPlanEditor.jsx'

// Viewier
import FloorPlanViewer from './pages/FloorPlanViewer.jsx'

// Documentation
import AddingFurnishing from './pages/Documentation/AddingFurnishing.jsx'
import AddingText from './pages/Documentation/AddingText.jsx'
import ChangeLog from './pages/Documentation/ChangeLog.jsx'
import DrawingWalls from './pages/Documentation/DrawingWalls.jsx'
import Installation from './pages/Documentation/Installation.jsx'
import Introduction from './pages/Documentation/Introduction.jsx'
import Main from './pages/Documentation/Main.jsx'
import NewPlan from './pages/Documentation/NewPlan.jsx'
import Organization from './pages/Documentation/Organization.jsx'
import Package from './pages/Documentation/Package.jsx'
import DocPlans from './pages/Documentation/Plans.jsx'
import Sharing from './pages/Documentation/Sharing.jsx'
import Support from './pages/Documentation/Support.jsx'

// Error page
import ErrorPage from './pages/ErrorPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/plans",
    element: <ProtectedRoute><Plans /></ProtectedRoute>,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <PlansIndexRedirect /> },
      { path: "billing", element: <Billing /> },
      {
        element: <PlansDataLayout />,
        children: [
          { path: "all", element: <All /> },
          { path: "favorite", element: <Favorite /> },
          { path: "trash", element: <Trash /> },
        ],
      },
      {
        path: "documentation",
        element: <Main />,
        children: [
          {
            index: true,
            loader: () => redirect('introduction'),
          },
          {
            path: "introduction",
            element: <Introduction />,
          },
          {
            path: "installation",
            element: <Installation />,
          },
          {
            path: "package",
            element: <Package />,
          },
          {
            path: "organization",
            element: <Organization />,
          },
          {
            path: "plans",
            element: <DocPlans />,
          },
          {
            path: "newplan",
            element: <NewPlan />,
          },
          {
            path: "drawingwalls",
            element: <DrawingWalls />,
          },
          {
            path: "addingfurnishing",
            element: <AddingFurnishing />,
          },
          {
            path: "addingtext",
            element: <AddingText />,
          },
          {
            path: "sharing",
            element: <Sharing />,
          },
          {
            path: "support",
            element: <Support />,
          },
          {
            path: "changelog",
            element: <ChangeLog />,
          }
        ]
      },
    ]
  },
  {
    path: "/editor/:planId",
    element: (
      <ProtectedRoute>
        <FloorPlanEditor />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/view/:planId",
    element: (
      <ProtectedRoute>
        <FloorPlanViewer />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },

], {
  // If you upload to subfolder in your server
  // basename: "/floorlite"
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>,
)
