import axios from "axios"
import { useEffect, useState } from "react"
import MonthlyBorrowing from "../../components/graphs/MonthlyBorrowing"
import CountDiv from "../../components/misc/CountDiv"
import UserTable from "../../components/forms/view/user-table/UserTable"
import BookTable from "../../components/forms/view/books/BookTable"
import TicketCountPie from "../../components/graphs/TicketCountRatio"

import { ImBooks } from "react-icons/im";
import { FaUsers } from "react-icons/fa";

function AdminDashboard() {
  const [data, setData] = useState([])
  const [ticket, setTCount] = useState({})
  const [userCount, setUCount] = useState(0)
  const [bookCount, setBCount] = useState(0)

  useEffect(() => {
    getData()
    getUserCount()
    getBookCount()
    getTicketCounts()
  }, [])

  const getData = async () => {
    try {
      const temp = await axios.get("/api/library/graphs/monthly-ticket-issues")
      console.log(temp.data)
      setData(temp.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getUserCount = async () => {
    try {
      const temp = await axios.get("/api/users/count")
      setUCount(temp.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getBookCount = async () => {
    try {
      const temp = await axios.get("/api/books/count")
      setBCount(temp.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getTicketCounts = async () => {
    try {
      const temp = await axios.get("/api/transactions/tickets/count")
      setTCount(temp.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col p-10 gap-10 w-full">
      <div className="flex flex-col md:flex-row gap-10 w-full">
        <MonthlyBorrowing data={data} />
        <div className="flex flex-col justify-between md:gap-0 gap-10">
          <TicketCountPie {...ticket} />
          <div className="flex flex-row gap-5 justify-center">
            <CountDiv subject={'TOTAL USERS'} count={userCount} icon={<FaUsers size={50} className='text-text-600' />} />
            <CountDiv subject={'TOTAL BOOKS'} count={bookCount} icon={<ImBooks size={50} className='text-text-600' />} />
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <UserTable />
        <BookTable />
      </div>
    </div>
  )
}

export default AdminDashboard