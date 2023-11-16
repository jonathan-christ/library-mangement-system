import React from 'react'
import ViteLogo from '../../assets/vite.svg'
import SearchBar from '../misc/SearchBar'

import { useState, useEffect } from 'react'
import { Link, useMatch, useNavigate } from 'react-router-dom'
import { Avatar, Dropdown, Navbar, Button } from 'flowbite-react'

function UserNavigation({ data, functions }) {
    return (
        <Navbar fluid rounded>
            <Navbar.Brand href="#">
                <img src={ViteLogo} className="mr-3 h-6 sm:h-9" alt="PSHS-ZRC Logo" />
                <div>
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">ISCP LMS</span>
                </div>
            </Navbar.Brand>
            <div className="flex md:order-2">
                {data &&
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <div className='flex gap-2'>
                                <span className="self-center truncate text-xs text-gray-500 font-medium ">[{functions.translateUserType(data.typeID)}]</span>
                                <Avatar placeholderInitials={functions.getInitials(data.firstName, data.lastName)} rounded />
                            </div>
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm font-semibold text-gray-900 dark:text-white">{data.firstName + " " + data.lastName}</span>
                            <span className="block text-sm text-gray-500 truncate dark:text-gray-400 font-medium ">{data.email}</span>
                        </Dropdown.Header>
                        <Dropdown.Item>Profile</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => functions.signOut()}><span className="text-red-600" >Sign out</span></Dropdown.Item>
                    </Dropdown>
                }
                {!data &&
                    <>
                        <Button color="none" onClick={() => functions.navigate('/login')}>Login</Button>
                        <Button color="blue" onClick={() => functions.navigate('/signup')}>Signup</Button>
                    </>
                }
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                {data &&
                    <>
                        <Link to='./home' className={Boolean(useMatch('/home')) ? 'text-blue-600' : ''}>
                            <span className="text-base">HOME</span>
                        </Link>
                        <Link to='./reservations' className={Boolean(useMatch('/reservations')) ? 'text-blue-600' : ''}>
                            <span className="text-base">RESERVATIONS</span>
                        </Link>
                        <Link to='./history' className={Boolean(useMatch('/history')) ? 'text-blue-600' : ''}>
                            <span className="text-base">HISTORY</span>
                        </Link>
                    </>
                }
                {!data &&
                    <SearchBar/>
                }
            </Navbar.Collapse>
        </Navbar>
    )
}

export default UserNavigation