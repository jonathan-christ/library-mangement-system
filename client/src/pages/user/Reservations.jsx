import { useSession } from '../../components/context-hooks/session/SessionUtils'
import TicketTable from '../../components/forms/view/tickets/TicketTable'

function Reservations() {
  const user = useSession()
  return (
    <>
      <div>

      </div>
      <TicketTable userID={user.id} />
    </>
  )
}

export default Reservations