import React from 'react'
import ls from 'localstorage-slim'
import { Navigate } from 'react-router-dom'

function UserGuard({ element }) {
  const userData = JSON.parse(ls.get('userData', { decrypt: true }))
  const type = userData ? userData.typeID : 1

  if (type > 3) {
    return (<Navigate to={type == 4 ? "/dashboard" : "/admindash"} />)
  }

  return element
}

export default UserGuard