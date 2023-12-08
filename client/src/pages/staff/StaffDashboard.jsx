import axios from "axios"
import RadarChart from "../../components/graphs/PopularSubjects"
import { useState, useEffect } from "react"
import TableLayout from "../../components/forms/view/table/TableLayout"

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

  const cols = [
    {header: 'Subject', accessorKey: 'Subject'},
    {header: 'Teacher Count', accessorKey: 'Teachers'},
    {header: 'Student Count', accessorKey: 'Students'},
  ]

  return (
    <div className="flex flex-row p-5 gap-5 w-full">
      <RadarChart data={data} />
      <TableLayout data={data} columns={cols}/>
    </div>
  )
}

export default StaffDashboard