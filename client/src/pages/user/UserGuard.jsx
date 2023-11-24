import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { useSession } from './../../components/context-hooks/session/SessionUtils'

UserGuard.propTypes = {
  element: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  softlock: PropTypes.bool
}
function UserGuard({ element, softlock }) {
  const userData = useSession()
  const type = userData ? userData.typeID : 0
  let nav

  if (type == 0 || (type > 3 && !softlock)) {
    switch (type) {
      case 0:
        nav = "/catalog"
        break
      case 4:
        nav = "/dashboard"
        break
      case 5:
        nav = "/admindash"
        break
    }

    return (<Navigate to={nav} />)
  }

  return element
}

export default UserGuard