"use client";

import axios from 'axios'
import PropTypes from 'prop-types'

import { Button, Modal, Badge } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { MdEdit, MdDelete } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"
import { toast } from 'react-toastify'

import AddBookCopyForm from '../../add/AddBookCopyForm'
import UpdateBookCopy from '../../update/UpdateBookCopyForm'
import TableLayout from '../table/TableLayout'

CopyTable.propTypes = {
  bookID: PropTypes.number,
  getHasCopies: PropTypes.func,
  user: PropTypes.bool
}
function CopyTable({ bookID, getHasCopies, user }) {
    const [refresh, setRefresh] = useState(true)

    const [copies, setCopies] = useState([])

    const [deleteShow, setDeleteShow] = useState(false)
    const [addShow, setAddShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const [modalData, setModalData] = useState({})

    useEffect(() => {
        getCopies()
        setRefresh(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh])

    const getCopies = () => {
        axios.post("/api/copies/", bookID ? { bookID: bookID } : null)
            .then((res) => {
                setCopies(res.data)
                getHasCopies ? getHasCopies(res.data.length != 0 ? true : false) : ''
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve book copies! Server Error')
            })
    }

    const deleteCopy = (id) => {
        axios.post("api/copies/delete", { id: id })
            .then(() => {
                setRefresh(true)
                toast.success('Book copy has been deleted!')
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to delete book copy! Server Error')
            })
    }

    const callUpdate = (data) => {
        setModalData(data)
        setUpdateShow(true)
    }

    const callDelete = (data) => {
        setModalData(data)
        setDeleteShow(true)
    }

    const statusText = (stat) => {
        let condition = stat === 'good';
        return (
            <Badge
                color={condition ? 'info' : 'failure'}
                size="sm"
                className={"flex justify-center " + (condition ? "bg-teal-200" : "bg-red-200")}
            >
                {condition ? "Good" : "Lost"}
            </Badge>
        )
    }

    const availText = (avail) => {
        let condition = avail === 'yes';
        return (
            <Badge
                color={condition ? 'info' : 'failure'}
                size="sm"
                className={"flex justify-center " + (condition ? "bg-teal-200" : "bg-red-200")}
            >
                {condition ? "Available" : "Unavailable"}
            </Badge>
        )
    }

    const columns = [
        { header: 'Book', accessorFn: row => row.book.title },
        { header: 'Call Number', accessorKey: 'callNumber' },
        { header: 'Status', accessorKey: 'status', cell: row => statusText(row.getValue()) },
        { header: 'Availability', accessorKey: 'available', cell: row => availText(row.getValue()) },
    ]

    bookID ?? columns.push(
        {
            header: 'Actions', accessorKey: '', cell: row => {
                return (
                    <div className='flex flex-row gap-2 justify-center'>
                        <button className='text-orange-400 hover:text-orange-400 hover:bg-background-100 rounded-lg p-1' onClick={() => { callUpdate(row.row.original) }}>
                            <MdEdit size={20} />
                        </button>
                        <button className='text-orange-400 hover:text-orange-400 hover:bg-background-100 rounded-lg p-1' onClick={() => { callDelete(row.row.original) }}>
                            <MdDelete size={20} color='red' />
                        </button>
                    </div>
                )
            }
        }
    )

    return (
        <div className='w-full'>
            {/* MODALS */}
            {!bookID &&
                <>
                    <Modal show={addShow} onClose={() => setAddShow(false)} size='lg'>
                        <Modal.Header>ADD COPY</Modal.Header>
                        <Modal.Body className='p-5'>
                            <AddBookCopyForm refreshDependency={setRefresh} />
                        </Modal.Body>
                    </Modal>
                    <Modal show={updateShow} onClose={() => setUpdateShow(false)}>
                        <Modal.Header>UPDATE COPY</Modal.Header>
                        <Modal.Body className='p-5'>
                            <UpdateBookCopy copy={modalData} refreshDependency={setRefresh} />
                        </Modal.Body>
                    </Modal>
                    <Modal show={deleteShow} size="sm" onClose={() => setDeleteShow(false)}>
                        <Modal.Body className='flex flex-col p-5 justify-center'>
                            <RiErrorWarningFill className="mx-auto mb-4 h-20 w-20 text-red-600" />
                            <h3 className="mb-5 flex justify-center text-center text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete {modalData.callNumber ?? modalData.id}?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" onClick={() => {
                                    deleteCopy(modalData.id)
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
                </>
            }

            <TableLayout columns={columns} data={copies} addShow={user ? null : setAddShow}/>
        </div>
    )
}

export default CopyTable