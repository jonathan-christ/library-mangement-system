import PropTypes from 'prop-types'
import ls from 'localstorage-slim'
import { Navigate } from 'react-router-dom'

StaffGuard.propTypes = {
    element: PropTypes.node
}
function StaffGuard({ element }) {
    const userData = JSON.parse(ls.get('userData', { decrypt: true }))
    const type = userData ? userData.typeID : 1

    if (type != 4) {
        return (<Navigate to={type == 5 ? "/admindash" : "/catalog"} />)
    }

    return element
}

export default StaffGuard