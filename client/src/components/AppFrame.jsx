import { Outlet } from 'react-router-dom'
import NavigationBar from './navbars/NavigationBar'
import SideBar from './sidebars/Sidebar'

function AppFrame() {

  return (
    <div className='h-screen overflow-hidden bg-background-50'>
      <div className='w-screen relative z-10 shadow-md'>
        <NavigationBar />
      </div>
      <div className='flex flex-row h-full z-0'>
        <SideBar />
        <div className='w-full pb-10 overflow-y-auto overflow-x-scroll'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AppFrame