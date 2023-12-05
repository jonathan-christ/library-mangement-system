import PropTypes from "prop-types"
import { Dropdown, Avatar } from "flowbite-react"

import { useSession } from "../../context-hooks/session/SessionUtils"

function UserAvatar({ functions }) {
    const session = useSession()
    return (
        <Dropdown
            arrowIcon={false}
            inline
            label={
                <div className='flex gap-2'>
                    <span className="self-center truncate text-xs text-text-800 font-medium">
                        [<span className="text-primary-900">{functions.translateUserType(session.typeID)}</span>]
                    </span>
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
    )
}

UserAvatar.propTypes = {
    functions: PropTypes.shape({
        getInitials: PropTypes.func,
        navigate: PropTypes.func,
        signOut: PropTypes.func,
        translateUserType: PropTypes.func
    })
}

export default UserAvatar