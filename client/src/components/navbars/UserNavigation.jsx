import SearchBar from '../misc/SearchBar'
import PropTypes from 'prop-types'

import { useSession } from '../context-hooks/session/SessionUtils'
import { Navbar, Button } from 'flowbite-react'

import NavigationLink from './NavigationLink'
import Logo from './navbar components/Logo'
import UserAvatar from './navbar components/UserAvatar'
import UserNotifications from './navbar components/UserNotifications'

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
                    <div className='flex gap-5'>
                        <UserNotifications />
                        <UserAvatar functions={functions} />
                    </div>
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