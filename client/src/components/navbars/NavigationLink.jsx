import PropTypes from 'prop-types'
import { Link, useMatch } from 'react-router-dom'

NavigationLink.propTypes = {
    to: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
}
function NavigationLink({ to, label }) {
    const match = useMatch(to);

    return (
        <Link to={to} className={match ? 'text-blue-600' : ''}>
            <span className="text-base">{label}</span>
        </Link>
    )
}

export default NavigationLink
