import React from 'react'
import ViteLogo from '../assets/vite.svg'

import { useMatch } from 'react-router-dom'
import { Avatar, Dropdown, Navbar } from 'flowbite-react'

function Navigation() {
    const session = 5
    return (
        <Navbar fluid rounded>
            <Navbar.Brand href="#">
                <img src={ViteLogo} className="mr-3 h-6 sm:h-9" alt="PSHS-ZRC Logo" />
                <div>
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">ISCP LMS</span>
                </div>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar placeholderInitials={"NS"} rounded />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">Neil sims</span>
                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400 font-medium ">name@flowbite.com</span>
                        <span className="block truncate text-xs text-gray-500 font-medium ">Student</span>
                    </Dropdown.Header>
                    <Dropdown.Item>Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item><span className="text-red-600">Sign out</span></Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link href='./home' active={Boolean(useMatch('/home')) ? true : undefined}>
                    <span className="text-base">HOME</span>
                </Navbar.Link>
                <Navbar.Link href='./reservations'>
                    <span className="text-base">RESERVATIONS</span>
                </Navbar.Link>
                <Navbar.Link href='./history'>
                    <span className="text-base">HISTORY</span>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Navigation