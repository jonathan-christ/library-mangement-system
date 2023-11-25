"use client";

import axios from 'axios'

import { Table, Button, Modal } from 'flowbite-react'
import { useState, useEffect, useMemo } from 'react'
import { MdEdit, MdDelete } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"

import StatusHandler from '../../../misc/StatusHandler'
import AddGenreForm from '../../add/AddGenreForm'
import UpdateGenreForm from '../../update/UpdateGenreForm'

function GenreTable() {
    const [refresh, setRefresh] = useState(true)

    const [genres, setGenres] = useState([])
    const [action, setAction] = useState("retrieved")
    const [status, setStatus] = useState(0)

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
                setStatus(500)
            })
    }

    const deleteGenre = (id) => {
        axios.post("api/genres/delete", { id: id })
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

    const genreCells = useMemo(() =>
        genres.map((genre, idx) => {
            return (
                <Table.Row key={idx} className={"hover:bg-slate-200 border h-full truncate " + ((idx % 2 == 0) ? "bg-slate-100" : "bg-gray-200")}>
                    <Table.Cell>{genre.name}</Table.Cell>
                    <Table.Cell>
                        <Button.Group>
                            <Button color='warning' size='sm' onClick={() => { callUpdate(genre) }}>
                                <MdEdit size={20} />
                            </Button>
                            <Button color='failure' size='sm' onClick={() => { callDelete(genre) }}>
                                <MdDelete size={20} />
                            </Button>
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>
            )
        })
        , [genres])


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

            <StatusHandler subject={"Genre/s"} action={action} code={status} dismiss={setStatus} />
            <div className="p-10">
                <Button color='info' size="xl" onClick={() => setAddShow(1)}>Add Genre</Button>
                <Table className='bg-white shadow-lg'>
                    <Table.Head className='shadow-lg text-md text-black'>
                        <Table.HeadCell className='p-5'>Name</Table.HeadCell>
                        <Table.HeadCell >Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="gap-1">
                        {genreCells}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

export default GenreTable