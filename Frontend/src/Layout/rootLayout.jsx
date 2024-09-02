import React from 'react'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='px-[100px]'>
      <Outlet />
    </div>
)
}

export default RootLayout