import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Auth from './pages/auth'
import CreateRoom from './pages/createRoom'
import Room from './pages/room'
import RootLayout from './Layout/rootLayout';

const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          path: '/auth',
          element: <Auth />
        },
        {
          path: '/create-room',
          element: <CreateRoom />
        },
        {
          path: '/room/:roomId',
          element: <Room />
        },

      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App