import PropTypes from 'prop-types'
import { useLocation, useLinkClickHandler } from 'react-router-dom'
import { Sidebar } from 'flowbite-react'

SidebarLink.propTypes = {
    to: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.node
}
function SidebarLink({ to, label, icon }) {
    const location = useLocation();
    const clickHandler = useLinkClickHandler(to);

    return (
        <span onClick={clickHandler}>
            <Sidebar.Item href={to} active={location.pathname === to} icon={icon}>
                {label}
            </Sidebar.Item>
        </span>
    )
}

export default SidebarLink
