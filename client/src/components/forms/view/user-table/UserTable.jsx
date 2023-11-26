"use client";

import axios from 'axios'

import { Table, Button, Badge, Modal } from 'flowbite-react'
import { useState, useEffect, useMemo } from 'react'
import { MdEdit, MdDelete } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"

import StatusHandler from '../../../misc/StatusHandler'
import UpdateUserForm from '../../update/UpdateUserForm'
import SignUpForm from '../../add/SignUpForm'

function UserTable() {
    const [refresh, setRefresh] = useState(true)

    const [userList, setUserList] = useState([])
    const [userTypes, setUserTypes] = useState([])
    const [action, setAction] = useState("retrieved")
    const [status, setStatus] = useState(0)

    const [deleteShow, setDeleteShow] = useState(false)
    const [addShow, setAddShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const [modalData, setModalData] = useState({})


    useEffect(() => {
        getUsers()
        getUserTypes()
        setRefresh(false)
    }, [refresh])

    const getUsers = () => {
        axios.get("api/users/").then((res) => {
            setUserList(res.data)
        }).catch((err) => {
            console.log(err)
            setStatus(500)
        })
    }

    const getUserTypes = () => {
        axios.get("api/usertypes/")
            .then((res) => {
                setUserTypes(res.data)
            }).catch((err) => {
                console.log(err)
                setStatus(500)
            })
    }

    const deleteUser = (id) => {
        axios.post("api/users/delete", { id: id })
            .then(() => {
                setRefresh(true)
                setAction("deleted")
                setStatus(200)
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

    const getType = (id) => ({
        1: <Badge color="gray" size="x9l" className="flex justify-center bg-gray-300">Guest</Badge>,
        2: <Badge color="info" size="x9l" className="flex justify-center bg-teal-200">Student</Badge>,
        3: <Badge color="indigo" size="x9l" className="flex justify-center bg-violet-200">Teacher</Badge>,
        4: <Badge color="yellow" size="x9l" className="flex justify-center">Staff</Badge>,
        5: <Badge color="failure" size="x9l" className="flex justify-center bg-red-200 text-red-700">Admin</Badge>,
    }[id])

    const userCells = useMemo(() =>
        userList.map((user, idx) => {
            return (
                <Table.Row key={idx} className={"hover:bg-slate-200 border h-full truncate " + ((idx % 2 == 0) ? "" : "bg-gray-100")}>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {user.lastName}
                    </Table.Cell>
                    <Table.Cell>{user.firstName}</Table.Cell>
                    <Table.Cell>{user.middleName ?? user.middleName[0] + "."}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell className='mx-5'>{getType(user.typeID)}</Table.Cell>
                    <Table.Cell>
                        <Button.Group>
                            <Button color='warning' size='sm' onClick={() => { callUpdate(user) }}>
                                <MdEdit size={20} />
                            </Button>
                            <Button color='failure' size='sm' onClick={() => { callDelete(user) }}>
                                <MdDelete size={20} />
                            </Button>
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>
            )
        })
        , [userList])


    return (
        <div>
            {/* MODALS */}
            <Modal show={addShow} onClose={() => setAddShow(false)}>
                <Modal.Header>ADD USER</Modal.Header>
                <Modal.Body className='p-5'>
                    <SignUpForm refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={updateShow} onClose={() => setUpdateShow(false)}>
                <Modal.Header>UPDATE USER</Modal.Header>
                <Modal.Body className='p-5'>
                    <UpdateUserForm user={modalData} userTypes={userTypes} refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={deleteShow} size="sm" onClose={() => setDeleteShow(false)}>
                <Modal.Body className='flex flex-col p-5 justify-center'>
                    <RiErrorWarningFill className="mx-auto mb-4 h-20 w-20 text-red-600" />
                    <h3 className="mb-5 flex justify-center text-center text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete {modalData.firstName}?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={() => {
                            deleteUser(modalData.id)
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

            <StatusHandler subject={"User/s"} action={action} code={status} dismiss={setStatus} />
            <div className="p-10">
                <Button color='info' size="xl" onClick={() => setAddShow(1)}>Add User</Button>
                <Table className='bg-white shadow-lg w-3/4'>
                    <Table.Head className='shadow-lg text-md text-black'>
                        <Table.HeadCell className='p-5'>Last Name</Table.HeadCell>
                        <Table.HeadCell >First Name</Table.HeadCell>
                        <Table.HeadCell >Middle Name</Table.HeadCell>
                        <Table.HeadCell >Email</Table.HeadCell>
                        <Table.HeadCell className=' p-5 text-center'>Type</Table.HeadCell>
                        <Table.HeadCell className=' p-5 text-center'>Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="gap-1">
                        {userCells}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

export default UserTable