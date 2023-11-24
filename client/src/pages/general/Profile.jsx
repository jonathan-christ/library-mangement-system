"use client";

import UpdateUserForm from '../../components/forms/update/UpdateUserForm'
import { useSession } from '../../components/context-hooks/session/SessionUtils'
import UpdatePasswordForm from '../../components/forms/update/UpdatePasswordForm'

function Profile() {
    const session = useSession()
    return (
        <>
            <UpdateUserForm user={session} profile />
            <UpdatePasswordForm />
        </>
    )
}

export default Profile