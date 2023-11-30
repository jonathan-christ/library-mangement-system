'use client';

import { Sidebar } from 'flowbite-react'
import { HiUsers, HiChartPie, HiTicket, HiBookOpen, HiColorSwatch } from 'react-icons/hi'
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { MdCategory } from 'react-icons/md'

import SidebarLink from './SidebarLink'

function AdminSidebar() {
    return (
        <Sidebar className='shadow-xl w-1/5'>
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
    )
}

export default AdminSidebar