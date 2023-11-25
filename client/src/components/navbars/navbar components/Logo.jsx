import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ViteLogo from '../../../assets/vite.svg'


Logo.propTypes = {
    to: PropTypes.string.isRequired
}
function Logo({ to }) {
    return (
        <Link to={to} className='flex flex-row align-middle'>
            <img src={ViteLogo} className="mr-3 h-6 sm:h-9" alt="PSHS-ZRC Logo" />
            <span className="self-center whitespace-nowrap text-xl font-semibold">ISCP LMS</span>
        </Link>
    )
}

export default Logo