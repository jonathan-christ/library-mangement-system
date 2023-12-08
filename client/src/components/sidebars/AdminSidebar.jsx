'use client';

import { Sidebar } from 'flowbite-react'
import { HiUsers, HiChartPie, HiTicket, HiBookOpen, HiColorSwatch } from 'react-icons/hi'
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdCategory } from 'react-icons/md'
import { useState } from 'react'

import SidebarLink from './SidebarLink'
import SideBarTheme from './SideBarTheme';

function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    }

    return (
        <div className='flex flex-col z-10'>
            <button className='bg-primary-50 p-3 hover:bg-primary-100 justify-center flex transition-all duration-100' onClick={handleToggle}><RxHamburgerMenu size={30}/></button>
            <Sidebar theme={SideBarTheme} className='shadow-xl rounded-none transition-transform duration-100' collapsed={isCollapsed}>
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <SidebarLink to='/admindash' label='Dashboard' icon={HiChartPie} />
                        <SidebarLink to='/users' label='Users' icon={HiUsers} />
                    </Sidebar.ItemGroup>
                    <Sidebar.ItemGroup>
                        <SidebarLink to='/tickets' label='Tickets' icon={HiTicket} />
                        <SidebarLink to='/fines' label='Fines' icon={FaMoneyBill1Wave} />
                        <Sidebar.Collapse label='Assets' icon={HiBookOpen} >
                            <SidebarLink to='/books' label='Books' />
                            <SidebarLink to='/copies' label='Copies' />
                        </Sidebar.Collapse>
                        <Sidebar.ItemGroup>
                            <Sidebar.Collapse label='Metadata' icon={HiColorSwatch} >
                                <SidebarLink to='/authors' label='Authors' />
                                <SidebarLink to='/genres' label='Genres' />
                                <SidebarLink to='/subjects' label='Subjects' />
                                <SidebarLink to='/publishers' label='Publishers' />
                            </Sidebar.Collapse>
                            <Sidebar.Collapse label='Entity Types' icon={MdCategory}>
                                <SidebarLink to='/usertypes' label='User Types' />
                                <SidebarLink to='/finecategs' label='Fine Categories' />
                                <SidebarLink to='/classes' label='Book Classifications' />
                            </Sidebar.Collapse>
                        </Sidebar.ItemGroup>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </div >
    )
}

export default AdminSidebar