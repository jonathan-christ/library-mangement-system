import UpdateUserForm from '../../components/forms/update/UpdateUserForm'
import { useSession } from '../../components/context-hooks/session/SessionUtils' 

function Profile() {
    const session = useSession()
    return (
        <UpdateUserForm user={session} profile />
    )
}

export default Profile