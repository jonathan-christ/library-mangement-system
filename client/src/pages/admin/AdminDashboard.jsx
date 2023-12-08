import axios from "axios"
import { useEffect, useState } from "react"
import MonthlyBorrowing from "../../components/graphs/MonthlyBorrowing"
import CountDiv from "../../components/misc/CountDiv"
import TicketCountPie from "../../components/graphs/TicketCountRatio"
import TableLayout from "../../components/forms/view/table/TableLayout"

import { Modal } from "flowbite-react"
import { ImBooks } from "react-icons/im";
import { FaUsers } from "react-icons/fa";

function AdminDashboard() {
  const [showModal, setShow] = useState(false)
  const [modalData, setModalData] = useState([])
  const [modalColumns, setModalCols] = useState([])

  const [data, setData] = useState([])
  const [dataT, setDataT] = useState([])
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
      setDataT(temp.data)
      setTCount({
        "queued": temp.data[0].count,
        "borrowed": temp.data[1].count,
        "closed": temp.data[2].count,
        "overdue": temp.data[3].count,
        "reserved": temp.data[4].count,
        "cancelled": temp.data[5].count,
        "total": temp.data[0].totalCount
      })
    } catch (error) {
      console.log(error)
    }
  }

  const modalShowHandler = (show, mode) => {
    setModalCols((mode=='tcr')? tcrCol : mbtCol)
    setModalData((mode=='tcr')? dataT : data)

    setShow(show)
    console.log(modalData)
    console.log(modalColumns)
  }

  const tcrCol = [
    { header: 'Ticket Status', accessorKey: 'status' },
    { header: 'Count', accessorKey: 'count' },
  ]

  const mbtCol = [
    {header: 'Months', accessorKey: 'month'},
    {header: 'Ticket Count', accessorKey: 'bookings'}
  ]



  return (
    <>
      <Modal show={showModal} onClose={() => setShow(false)} size='lg'>
        <Modal.Header>TABULAR DATA</Modal.Header>
        <Modal.Body className='p-5 flex'>
          <TableLayout data={modalData} columns={modalColumns} />
        </Modal.Body>
      </Modal>
      <div className="flex flex-col p-10 gap-10 w-full">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row gap-10 w-full h-max">
            <MonthlyBorrowing data={data} showTable={modalShowHandler} />
            <TicketCountPie {...ticket} showTable={modalShowHandler} />
          </div>
          <div className="flex flex-row gap-10">
            <CountDiv subject={'TOTAL USERS'} count={userCount} icon={<FaUsers size={50} className='text-text-600' />} />
            <CountDiv subject={'TOTAL BOOKS'} count={bookCount} icon={<ImBooks size={50} className='text-text-600' />} />
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard