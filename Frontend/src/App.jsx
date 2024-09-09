import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Auth from './pages/auth';
import CreateRoom from './pages/createRoom';
import Room from './pages/room';
import RootLayout from './Layout/rootLayout';
import './App.css';
import { ThemeProvider } from './components/theme-provider';
import Home from './pages/home';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PersistLogin from './components/PersistLogin/PersistLogin';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true, // This makes '/' route point to Home
          element: <Home />,
        },
        {
          path: '/auth',
          element: <Auth />,
        },
        {
          element: <PersistLogin />, // PersistLogin wraps protected routes
          children: [
            {
              element: <ProtectedRoute />, // ProtectedRoute wraps individual protected routes
              children: [
                {
                  path: '/create-room',
                  element: <CreateRoom />,
                },
                {
                  path: '/room/:roomId',
                  element: <Room />,
                },
              ],
            },
          ],
        },
        {
          path: '/unauthorized',
          element: <h1>Unauthorized</h1>,
        },
      ],
    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
