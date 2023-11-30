"use client";

import axios from 'axios'

import { Table, Button, Badge, Modal } from 'flowbite-react'
import { useState, useEffect, useMemo } from 'react'
import { RiErrorWarningFill } from "react-icons/ri"

import StatusHandler from '../../../misc/StatusHandler'
import AddFineForm from '../../add/AddFineForm'

function FineTable() {
    const [refresh, setRefresh] = useState(true)

    const [fines, setFines] = useState([])
    const [action, setAction] = useState("retrieved")
    const [status, setStatus] = useState(0)

    const [addShow, setAddShow] = useState(false)
    const [updateShow, setPromptShow] = useState(false)
    const [deleteShow, setDeleteShow] = useState(false)
    const [modalData, setModalData] = useState({})

    useEffect(() => {
        getTickets()
        setRefresh(false)
    }, [refresh])

    const getTickets = async () => {
        await axios.get("api/fines")
            .then((res) => {
                setFines(res.data)
            }).catch((err) => {
                console.log(err)
                setStatus(500)
            })
    }

    const updateTicket = async (id, status) => {
        let data = { id: id, status: status }
        await axios.put("api/fines/update", data)
            .then(() => {
                setRefresh(true)
                setAction("Updated")
                setStatus(200)
            })
    }

    const deleteTicket = async (id) => {
        await axios.post("api/fines/delete", { id: id })
            .then(() => {
                setRefresh(true)
                setAction("Deleted")
                setStatus(200)
            })
    }

    const callUpdate = (data, status) => {
        data.status = status
        setModalData(data)
        setPromptShow(true)
    }

    const callDelete = (data) => {
        data.status = status
        setModalData(data)
        setDeleteShow(true)
    }

    const dateDiff = (lendDate, rate) => {
        lendDate = new Date(lendDate)
        let now = new Date()
        let cancel = {
            'hourly': 24,
            'daily': 1,
            'fixed': 0
        }
        return lendDate > now ? 0 : Math.fround((now - lendDate) / (1000 * 60 * 60 * 24 / cancel[rate])).toFixed(2)
    }

    const getStatus = (status) => ({
        'paid': <Badge color="success" size="x9l" className="flex justify-center bg-green-200">Paid</Badge>,
        'unpaid': <Badge color="failure" size="x9l" className="flex justify-center bg-red-200 text-red-700">Unpaid</Badge>,
    }[status])

    const userCells = useMemo(() =>
        fines.map((fine, idx) => {
            return (
                <Table.Row key={idx} className={"hover:bg-slate-200 border h-full truncate " + ((idx % 2 == 0) ? "" : "bg-gray-100")}>
                    <Table.Cell className='mx-5'>{fine.ticket.uuid}</Table.Cell>
                    <Table.Cell>{fine.ticket.user.firstName + ' ' + fine.ticket.user.lastName}</Table.Cell>
                    <Table.Cell>{fine.fineCategory.name}</Table.Cell>
                    <Table.Cell>{fine.fineCategory.amount}</Table.Cell>
                    <Table.Cell>{fine.fineCategory.frequency}</Table.Cell>
                    <Table.Cell>{'₱' + dateDiff(fine.ticket.lendDate, fine.fineCategory.frequency) * fine.fineCategory.amount}</Table.Cell>
                    <Table.Cell>{getStatus(fine.status)}</Table.Cell>
                    <Table.Cell className='flex flex-col gap-2'>
                        <Button color='success' size='sm' onClick={() => { callUpdate(fine, 'paid') }} disabled={fine.status === 'paid'}>
                            Paid
                        </Button>
                        <Button color='failure' size='sm' onClick={() => { callUpdate(fine, 'unpaid') }} disabled={fine.status === 'unpaid'}>
                            Unpaid
                        </Button>
                        <Button color='failure' size='sm' onClick={() => { callDelete(fine) }} >
                            Delete
                        </Button>
                    </Table.Cell>
                </Table.Row>
            )
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [fines])


    return (
        <div>
            {/* MODALS */}
            <Modal show={addShow} onClose={() => setAddShow(false)}>
                <Modal.Header>ADD TICKET</Modal.Header>
                <Modal.Body className='p-5'>
                    <AddFineForm refreshDependency={setRefresh} />
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
            <Modal show={deleteShow} size="sm" onClose={() => setDeleteShow(false)}>
                <Modal.Body className='flex flex-col p-5 justify-center'>
                    <RiErrorWarningFill className="mx-auto mb-4 h-20 w-20 text-red-600" />
                    <h3 className="mb-5 flex justify-center text-center text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete {modalData.uuid}?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={() => {
                            deleteTicket(modalData.id)
                            setDeleteShow(false)
                        }}>
                            {"Yes, I'm sure"}
                        </Button>
                        <Button color="gray" onClick={() => setDeleteShow(false)}>
                            No, cancel
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <StatusHandler subject={"User/s"} action={action} code={status} dismiss={setStatus} />
            <div className="p-10">
                <Button color='info' size="xl" onClick={() => setAddShow(1)}>Add Fine</Button>
                <Table className='bg-white shadow-lg w-3/4'>
                    <Table.Head className='shadow-lg text-md text-black'>
                        <Table.HeadCell className='p-5'>UUID</Table.HeadCell>
                        <Table.HeadCell >Owner</Table.HeadCell>
                        <Table.HeadCell >Category</Table.HeadCell>
                        <Table.HeadCell >Amount</Table.HeadCell>
                        <Table.HeadCell >Rate</Table.HeadCell>
                        <Table.HeadCell >Current Cost</Table.HeadCell>
                        <Table.HeadCell className='text-center'>Status</Table.HeadCell>
                        <Table.HeadCell className=' p-5 text-center'>Set Status</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="gap-1">
                        {userCells}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

export default FineTable