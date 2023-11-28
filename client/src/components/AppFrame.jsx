import { Outlet } from 'react-router-dom'
import NavigationBar from './navbars/NavigationBar'
import SideBar from './sidebars/Sidebar'

function AppFrame() {

  return (
    <div className='bg-gray-100 h-screen overflow-hidden'>
      <div className='w-screen relative z-10 shadow-md'>
        <NavigationBar />
      </div>
      <div className='flex flex-row h-full z-0'>
        <SideBar />
        <div className='w-full overflow-x-scroll'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AppFrame