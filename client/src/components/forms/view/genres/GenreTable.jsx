"use client";

import axios from 'axios'

import { Button, Modal } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { MdEdit, MdDelete } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"

import { toast } from 'react-toastify'
import AddGenreForm from '../../add/AddGenreForm'
import UpdateGenreForm from '../../update/UpdateGenreForm'
import TableLayout from '../table/TableLayout';

function GenreTable() {
    const [refresh, setRefresh] = useState(true)

    const [genres, setGenres] = useState([])

    const [deleteShow, setDeleteShow] = useState(false)
    const [addShow, setAddShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const [modalData, setModalData] = useState({})


    useEffect(() => {
        getGenres()
        setRefresh(false)
    }, [refresh])

    const getGenres = () => {
        axios.get("api/genres/")
            .then((res) => {
                setGenres(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve genres! Server Error')
            })
    }

    const deleteGenre = (id) => {
        axios.post("api/genres/delete", { id: id })
            .then(() => {
                setRefresh(true)
                toast.success('Genre has been deleted!')
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to delete genre! Server Error')
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
        { header: 'Name', accessorKey: 'name' },
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
                <Modal.Header>ADD GENRE</Modal.Header>
                <Modal.Body className='p-5'>
                    <AddGenreForm refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={updateShow} onClose={() => setUpdateShow(false)}>
                <Modal.Header>UPDATE GENRE</Modal.Header>
                <Modal.Body className='p-5'>
                    <UpdateGenreForm genre={modalData} refreshDependency={setRefresh} />
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
                            deleteGenre(modalData.id)
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

            <TableLayout data={genres} columns={cols} addShow={setAddShow} />
        </div>
    )
}

export default GenreTable