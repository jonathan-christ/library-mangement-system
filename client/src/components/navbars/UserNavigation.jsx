import React from 'react'
import ViteLogo from '../../assets/vite.svg'
import SearchBar from '../misc/SearchBar'

import { useState, useEffect } from 'react'
import { Link, matchPath, useMatch, useLocation } from 'react-router-dom'
import { Avatar, Dropdown, Navbar, Button } from 'flowbite-react'

import { getSession, updateSession } from '../SessionContext'

function UserNavigation({ data, functions }) {
    const session = getSession()
    const setSession = updateSession()

    return (
        // className='bg-primary-base text-gray-200'
        <Navbar fluid className='shadow-md'>
            <Navbar.Brand href="#">
                <img src={ViteLogo} className="mr-3 h-6 sm:h-9" alt="PSHS-ZRC Logo" />
                <div>
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">ISCP LMS</span>
                </div>
            </Navbar.Brand>
            <div className="flex md:order-2">
                {session &&
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <div className='flex gap-2'>
                                <span className="self-center truncate text-xs text-gray-500 font-medium ">[{functions.translateUserType(session.typeID)}]</span>
                                <Avatar placeholderInitials={functions.getInitials(session.firstName, session.lastName)} rounded />
                            </div>
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm font-semibold text-gray-900 dark:text-white">{session.firstName + " " + session.lastName}</span>
                            <span className="block text-sm text-gray-500 truncate dark:text-gray-400 font-medium ">{session.email}</span>
                        </Dropdown.Header>
                        <Dropdown.Item onClick={() => functions.navigate('/profile')}>Profile</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => functions.signOut()}><span className="text-red-600" >Sign out</span></Dropdown.Item>
                    </Dropdown>
                }
                {!session &&
                    <>
                        <Button color="none" onClick={() => functions.navigate('/login')}>Login</Button>
                        <Button color="blue" onClick={() => functions.navigate('/signup')}>Signup</Button>
                    </>
                }
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                {session &&
                    <>
                        <Link to='./catalog' className={useMatch('/catalog') ? 'text-blue-600' : ''}>
                            <span className="text-base">CATALOG</span>
                        </Link>
                        <Link to='./reservations' className={useMatch('/reservations') ? 'text-blue-600' : ''}>
                            <span className="text-base">RESERVATIONS</span>
                        </Link>
                        <Link to='./history' className={useMatch('/history') ? 'text-blue-600' : ''}>
                            <span className="text-base">HISTORY</span>
                        </Link>
                    </>
                }
                {!session &&
                    <SearchBar />
                }
            </Navbar.Collapse>
        </Navbar >
    )
}

export default UserNavigation