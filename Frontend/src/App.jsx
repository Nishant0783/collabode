import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Auth from './pages/auth'
import CreateRoom from './pages/createRoom'
import Room from './pages/room'
import RootLayout from './Layout/rootLayout';
import './App.css';
import { ThemeProvider } from './components/theme-provider'
import Home from './pages/home'

const App = () => {

  const router = createBrowserRouter([
    {
      path: '',
      element: <RootLayout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
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
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  )
}

export default App