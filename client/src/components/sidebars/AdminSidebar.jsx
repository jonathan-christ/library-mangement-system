'use client';

import { Sidebar } from 'flowbite-react'
import { HiUsers, HiChartPie, HiTicket, HiBookOpen, HiColorSwatch } from 'react-icons/hi'
import SidebarLink from './SidebarLink'

function AdminSidebar() {
    return (
        <Sidebar className='shadow-xl '>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <SidebarLink to='/admindash' label='Dashboard' icon={HiChartPie} />
                    <SidebarLink to='/users' label='Users' icon={HiUsers} />
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <SidebarLink to='/transactions' label='Transactions' icon={HiTicket} />
                    <Sidebar.Collapse label='Assets' icon={HiBookOpen} >
                        <SidebarLink to='/books' label='Books' />
                        <SidebarLink to='/images' label='Images' />
                        <SidebarLink to='/copies' label='Copies' />
                    </Sidebar.Collapse>
                    <Sidebar.Collapse label='Metadata' icon={HiColorSwatch } >
                        <SidebarLink to='/authors' label='Authors' />
                        <SidebarLink to='/genres' label='Genres' />
                        <SidebarLink to='/subjects' label='Subjects' />
                        <SidebarLink to='/publishers' label='Publishers' />
                        <SidebarLink to='/usertypes' label='User Types' />
                        <SidebarLink to='/classes' label='Classifications' />
                    </Sidebar.Collapse>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default AdminSidebar