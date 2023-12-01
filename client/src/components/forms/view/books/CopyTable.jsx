"use client";

import axios from 'axios'
import PropTypes from 'prop-types'

import { Table, Button, Modal, Badge } from 'flowbite-react'
import { useState, useEffect, useMemo } from 'react'
import { MdEdit, MdDelete } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"

import StatusHandler from '../../../misc/StatusHandler'
import AddBookCopyForm from '../../add/AddBookCopyForm'
import UpdateBookCopy from '../../update/UpdateBookCopyForm'


CopyTable.propTypes = {
    bookID: PropTypes.number,
    setExists: PropTypes.func
}
function CopyTable({ bookID, setExists }) {
    const [refresh, setRefresh] = useState(true)

    const [copies, setCopies] = useState([])
    const [action, setAction] = useState("retrieved")
    const [status, setStatus] = useState(0)

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
                setExists ? setExists(res.data.length ? true : false) : ''
                console.log(res.data.length ? true : false)
            }).catch((err) => {
                console.log(err)
                setStatus(500)
            })
    }

    const deleteCopy = (id) => {
        axios.post("api/copies/delete", { id: id })
            .then(() => {
                setRefresh(true)
                setAction("deleted")
                setStatus(200)
            }).catch((err) => {
                console.log(err)
                setStatus(500)
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
                size="x9l"
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
                size="x9l"
                className={"flex justify-center " + (condition ? "bg-teal-200" : "bg-red-200")}
            >
                {condition ? "Available" : "Unavailable"}
            </Badge>
        )
    }

    const copyCells = useMemo(() =>
        copies.map((copy, idx) => {
            return (
                <Table.Row key={idx} className={"hover:bg-slate-200 border h-full truncate " + ((idx % 2 == 0) ? "" : "bg-gray-200")}>
                    <Table.Cell>{copy.book?.title ?? copy.bookID}</Table.Cell>
                    <Table.Cell>{copy.callNumber ?? copy.id}</Table.Cell>
                    <Table.Cell>{statusText(copy.status)}</Table.Cell>
                    <Table.Cell>{availText(copy.available)}</Table.Cell>
                    {!bookID &&
                        <Table.Cell>
                            <Button.Group>
                                <Button color='warning' size='sm' onClick={() => { callUpdate(copy) }}>
                                    <MdEdit size={20} />
                                </Button>
                                <Button color='failure' size='sm' onClick={() => { callDelete(copy) }}>
                                    <MdDelete size={20} />
                                </Button>
                            </Button.Group>
                        </Table.Cell>
                    }
                </Table.Row>
            )
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [copies])


    return (
        <div>
            {/* MODALS */}
            {!bookID &&
                <>
                    <Modal show={addShow} onClose={() => setAddShow(false)}>
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
            <StatusHandler subject={"Copy/s"} action={action} code={status} dismiss={setStatus} />
            <div className="p-10 flex flex-col justify-center">
                {!bookID &&
                    <Button color='info' size="xl" onClick={() => setAddShow(1)}>Add Copy</Button>
                }
                <Table className='bg-white shadow-lg w-max justify-center'>
                    <Table.Head className='shadow-lg text-md text-black'>
                        <Table.HeadCell className='p-5'>Book</Table.HeadCell>
                        <Table.HeadCell className='p-5'>Call Number</Table.HeadCell>
                        <Table.HeadCell className='p-5'>Status</Table.HeadCell>
                        <Table.HeadCell className='p-5'>Availability</Table.HeadCell>
                        {!bookID &&
                            <Table.HeadCell className=' p-5 text-center'>Action</Table.HeadCell>
                        }
                    </Table.Head>
                    <Table.Body className="gap-1">
                        {copyCells}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

export default CopyTable