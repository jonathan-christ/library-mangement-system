import React from 'react'
import ls from 'localstorage-slim'
import { Navigate } from 'react-router-dom'

function StaffGuard({ element }) {
    const userData = JSON.parse(ls.get('userData', { decrypt: true }))
    const type = userData ? userData.typeID : 1

    if (type != 4) {
        return (<Navigate to={type == 5 ? "/admindash" : "/home"} />)
    }

    return element
}

export default StaffGuard