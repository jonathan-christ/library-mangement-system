"use client";

import axios from 'axios'

import { Table, Button, Modal } from 'flowbite-react'
import { useState, useEffect, useMemo } from 'react'
import { MdEdit, MdDelete } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"

import { toast } from 'react-toastify'
import UpdateUserTypeForm from '../../update/UpdateUserTypeForm'
import AddUserTypeForm from '../../add/AddUserTypeForm'

function UserTypeTable() {
    const [refresh, setRefresh] = useState(true)

    const [userTypes, setUserTypes] = useState([])
    const [deleteShow, setDeleteShow] = useState(false)
    const [addShow, setAddShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const [modalData, setModalData] = useState({})


    useEffect(() => {
        getUserTypes()
        setRefresh(false)
    }, [refresh])

    const getUserTypes = () => {
        axios.get("api/usertypes/")
            .then((res) => {
                setUserTypes(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve user types! Server Error')
            })
    }

    const deleteUserType = (id) => {
        axios.post("api/usertypes/delete", { id: id })
            .then(() => {
                setRefresh(true)
                toast.success('User type has been deleted!')
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to delete user type! Server Error')
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

    const userTypeCells = useMemo(() =>
        userTypes.map((userType, idx) => {
            return (
                <Table.Row key={idx} className={"hover:bg-slate-200 border h-full truncate " + ((idx % 2 == 0) ? "" : "bg-gray-200")}>
                    <Table.Cell>{userType.title}</Table.Cell>
                    <Table.Cell>
                        <Button.Group>
                            <Button color='warning' size='sm' onClick={() => { callUpdate(userType) }}>
                                <MdEdit size={20} />
                            </Button>
                            <Button color='failure' size='sm' onClick={() => { callDelete(userType) }}>
                                <MdDelete size={20} />
                            </Button>
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>
            )
        })
        , [userTypes])


    return (
        <div>
            {/* MODALS */}
            <Modal show={addShow} onClose={() => setAddShow(false)}>
                <Modal.Header>ADD USER TYPE</Modal.Header>
                <Modal.Body className='p-5'>
                    <AddUserTypeForm refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={updateShow} onClose={() => setUpdateShow(false)}>
                <Modal.Header>UPDATE USER TYPE</Modal.Header>
                <Modal.Body className='p-5'>
                    <UpdateUserTypeForm userType={modalData} refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={deleteShow} size="sm" onClose={() => setDeleteShow(false)}>
                <Modal.Body className='flex flex-col p-5 justify-center'>
                    <RiErrorWarningFill className="mx-auto mb-4 h-20 w-20 text-red-600" />
                    <h3 className="mb-5 flex justify-center text-center text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete {modalData.title}?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={() => {
                            deleteUserType(modalData.id)
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

            <div className="p-10 flex flex-col">
                <Button className='w-fit' color='info' size="xl" onClick={() => setAddShow(1)}>Add User Type</Button>
                <Table className='bg-white shadow-lg w-max'>
                    <Table.Head className='shadow-lg text-md text-black'>
                        <Table.HeadCell className=' p-5 text-center'>Title</Table.HeadCell>
                        <Table.HeadCell className=' p-5 text-center'>Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="gap-1">
                        {userTypeCells}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

export default UserTypeTable