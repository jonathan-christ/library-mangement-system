import { Navbar } from 'flowbite-react'

import PropTypes from 'prop-types'
import Logo from './navbar components/Logo'
import UserAvatar from './navbar components/UserAvatar'
import UserNotifications from './navbar components/UserNotifications'

AdminNavigation.propTypes = {
    functions: PropTypes.object.isRequired
}
function AdminNavigation({ functions }) {

    return (
        <Navbar fluid>
            <Logo to='/admindash' />
            <div className="flex md:order-2">
                <div className='flex gap-5'>
                    <UserNotifications />
                    <UserAvatar functions={functions} />
                </div>
                <Navbar.Toggle />
            </div>
        </Navbar>
    )
}

export default AdminNavigation