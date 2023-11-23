import React from 'react'
import ls from 'localstorage-slim'

import { Outlet, useOutletContext } from 'react-router-dom'
import NavigationBar from './navbars/NavigationBar'


function AppFrame() {

  return (
    <div className='bg-gray-100'>
      <NavigationBar />
      <Outlet />
    </div>
  )
}

export default AppFrame