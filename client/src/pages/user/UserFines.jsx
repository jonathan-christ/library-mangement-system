import { useSession } from "../../components/context-hooks/session/SessionUtils"
import FineTable from "../../components/forms/view/fines/FineTable"

function UserFines() {
  const user = useSession()
  return (
    <div className="p-5">
      <FineTable userID={user.id}/>
    </div>
  )
}

export default UserFines