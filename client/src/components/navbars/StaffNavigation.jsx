import { Navbar } from 'flowbite-react'

import PropTypes from 'prop-types'
import NavigationLink from './NavigationLink'
import Logo from './navbar components/Logo'
import UserNotifications from './navbar components/UserNotifications'
import UserAvatar from './navbar components/UserAvatar'

StaffNavigation.propTypes = {
    bg: PropTypes.any,
    functions: PropTypes.object.isRequired
}
function StaffNavigation({ functions, bg }) {
    return (
        <Navbar fluid className={`${bg} text-text`}>
            <Logo to='/dashboard' />
            <div className="flex md:order-2">
                <div className='flex gap-5'>
                    <UserNotifications />
                    <UserAvatar functions={functions} />
                </div>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <>
                    <NavigationLink to='/dashboard' label="DASHBOARD" />
                    <NavigationLink to='/catalog' label="CATALOG" />
                    <NavigationLink to='/userconfirm' label="USERS" />
                    <NavigationLink to='/updateticket' label="TICKETS" />
                    <NavigationLink to='/finelist' label="FINES" />
                </>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default StaffNavigation