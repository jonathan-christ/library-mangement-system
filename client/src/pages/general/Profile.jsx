import React from 'react'
import UpdateUserForm from '../../components/forms/update/UpdateUserForm'
import { useOutletContext } from 'react-router-dom'
import { getSession, updateSession } from '../../components/SessionContext' 

function Profile() {
    const session = getSession()
    const setSession = updateSession()
    return (
        <UpdateUserForm user={session} profile />
    )
}

export default Profile