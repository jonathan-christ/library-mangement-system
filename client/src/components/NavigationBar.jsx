import React from 'react'
import ViteLogo from '../assets/vite.svg'

import { Link, useMatch, useNavigate } from 'react-router-dom'
import { Avatar, Dropdown, Navbar, Button } from 'flowbite-react'

function Navigation() {
    const session = null
    const navigate = useNavigate()
    return (
        <Navbar fluid rounded>
            <Navbar.Brand href="#">
                <img src={ViteLogo} className="mr-3 h-6 sm:h-9" alt="PSHS-ZRC Logo" />
                <div>
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">ISCP LMS</span>
                </div>
            </Navbar.Brand>
            <div className="flex md:order-2">
                {session !== undefined &&
                    <div className="flex flex-row">
                        <span className="align- truncate text-xs text-gray-500 font-medium ">Student</span>
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
                            </Dropdown.Header>
                            <Dropdown.Item>Profile</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item><span className="text-red-600">Sign out</span></Dropdown.Item>
                        </Dropdown>

                    </div>
                }
                {session === undefined &&
                    <>
                        <Button color="none" onClick={() => navigate('/login')}>Login</Button>
                        <Button color="blue" onClick={() => navigate('/signup')}>Signup</Button>
                    </>
                }
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Link to='./home' className={Boolean(useMatch('/home')) ? 'text-blue-600' : ''}>
                    <span className="text-base">HOME</span>
                </Link>
                <Link to='./reservations' className={Boolean(useMatch('/reservations')) ? 'text-blue-600' : ''}>
                    <span className="text-base">RESERVATIONS</span>
                </Link>
                <Link to='./history' className={Boolean(useMatch('/history')) ? 'text-blue-600' : ''}>
                    <span className="text-base">HISTORY</span>
                </Link>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Navigation