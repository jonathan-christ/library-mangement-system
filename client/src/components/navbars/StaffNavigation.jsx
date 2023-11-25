import { useSession } from '../context-hooks/session/SessionUtils'
import { Avatar, Dropdown, Navbar } from 'flowbite-react'

import PropTypes from 'prop-types'
import NavigationLink from './NavigationLink'
import Logo from './navbar components/Logo'

StaffNavigation.propTypes = {
    functions: PropTypes.object.isRequired
}
function StaffNavigation({ functions }) {
    const session = useSession()

    return (
        <Navbar fluid rounded className='shadow-md z-10'>
            <Logo to='/dashboard' />
            <div className="flex md:order-2">
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
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <>
                    <NavigationLink to='dashboard' label="DASHBOARD" />
                    <NavigationLink to='books' label="BOOK" />
                    {/* ^ to be replaced with CATALOG */}
                    <NavigationLink to='authors' label="AUTHORS" />
                    <NavigationLink to='publishers' label="PUBLISHERS" />
                </>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default StaffNavigation