import PropTypes from "prop-types"
"use client";

import axios from 'axios'

import { Button, Badge, Modal } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { RiErrorWarningFill } from "react-icons/ri"

import { toast } from 'react-toastify'
import AddTicketForm from '../../add/AddTicketForm'
import TableLayout from "../table/TableLayout";
import UsersTicketTab from "../../../tabs/UsersTicketTab";


function TicketTable({ userID }) {
    const [refresh, setRefresh] = useState(true)

    const [tickets, setTickets] = useState([])

    const [addShow, setAddShow] = useState(false)
    const [updateShow, setPromptShow] = useState(false)
    const [modalData, setModalData] = useState({})

    const borrowable = { 'reserved': true }
    const closeable = { 'borrowed': true, 'overdue': true }
    const cancellable = { 'queued': true, 'reserved': true }

    const [borrowed, setBorrowed] = useState([]);
    const [reserved, setReserved] = useState([])
    const [others, setOthers] = useState([])
    const [overdue, setOverdue] = useState([])

    const borrowPeriod = {
        "GENERAL": 14,
        "RESERVED": 1,
        "FILIPINIANA": 14
    }

    useEffect(() => {
        getTickets()
        setRefresh(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh])

    const getTickets = async () => {
        try {
            const response = await axios.post("api/transactions/tickets", userID ? { userID: userID } : '');
            const fetchedTickets = response.data;
            setTickets(fetchedTickets);
            if (userID) {
                setBorrowed(fetchedTickets.filter(ticket => ['borrowed'].includes(ticket.status)));
                setReserved(fetchedTickets.filter(ticket => ticket.status === 'reserved'))
                setOverdue(fetchedTickets.filter(ticket => ticket.status === 'overdue'))
                setOthers(fetchedTickets.filter(ticket => !['borrowed', 'reserved', 'overdue'].includes(ticket.status)));
            }
        } catch (err) {
            console.log(err);
            toast.error('Unable to retrieve tickets! Server Error');
        }
    };

    const updateTicket = (id, status) => {
        let data = { id: id, status: status }
        axios.put("api/transactions/tickets/update", data)
            .then(() => {
                setRefresh(true)
                toast.success('Ticket has been updated!')
            })
    }

    const callUpdate = (data, status) => {
        data.status = status
        setModalData(data)
        setPromptShow(true)
    }

    const getStatus = (status) => ({
        'queued': <Badge color="gray" size="sm" className="flex justify-center bg-gray-300">Queued</Badge>,
        'reserved': <Badge color="yellow" size="sm" className="flex justify-center">Reserved</Badge>,
        'borrowed': <Badge color="info" size="sm" className="flex justify-center">Borrowed</Badge>,
        'closed': <Badge color="success" size="sm" className="flex justify-center bg-green-200">Closed</Badge>,
        'overdue': <Badge color="failure" size="sm" className="flex justify-center bg-red-200 text-red-700">Overdue</Badge>,
        'cancelled': <Badge color="pink" size="sm" className="flex justify-center bg-red-200 text-red-600">Cancelled</Badge>,
    }[status])

    const columns = [
        { id: 'book', header: 'Book', accessorKey: 'book.title' },
        {
            id: 'callnum',
            header: 'Call Number',
            accessorKey: 'bookCopy',
            meta: {
                align: 'center'
            },
            cell: row => row.getValue() ? row.getValue().callNumber : 'TBA'
        },
        {
            id: 'due',
            header: 'Due',
            meta: {
                align: 'center'
            },
            accessorFn: row => {
                let data = row
                let closed = data.status === 'closed' || data.status === 'cancelled'
                if (data.lendDate === null || data.lendDate === undefined) {
                    return closed ? '-' : 'TBA'
                }
                const currMilli = ((new Date()) - (new Date(data.lendDate)))
                const diff = borrowPeriod[data.book.classification.name.toUpperCase()] - Math.floor(currMilli / (1000 * 60 * 60 * 24))
                return closed ? '-' : `${diff < 0 ? 'Overdue ' + diff * -1 : diff} ${Math.abs(diff) != 1 ? 'days' : 'day'}`
            }
        },
        {
            id: 'status',
            header: 'Status',
            accessorKey: 'status',
            cell: row => getStatus(row.getValue())
        },
    ]

    const overdueCols = [
        ...columns.slice(0, 3),
        {
            header: 'Due Fine',
            accessorFn: row => {
                const amount = dateDiff(row.lendDate, new Date(), row.fine.fineCategory.frequency) * row.fine.fineCategory.amount
                return `₱${amount.toFixed(2)}`
            },
            meta: {
                'align':'center'
            }
        },
        ...columns.slice(3)
    ]

    const dateDiff = (lendDate, currDate, rate) => {
        lendDate = new Date(lendDate)
        let now = new Date(currDate)
        let cancel = {
            'hourly': 24,
            'daily': 1,
            'fixed': 0
        }

        return lendDate > now ? 0 : Math.floor((now - lendDate) / (1000 * 60 * 60 * 24 / cancel[rate]))
    }

    if (!userID) {
        columns.push(
            {
                id: 'actions',
                header: 'Actions',
                accessorKey: 'status',
                cell: row => {
                    return (
                        <div className="relative flex flex-row gap-2 justify-center">
                            {!userID ? (
                                <>
                                    <button
                                        className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center disabled:hidden"
                                        onClick={() => { callUpdate(row.row.original, 'borrowed') }}
                                        disabled={!borrowable[row.getValue()]}
                                    >
                                        Borrow
                                    </button>
                                    <button
                                        className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center disabled:hidden"
                                        onClick={() => { callUpdate(row.row.original, 'closed') }}
                                        disabled={!closeable[row.getValue()]}
                                    >
                                        Close
                                    </button>
                                </>
                            ) : null}
                            <button
                                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center disabled:hidden"
                                onClick={() => { callUpdate(row.row.original, 'cancelled') }}
                                disabled={!cancellable[row.getValue()]}
                            >
                                Cancel
                            </button>
                        </div>
                    )
                }
            }
        )
        columns.unshift(
            { id: 'owner', header: 'Owner', accessorKey: 'user.userName' },
        )
    }

    return (
        <div className="">
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

            {userID && tickets ?
                <div className="p-10">
                    <UsersTicketTab
                        counts={{
                            borrowed: borrowed.length,
                            reserved: reserved.length,
                            others: others.length,
                            overdue: overdue.length
                        }}
                        borrowed={<TableLayout data={borrowed} columns={columns} />}
                        reserved={<TableLayout data={reserved} columns={columns} />}
                        others={<TableLayout data={others} columns={columns} />}
                        overdue={<TableLayout data={overdue} columns={overdueCols} />}
                    />
                </div>
                :
                <TableLayout data={tickets} columns={columns} addShow={setAddShow} />
            }

        </div >
    )
}

TicketTable.propTypes = {
    userID: PropTypes.number
}

export default TicketTable