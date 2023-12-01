import PropTypes from "prop-types"
"use client";

import axios from 'axios'

import { Table, Button, Badge, Modal } from 'flowbite-react'
import { useState, useEffect, useMemo } from 'react'
import { RiErrorWarningFill } from "react-icons/ri"

import StatusHandler from '../../../misc/StatusHandler'
import AddTicketForm from '../../add/AddTicketForm'

function TicketTable({ userID }) {
    const [refresh, setRefresh] = useState(true)

    const [tickets, setTickets] = useState([])
    const [action, setAction] = useState("retrieved")
    const [status, setStatus] = useState(0)

    const [addShow, setAddShow] = useState(false)
    const [updateShow, setPromptShow] = useState(false)
    const [modalData, setModalData] = useState({})

    const borrowable = { 'reserved': true }
    const closeable = { 'borrowed': true, 'overdue': true }
    const cancellable = { 'queued': true, 'reserved': true }

    useEffect(() => {
        getTickets()
        setRefresh(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh])

    const getTickets = () => {
        axios.post("api/transactions/tickets", userID ? { userID: userID } : '').then((res) => {
            setTickets(res.data)
        }).catch((err) => {
            console.log(err)
            setStatus(500)
        })
    }

    const updateTicket = (id, status) => {
        let data = { id: id, status: status }
        axios.put("api/transactions/tickets/update", data)
            .then(() => {
                setRefresh(true)
                setAction("Updated")
                setStatus(200)
            })
    }

    const callUpdate = (data, status) => {
        data.status = status
        setModalData(data)
        setPromptShow(true)
    }

    const getStatus = (status) => ({
        'queued': <Badge color="gray" size="x9l" className="flex justify-center bg-gray-300">Queued</Badge>,
        'reserved': <Badge color="yellow" size="x9l" className="flex justify-center">Reserved</Badge>,
        'borrowed': <Badge color="info" size="x9l" className="flex justify-center">Borrowed</Badge>,
        'closed': <Badge color="success" size="x9l" className="flex justify-center bg-green-200">Closed</Badge>,
        'overdue': <Badge color="failure" size="x9l" className="flex justify-center bg-red-200 text-red-700">Overdue</Badge>,
        'cancelled': <Badge color="pink" size="x9l" className="flex justify-center bg-red-200 text-red-600">Cancelled</Badge>,
    }[status])

    const userCells = useMemo(() =>
        tickets.map((ticket, idx) => {
            return (
                <Table.Row key={idx} className={"hover:bg-slate-200 border h-full truncate " + ((idx % 2 == 0) ? "" : "bg-gray-100")}>
                    <Table.Cell className='mx-5'>{ticket.uuid}</Table.Cell>
                    {!userID ?? <Table.Cell>{ticket.user.userName}</Table.Cell>}
                    <Table.Cell>{ticket.book.title}</Table.Cell>
                    <Table.Cell>{ticket.bookCopy?.callNumber ?? ''}</Table.Cell>
                    <Table.Cell>{ticket.createDate}</Table.Cell>
                    <Table.Cell>{ticket.returnDate ?? ''}</Table.Cell>
                    <Table.Cell>{getStatus(ticket.status)}</Table.Cell>
                    <Table.Cell className='flex flex-col gap-2'>
                        {!!userID ||
                            <>
                                <Button color='blue' size='sm' onClick={() => { callUpdate(ticket, 'borrowed') }} disabled={!borrowable[ticket.status]}>
                                    Borrow
                                </Button>
                                <Button color='success' size='sm' onClick={() => { callUpdate(ticket, 'closed') }} disabled={!closeable[ticket.status]}>
                                    Close
                                </Button>
                            </>
                        }
                        <Button color='failure' size='sm' onClick={() => { callUpdate(ticket, 'cancelled') }} disabled={!cancellable[ticket.status]}>
                            Cancel
                        </Button>
                    </Table.Cell>
                </Table.Row>
            )
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [tickets])


    return (
        <div>
            {/* MODALS */}
            <Modal show={addShow} onClose={() => setAddShow(false)}>
                <Modal.Header>ADD TICKET</Modal.Header>
                <Modal.Body className='p-5'>
                    <AddTicketForm refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={updateShow} size="sm" onClose={() => setPromptShow(false)}>
                <Modal.Body className='flex flex-col p-5 justify-center'>
                    <RiErrorWarningFill className="mx-auto mb-4 h-20 w-20 text-red-600" />
                    <h3 className="mb-5 flex justify-center text-center text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to update {modalData.uuid} to {modalData.status}?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={() => {
                            updateTicket(modalData.id, modalData.status)
                            setPromptShow(false)
                        }}>
                            {"Yes, I'm sure"}
                        </Button>
                        <Button color="gray" onClick={() => setPromptShow(false)}>
                            No, cancel
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <StatusHandler subject={"User/s"} action={action} code={status} dismiss={setStatus} />
            <div className="p-10">
                {!!userID || <Button color='info' size="xl" onClick={() => setAddShow(1)}>Add Ticket</Button>}
                <Table className='bg-white shadow-lg w-3/4'>
                    <Table.Head className='shadow-lg text-md text-black'>
                        <Table.HeadCell className='p-5'>UUID</Table.HeadCell>
                        {!userID ?? <Table.HeadCell >Owner</Table.HeadCell>}
                        <Table.HeadCell >Book</Table.HeadCell>
                        <Table.HeadCell >Call Number</Table.HeadCell>
                        <Table.HeadCell >Create Date</Table.HeadCell>
                        <Table.HeadCell >Return Date</Table.HeadCell>
                        <Table.HeadCell className='text-center'>Status</Table.HeadCell>
                        <Table.HeadCell className=' p-5 text-center'>Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="gap-1">
                        {userCells}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

TicketTable.propTypes = {
    userID: PropTypes.number
}

export default TicketTable