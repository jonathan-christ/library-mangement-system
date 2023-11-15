import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from './NavigationBar'

function AppLayout() {
  return (
    <>
        <Navigation />
        <Outlet />
    </>
  )
}

export default AppLayout