"use client";

import axios from 'axios'
import { imageProxy } from '../../../../assets/constants';

import { Table, Button, Modal } from 'flowbite-react'
import { useState, useEffect, useMemo } from 'react'
import { MdDelete, MdEdit } from "react-icons/md"
import { IoEye } from "react-icons/io5";
import { RiErrorWarningFill } from "react-icons/ri"

import { toast } from 'react-toastify'

import AddImageForm from '../../add/AddImageForm'
import UpdateImageForm from '../../update/UpdateImageForm';

function ImageTable() {
    const [refresh, setRefresh] = useState(true)

    const [images, setImages] = useState([])

    const [deleteShow, setDeleteShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const [addShow, setAddShow] = useState(false)
    const [view, setView] = useState(false)
    const [modalData, setModalData] = useState({})


    useEffect(() => {
        getImages()
        setRefresh(false)
    }, [refresh])

    const getImages = () => {
        axios.get("api/images/")
            .then((res) => {
                setImages(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve images! Server Error')
            })
    }

    const deleteImage = (id) => {
        axios.post("api/images/delete", { id: id })
            .then(() => {
                setRefresh(true)
                toast.success('Image has been deleted!')
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to delete image! Server Error')
            })
    }

    const callView = (data) => {
        setModalData(data)
        setView(true)
    }

    const callUpdate = (data) => {
        setModalData(data)
        setUpdateShow(true)
    }

    const callDelete = (data) => {
        setModalData(data)
        setDeleteShow(true)
    }

    const imageCells = useMemo(() =>
        images.map((image, idx) => {
            return (
                <Table.Row key={idx} className={"hover:bg-slate-200 border h-full truncate " + ((idx % 2 == 0) ? "" : "bg-gray-200")}>
                    <Table.Cell>{image.id}</Table.Cell>
                    <Table.Cell>{image.title}</Table.Cell>
                    <Table.Cell>
                        <Button.Group>
                            <Button color='info' size='sm' onClick={() => { callView(image) }}>
                                <IoEye size={20} />
                            </Button>
                            <Button color='warning' size='sm' onClick={() => { callUpdate(image) }}>
                                <MdEdit size={20} />
                            </Button>
                            <Button color='failure' size='sm' onClick={() => { callDelete(image) }}>
                                <MdDelete size={20} />
                            </Button>
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>
            )
        })
        , [images])


    return (
        <div>
            {/* MODALS */}
            <Modal show={addShow} onClose={() => setAddShow(false)}>
                <Modal.Header>ADD IMAGE</Modal.Header>
                <Modal.Body className='p-5'>
                    <AddImageForm refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={view} onClose={() => setView(false)}>
                <Modal.Header>IMAGE VIEW</Modal.Header>
                <Modal.Body className='p-5 flex justify-center'>
                    <img src={imageProxy + modalData.imgLink} alt="" />
                </Modal.Body>
            </Modal>
            <Modal show={updateShow} onClose={() => setUpdateShow(false)}>
                <Modal.Header>UPDATE IMAGE</Modal.Header>
                <Modal.Body className='p-5'>
                    <UpdateImageForm image={modalData} refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={deleteShow} size="sm" onClose={() => setDeleteShow(false)}>
                <Modal.Body className='flex flex-col p-5 justify-center'>
                    <RiErrorWarningFill className="mx-auto mb-4 h-20 w-20 text-red-600" />
                    <h3 className="mb-5 flex justify-center text-center text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete img #{modalData.id}?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={() => {
                            deleteImage(modalData.id)
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
                <Button color='info' size="xl" onClick={() => setAddShow(1)}>Add Image</Button>
                <Table className='bg-white shadow-lg w-max'>
                    <Table.Head className='shadow-lg text-md text-black'>
                        <Table.HeadCell className='p-5'>Name</Table.HeadCell>
                        <Table.HeadCell className=' p-5 text-center'>Title</Table.HeadCell>
                        <Table.HeadCell className=' p-5 text-center'>Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="gap-1">
                        {imageCells}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

export default ImageTable