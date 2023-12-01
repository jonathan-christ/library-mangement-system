import { useSession } from "../../components/context-hooks/session/SessionUtils"
import FineTable from "../../components/forms/view/fines/FineTable"

function UserFines() {
  const user = useSession()
  return (
    <FineTable userID={user.id}/>
  )
}

export default UserFines