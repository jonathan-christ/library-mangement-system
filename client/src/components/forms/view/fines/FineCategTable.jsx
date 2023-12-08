"use client";

import axios from 'axios'

import { Button, Modal } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { MdEdit, MdDelete } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"

import { toast } from 'react-toastify'
import AddFineCategForm from '../../add/AddFineCategForm'
import UpdateFineCategForm from '../../update/UpdateFineCategForm'
import TableLayout from '../table/TableLayout';

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

    const cols = [
        {
            header: 'Name',
            accessorKey: 'name',
            meta: {
                'align': 'center'
            }
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            meta: {
                'align': 'center'
            }
        },
        {
            header: 'Interval',
            accessorKey: 'frequency',
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

            <TableLayout data={fineCategs} columns={cols} addShow={setAddShow} />
        </div>
    )
}

export default FineCategTable