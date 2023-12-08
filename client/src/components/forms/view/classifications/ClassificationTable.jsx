"use client";

import axios from 'axios'

import { Button, Modal } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { MdEdit, MdDelete } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"

import { toast } from 'react-toastify'
import AddClassificationForm from '../../add/AddClassificationForm'
import UpdateClassForm from '../../update/UpdateClassificationForm'
import TableLayout from '../table/TableLayout';

function ClassTable() {
    const [refresh, setRefresh] = useState(true)

    const [classes, setClasses] = useState([])

    const [deleteShow, setDeleteShow] = useState(false)
    const [addShow, setAddShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const [modalData, setModalData] = useState({})


    useEffect(() => {
        getClasses()
        setRefresh(false)
    }, [refresh])

    const getClasses = () => {
        axios.get("api/class/")
            .then((res) => {
                setClasses(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve classifications! Server Error')
            })
    }

    const deleteClass = (id) => {
        axios.post("api/class/delete", { id: id })
            .then(() => {
                setRefresh(true)
                toast.success('Classification has been deleted!')
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to delete classification! Server Error')
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

    const cols = [
        {
            header: 'Name',
            accessorKey: 'name',
            meta: {
                'align': 'center'
            }
        },
        {
            header: 'Actions', accessorKey: '', cell: row => (
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
    ]

    return (
        <div>
            {/* MODALS */}
            <Modal show={addShow} onClose={() => setAddShow(false)}>
                <Modal.Header>ADD CLASSIFICATION</Modal.Header>
                <Modal.Body className='p-5'>
                    <AddClassificationForm refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={updateShow} onClose={() => setUpdateShow(false)}>
                <Modal.Header>UPDATE CLASSIFICATION</Modal.Header>
                <Modal.Body className='p-5'>
                    <UpdateClassForm classification={modalData} refreshDependency={setRefresh} />
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
                            deleteClass(modalData.id)
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

            <TableLayout data={classes} columns={cols} addShow={setAddShow} />
        </div>
    )
}

export default ClassTable