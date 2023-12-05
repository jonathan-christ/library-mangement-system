import axios from "axios"
import RadarChart from "../../components/graphs/PopularSubjects"
import { useState, useEffect } from "react"
import TicketTable from "../../components/forms/view/tickets/TicketTable"
import FineTable from "../../components/forms/view/fines/FineTable"

function StaffDashboard() {
  const [data, setData] = useState([])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const temp = await axios.get("/api/library/graphs/popular-subject-users")
      setData(temp.data)
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div className="flex flex-row p-10 ">
      <RadarChart data={data} />
      <div className="flex flex-col">
        <TicketTable staff />
        <FineTable staff />
      </div>
    </div>
  )
}

export default StaffDashboard