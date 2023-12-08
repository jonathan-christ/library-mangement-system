import PropTypes from "prop-types"
"use client";

import axios from 'axios'

import { Button, Badge, Modal } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { RiErrorWarningFill } from "react-icons/ri"

import { toast } from 'react-toastify'
import AddFineForm from '../../add/AddFineForm'
import TableLayout from "../table/TableLayout";
import { MdDelete } from "react-icons/md";

function FineTable({ userID, staff }) {
    const [refresh, setRefresh] = useState(true)

    const [fines, setFines] = useState([])

    const [addShow, setAddShow] = useState(false)
    const [updateShow, setPromptShow] = useState(false)
    const [deleteShow, setDeleteShow] = useState(false)
    const [modalData, setModalData] = useState({})

    useEffect(() => {
        getFines()
        setRefresh(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh])

    const getFines = async () => {
        await axios.post("api/fines", userID ? { userID: userID } : null)
            .then((res) => {
                setFines(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve fines! Server Error')
            })
    }

    const updateFine = async (id, status, date) => {
        let data = { id: id, status: status, payDate: date }
        console.log(data)
        await axios.put("api/fines/update", data)
            .then(() => {
                setRefresh(true)
                toast.success('Fine has been updated!')
            })
    }

    const deleteFine = async (id) => {
        await axios.post("api/fines/delete", { id: id })
            .then(() => {
                setRefresh(true)
                toast.success('Fine has been deleted!')
            })
    }

    const callUpdate = (data, status, date) => {
        data.status = status
        data.payDate = date
        setModalData(data)
        setPromptShow(true)
    }

    const callDelete = (data) => {
        setModalData(data)
        setDeleteShow(true)
    }

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

    const getStatus = (status) => ({
        'paid': <Badge color="success" size="sm" className="flex justify-center bg-green-200">Paid</Badge>,
        'unpaid': <Badge color="failure" size="sm" className="flex justify-center bg-red-200 text-red-700">Unpaid</Badge>,
    }[status])


    const cols = [
        {
            header: 'Owner',
            accessorFn: row => {
                const user = row.ticket.user
                return (
                    `${user.firstName}  ${user.lastName}`
                )
            }
        },
        {
            header: 'Category', accessorKey: 'fineCategory.name',
            meta: {
                'align': 'center'
            }
        },
        {
            header: 'Amount to Pay',
            accessorFn: row => {
                const fine = row
                const amount = dateDiff(fine.ticket.lendDate, fine.payDate ?? new Date(), fine.fineCategory.frequency) * fine.fineCategory.amount
                return `₱${amount.toFixed(2)}`
            },
            meta: {
                'align': 'center'
            }
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: row => getStatus(row.getValue())
        }
    ]

    if (userID) {
        cols.shift()
    } else {
        cols.push(
            {
                header: 'Actions',
                accesorKey: '',
                cell: row => {
                    const fine = row.row.original
                    return (
                        <div className="flex flex-row justify-center gap-2">
                            <Button className='disabled:hidden' color='success' size='xs' onClick={() => { callUpdate(fine, 'paid', new Date()) }} disabled={fine.status === 'paid'}>
                                Paid
                            </Button>
                            {staff ??
                                <>
                                    <Button className="disabled:hidden" color='failure' size='xs' onClick={() => { callUpdate(fine, 'unpaid') }} disabled={fine.status === 'unpaid'}>
                                        Unpaid
                                    </Button>
                                    <button className='text-orange-400 hover:text-orange-400 hover:bg-background-100 rounded-lg p-1' onClick={() => { callDelete(fine) }}>
                                        <MdDelete size={20} color='red' />
                                    </button>
                                </>
                            }
                        </div>
                    )
                }
            }
        )
    }

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
                            updateFine(modalData.id, modalData.status, modalData.payDate)
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
                            deleteFine(modalData.id)
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

            <TableLayout data={fines} columns={cols} addShow={!(userID || staff) ? setAddShow : null} />
        </div>
    )
}

FineTable.propTypes = {
    userID: PropTypes.number,
    staff: PropTypes.bool
}

export default FineTable