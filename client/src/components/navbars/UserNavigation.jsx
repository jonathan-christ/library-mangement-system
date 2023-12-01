import SearchBar from '../misc/SearchBar'
import PropTypes from 'prop-types'

import { useSession } from '../context-hooks/session/SessionUtils'
import { Avatar, Dropdown, Navbar, Button } from 'flowbite-react'

import NavigationLink from './NavigationLink'
import Logo from './navbar components/Logo'

UserNavigation.propTypes = {
    functions: PropTypes.object.isRequired
}
function UserNavigation({ functions }) {
    const session = useSession()

    return (
        // className='bg-primary-base text-gray-200'
        <Navbar fluid>
            <Logo to='/catalog' />
            <div className="flex md:order-2">
                {session ?
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
                    :
                    <>
                        <Button color="none" onClick={() => functions.navigate('/login')}>Login</Button>
                        <Button color="blue" onClick={() => functions.navigate('/signup')}>Signup</Button>
                    </>
                }
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                {session ?
                    <>
                        <NavigationLink to="/catalog" label="CATALOG" />
                        <NavigationLink to="/reservations" label="RESERVATIONS" />
                        <NavigationLink to="/userfines" label="FINES" />
                    </>
                    :
                    <SearchBar />
                }
            </Navbar.Collapse>
        </Navbar >
    )
}

export default UserNavigation