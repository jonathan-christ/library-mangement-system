import PropTypes from 'prop-types'
import { useLocation, useLinkClickHandler } from 'react-router-dom'
import { Navbar } from "flowbite-react"

NavigationLink.propTypes = {
    to: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
}
function NavigationLink({ to, label }) {
    const location = useLocation();
    const clickHandler = useLinkClickHandler(to);

    return (
        <span onClick={clickHandler}>
            <Navbar.Link href={to} active={location.pathname === to}>
                {label}
            </Navbar.Link>
        </span>
    )
}

export default NavigationLink
