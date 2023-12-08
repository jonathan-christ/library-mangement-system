import PropTypes from 'prop-types'

import { useSession } from '../context-hooks/session/SessionUtils'
import { Navbar } from 'flowbite-react'

import NavigationLink from './NavigationLink'
import Logo from './navbar components/Logo'
import UserAvatar from './navbar components/UserAvatar'
import UserNotifications from './navbar components/UserNotifications'
import LoginSignup from './navbar components/LoginSignup'

UserNavigation.propTypes = {
    bg: PropTypes.any,
    functions: PropTypes.object.isRequired
}
function UserNavigation({ functions, bg }) {
    const session = useSession()

    return (
        // className='bg-primary-base text-gray-200'
        <Navbar fluid className={`${bg} text-text-900`}>
                <Logo to='/catalog' />
                <div className="flex md:order-2">
                    {session ?
                        <div className='flex gap-5'>
                            <UserNotifications />
                            <UserAvatar functions={functions} />
                        </div>
                        :
                        <LoginSignup functions={functions} />
                    }
                    <Navbar.Toggle />
                </div>
                <Navbar.Collapse>
                    {session &&
                        <>
                            <NavigationLink to="/catalog" label="CATALOG" />
                            <NavigationLink to="/reservations" label="RESERVATIONS" />
                            <NavigationLink to="/userfines" label="FINES" />
                        </>
                    }
                </Navbar.Collapse>
        </Navbar>
    )
}

export default UserNavigation