"use client";

import axios from 'axios'

import { Table, Button, Modal } from 'flowbite-react'
import { useState, useEffect, useMemo } from 'react'
import { MdEdit, MdDelete } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"

import { toast } from 'react-toastify'
import AddFineCategForm from '../../add/AddFineCategForm'
import UpdateFineCategForm from '../../update/UpdateFineCategForm'

function FineCategTable() {
    const [refresh, setRefresh] = useState(true)

    const [fineCategs, setFineCategs] = useState([])

    const [deleteShow, setDeleteShow] = useState(false)
    const [addShow, setAddShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const [modalData, setModalData] = useState({})


    useEffect(() => {
        getFineCategs()
        setRefresh(false)
    }, [refresh])

    const getFineCategs = () => {
        axios.get("api/finecategs/")
            .then((res) => {
                setFineCategs(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve fine categories! Server Error')
            })
    }

    const deleteFineCategs = (id) => {
        axios.post("api/finecategs/delete", { id: id })
            .then(() => {
                setRefresh(true)
                toast.success('Fine category has been deleted!')
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to delete fine category! Server Error')
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

    const capitalizeFirst = (string) => {
        return string[0].toUpperCase() + string.slice(1)
    }

    const categCells = useMemo(() =>
        fineCategs.map((category, idx) => {
            return (
                <Table.Row key={idx} className={"hover:bg-slate-200 border h-full truncate " + ((idx % 2 == 0) ? "" : "bg-gray-200")}>
                    <Table.Cell>{category.name}</Table.Cell>
                    <Table.Cell>₱{category.amount}</Table.Cell>
                    <Table.Cell>{capitalizeFirst(category.frequency)}</Table.Cell>
                    <Table.Cell>
                        <Button.Group>
                            <Button color='warning' size='sm' onClick={() => { callUpdate(category) }}>
                                <MdEdit size={20} />
                            </Button>
                            <Button color='failure' size='sm' onClick={() => { callDelete(category) }}>
                                <MdDelete size={20} />
                            </Button>
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>
            )
        })
        , [fineCategs])


    return (
        <div>
            {/* MODALS */}
            <Modal show={addShow} onClose={() => setAddShow(false)}>
                <Modal.Header>ADD FINE CATEGORY</Modal.Header>
                <Modal.Body className='p-5'>
                    <AddFineCategForm refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={updateShow} onClose={() => setUpdateShow(false)}>
                <Modal.Header>UPDATE FINE CATEGORY</Modal.Header>
                <Modal.Body className='p-5'>
                    <UpdateFineCategForm fineCateg={modalData} refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={deleteShow} size="sm" onClose={() => setDeleteShow(false)}>
                <Modal.Body className='flex flex-col p-5 justify-center'>
                    <RiErrorWarningFill className="mx-auto mb-4 h-20 w-20 text-red-600" />
                    <h3 className="mb-5 flex justify-center text-center text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete {modalData.name}?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={() => {
                            deleteFineCategs(modalData.id)
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

            <div className="p-10">
                <Button color='info' size="xl" onClick={() => setAddShow(1)}>Add Fine Category</Button>
                <Table className='bg-white shadow-lg w-max'>
                    <Table.Head className='shadow-lg text-md text-black'>
                        <Table.HeadCell className='p-5'>Name</Table.HeadCell>
                        <Table.HeadCell className='p-5'>Amount</Table.HeadCell>
                        <Table.HeadCell className='p-5'>Frequency</Table.HeadCell>
                        <Table.HeadCell className=' p-5 text-center'>Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="gap-1">
                        {categCells}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

export default FineCategTable