import React from 'react'
import ls from 'localstorage-slim'
import { Navigate } from 'react-router-dom'

function UserGuard({ element, softlock }) {
  const userData = JSON.parse(ls.get('userData', { decrypt: true }))
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